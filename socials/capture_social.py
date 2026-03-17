#!/usr/bin/env python3
"""Capture Sibyl social card via lossless screenshots stitched into a GIF.
Uses screenshot method for precise frame control and smooth animation.
"""
import subprocess, os, sys, shutil

# ── CONFIG ──
WIDTH = 1080
HEIGHT = 1080
FPS = 50              # max reliable GIF rate (20ms/frame = exact centisecond)
LOOP_DUR = 8.0        # 8s = full CYCLE_MS (clean loop)
TOTAL_FRAMES = int(FPS * LOOP_DUR)
FRAME_INTERVAL_MS = int(1000 / FPS)
WARMUP_MS = 3000

# Crop: trim padding around content
CROP_PCT_LR = 0.01
CROP_PCT_TOP = 0.08
CROP_PCT_BOT = 0.08
CROP_W = int(WIDTH * (1 - 2 * CROP_PCT_LR))
CROP_H = int(HEIGHT * (1 - CROP_PCT_TOP - CROP_PCT_BOT))
CROP_X = int(WIDTH * CROP_PCT_LR)
CROP_Y = int(HEIGHT * CROP_PCT_TOP)

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
HTML_PATH = os.path.join(SCRIPT_DIR, "sibyl_vibe_coding_compared.html")
OUTPUT_GIF = os.path.join(SCRIPT_DIR, "sibyl_social_light_hires.gif")
FRAME_DIR = "/tmp/sibyl_social_frames"

# Clean frame dir
if os.path.exists(FRAME_DIR):
    shutil.rmtree(FRAME_DIR)
os.makedirs(FRAME_DIR)

print(f"Capturing {TOTAL_FRAMES} frames at {WIDTH}x{HEIGHT}, {FPS}fps, {LOOP_DUR}s loop...")

from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": WIDTH, "height": HEIGHT})
    page.goto(f"file://{HTML_PATH}")
    page.wait_for_timeout(WARMUP_MS)

    # Hijack rAF, pause CSS animations, expose manual frame control
    page.evaluate("""
    () => {
        // 1. Stop the rAF loops
        window._stopped = false;
        const origRAF = window.requestAnimationFrame;
        window.requestAnimationFrame = (cb) => {
            if (!window._stopped) return origRAF(cb);
        };
        window._stopped = true;

        // 2. Pause all CSS animations
        document.getAnimations().forEach(a => a.pause());
        window._cssAnims = document.getAnimations();

        // 3. Store base timestamp
        window._baseTs = performance.now();

        // 4. Expose function to render a precise frame
        window.drawAtTime = (elapsedSec) => {
            const ms = elapsedSec * 1000;

            // Seek CSS animations (breathe etc)
            window._cssAnims.forEach(a => {
                if (a.effect && a.effect.getTiming) {
                    const dur = a.effect.getTiming().duration;
                    a.currentTime = ms % (dur || 1);
                }
            });

            // Draw canvas (motes, glow, light streaks)
            // Use clean timestamp from 0 so cycle starts at cycleT=0
            drawFrameBg(ms);

            // Draw leaves
            runLeafCycle(ms);
        };
    }
    """)

    for i in range(TOTAL_FRAMES):
        elapsed = (i / TOTAL_FRAMES) * LOOP_DUR
        page.evaluate(f"window.drawAtTime({elapsed})")
        path = os.path.join(FRAME_DIR, f"frame_{i:04d}.png")
        page.screenshot(path=path, type="png")
        if (i + 1) % 25 == 0 or i == TOTAL_FRAMES - 1:
            print(f"  Frame {i + 1}/{TOTAL_FRAMES}")

    page.close()
    browser.close()

print(f"All {TOTAL_FRAMES} frames captured. Generating GIF...")

palette = "/tmp/sibyl_social_palette.png"

subprocess.run([
    "ffmpeg", "-y", "-framerate", str(FPS),
    "-i", os.path.join(FRAME_DIR, "frame_%04d.png"),
    "-vf", f"crop={CROP_W}:{CROP_H}:{CROP_X}:{CROP_Y},palettegen=max_colors=256:stats_mode=diff",
    palette
], check=True, capture_output=True)

subprocess.run([
    "ffmpeg", "-y", "-framerate", str(FPS),
    "-i", os.path.join(FRAME_DIR, "frame_%04d.png"),
    "-i", palette,
    "-lavfi", f"crop={CROP_W}:{CROP_H}:{CROP_X}:{CROP_Y}[x];[x][1:v]paletteuse=dither=sierra2_4a:diff_mode=rectangle",
    OUTPUT_GIF
], check=True, capture_output=True)

gif_size = os.path.getsize(OUTPUT_GIF) / (1024 * 1024)
print(f"\nGIF: {OUTPUT_GIF}")
print(f"Size: {gif_size:.1f} MB")
print(f"Dimensions: {CROP_W}x{CROP_H} (cropped from {WIDTH}x{HEIGHT})")
print(f"Framerate: {FPS}fps, Loop: {LOOP_DUR}s, Frames: {TOTAL_FRAMES}")
