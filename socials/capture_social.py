#!/usr/bin/env python3
"""Capture Sibyl April comparison card via lossless screenshots stitched into a GIF.
Uses virtual time injection for deterministic frame control of setTimeout/rAF animation.
"""
import subprocess, os, sys, shutil

# ── CONFIG ──
WIDTH = 1400
HEIGHT = 800
LOOP_DUR = 13.0       # 13s animation cycle
TOTAL_FRAMES = 390
FRAME_INTERVAL_MS = LOOP_DUR * 1000 / TOTAL_FRAMES  # 33.33ms per frame
FPS = TOTAL_FRAMES / LOOP_DUR  # ~30fps
WARMUP_FRAMES = TOTAL_FRAMES  # 1 full cycle warmup for clean loop point

# Crop to content area (skip left/right whitespace)
CLIP_X = 300
CLIP_Y = 0
CLIP_W = 800
CLIP_H = 800

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
HTML_PATH = os.path.join(SCRIPT_DIR, "sibyl_comparison_april.html")
OUTPUT_GIF = os.path.join(SCRIPT_DIR, "sibyl_comparison_april.gif")
FRAME_DIR = "/tmp/sibyl_april_frames"

# Clean frame dir
if os.path.exists(FRAME_DIR):
    shutil.rmtree(FRAME_DIR)
os.makedirs(FRAME_DIR)

print(f"Config: {TOTAL_FRAMES} frames, {WIDTH}x{HEIGHT}, {FPS}fps, {LOOP_DUR}s loop")
print(f"Output: {CLIP_W}x{CLIP_H} (cropped from {WIDTH}x{HEIGHT})")

# Virtual time system: overrides setTimeout, clearTimeout, rAF, performance.now
# so we can advance time frame-by-frame for deterministic capture.
VIRTUAL_TIME_SCRIPT = """
window.__virtualTime = 0;
window.__pendingTimeouts = [];
window.__nextTimeoutId = 1;
window.__rafCallbacks = [];

performance.now = () => window.__virtualTime;
const _origDateNow = Date.now;
Date.now = () => window.__virtualTime;

const _origSetTimeout = window.setTimeout;
window.setTimeout = (fn, delay, ...args) => {
    if (typeof fn !== 'function') return 0;
    const id = window.__nextTimeoutId++;
    window.__pendingTimeouts.push({ id, fn, fireAt: window.__virtualTime + (delay || 0), args });
    return id;
};

const _origClearTimeout = window.clearTimeout;
window.clearTimeout = (id) => {
    window.__pendingTimeouts = window.__pendingTimeouts.filter(t => t.id !== id);
};

window.requestAnimationFrame = (cb) => {
    window.__rafCallbacks.push(cb);
    return window.__rafCallbacks.length;
};

window.tick = (deltaMs) => {
    window.__virtualTime += deltaMs;

    // Fire expired timeouts (loop: firing may schedule new ones)
    let safety = 0;
    let fired = true;
    while (fired && safety < 2000) {
        fired = false;
        safety++;
        const ready = window.__pendingTimeouts.filter(t => t.fireAt <= window.__virtualTime);
        for (const t of ready) {
            window.__pendingTimeouts = window.__pendingTimeouts.filter(pt => pt.id !== t.id);
            try { t.fn(...t.args); } catch(e) { console.error('tick timeout error:', e); }
            fired = true;
        }
    }

    // Fire rAF callbacks (current batch only)
    const cbs = window.__rafCallbacks.splice(0);
    for (const cb of cbs) {
        try { cb(window.__virtualTime); } catch(e) { console.error('tick rAF error:', e); }
    }
};
"""

from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": WIDTH, "height": HEIGHT})

    # Inject virtual time BEFORE page JS runs
    page.add_init_script(VIRTUAL_TIME_SCRIPT)

    page.goto(f"file://{HTML_PATH}")
    page.wait_for_timeout(500)  # let DOM parse

    # Warm up: run 1 full cycle so capture starts at a clean loop boundary
    print(f"Warming up ({WARMUP_FRAMES} frames = {LOOP_DUR}s virtual)...")
    for i in range(WARMUP_FRAMES):
        page.evaluate(f"window.tick({FRAME_INTERVAL_MS})")
        if (i + 1) % 200 == 0:
            print(f"  Warmup {i + 1}/{WARMUP_FRAMES}")

    # Capture frames
    print(f"Capturing {TOTAL_FRAMES} frames...")
    for i in range(TOTAL_FRAMES):
        page.evaluate(f"window.tick({FRAME_INTERVAL_MS})")
        path = os.path.join(FRAME_DIR, f"frame_{i:04d}.png")
        page.screenshot(path=path, type="png", clip={"x":CLIP_X,"y":CLIP_Y,"width":CLIP_W,"height":CLIP_H})
        if (i + 1) % 50 == 0 or i == TOTAL_FRAMES - 1:
            print(f"  Frame {i + 1}/{TOTAL_FRAMES}")

    page.close()
    browser.close()

print(f"\nAll {TOTAL_FRAMES} frames captured. Generating GIF...")

palette = "/tmp/sibyl_april_palette.png"

subprocess.run([
    "ffmpeg", "-y", "-framerate", str(FPS),
    "-i", os.path.join(FRAME_DIR, "frame_%04d.png"),
    "-vf", "scale=680:680,palettegen=max_colors=128:stats_mode=diff",
    palette
], check=True, capture_output=True)

subprocess.run([
    "ffmpeg", "-y", "-framerate", str(FPS),
    "-i", os.path.join(FRAME_DIR, "frame_%04d.png"),
    "-i", palette,
    "-lavfi", "scale=680:680[x];[x][1:v]paletteuse=dither=sierra2_4a:diff_mode=rectangle",
    OUTPUT_GIF
], check=True, capture_output=True)

gif_size = os.path.getsize(OUTPUT_GIF) / (1024 * 1024)
print(f"\nGIF: {OUTPUT_GIF}")
print(f"Size: {gif_size:.1f} MB")
print(f"Dimensions: 680x680 (from {CLIP_W}x{CLIP_H} crop of {WIDTH}x{HEIGHT})")
print(f"Framerate: {FPS}fps, Loop: {LOOP_DUR}s, Frames: {TOTAL_FRAMES}")
