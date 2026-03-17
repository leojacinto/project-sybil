import '@servicenow/sdk/global'

declare global {
    namespace Now {
        namespace Internal {
            interface Keys extends KeysRegistry {
                explicit: {
                    bom_json: {
                        table: 'sys_module'
                        id: '1e86f075499f4e22b877c8b31267502f'
                    }
                    default_state_to_draft: {
                        table: 'sys_script'
                        id: '374310715c524046bb1ee554fe918bc4'
                    }
                    default_traveler_to_current_user: {
                        table: 'sys_script'
                        id: 'cc0f973ac769401dbd5eb6ae47543ec2'
                    }
                    package_json: {
                        table: 'sys_module'
                        id: 'ab1f9875e07f49c69d4d30ba1aee68a0'
                    }
                    sample_berlin: {
                        table: 'x_snc_travel_request'
                        id: '694615df4e6e4d6fb77fd27b2215d0ab'
                    }
                    sample_london: {
                        table: 'x_snc_travel_request'
                        id: '3fc46687ff1741448e4a4ed2912c358a'
                    }
                    sample_sf: {
                        table: 'x_snc_travel_request'
                        id: '59d0142250e4433f9f064eae7cc7c5cb'
                    }
                    sample_sydney: {
                        table: 'x_snc_travel_request'
                        id: 'ecd1c2002aa049d3ba056c6166fa395a'
                    }
                    sample_tokyo: {
                        table: 'x_snc_travel_request'
                        id: '6bfd6cdd3929488ea35fb71ab564e51b'
                    }
                    travel_app_menu: {
                        table: 'sys_app_application'
                        id: 'cc2bc9d711fc4157a25eea15c4f6bf92'
                    }
                    travel_request_create_acl: {
                        table: 'sys_security_acl'
                        id: '1fc87a711a174103b35f58c293869b1d'
                    }
                    travel_request_delete_acl: {
                        table: 'sys_security_acl'
                        id: '75053800311348d4b898950656e59e3f'
                    }
                    travel_request_read_acl: {
                        table: 'sys_security_acl'
                        id: '22d63a57dec942ac8507996c809cee36'
                    }
                    travel_request_write_acl: {
                        table: 'sys_security_acl'
                        id: '398710bcf06c43169df231cf2b4f7981'
                    }
                    validate_estimated_cost: {
                        table: 'sys_script'
                        id: '28e21c91a1614eb8a909e024074d5397'
                    }
                    validate_return_date: {
                        table: 'sys_script'
                        id: 'ef78c0df30e54b97ad7cee27de378d44'
                    }
                }
                composite: [
                    {
                        table: 'sys_ui_page'
                        id: '00abc1265e284af79c1a4ab059d863ea'
                        key: {
                            endpoint: 'x_snc_travel_request_ui.do'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: '01af5bbbad774d7aa623b736de8f450f'
                        key: {
                            name: 'x_snc_travel/app.js.map'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '05462169fdd248ebb4323625d8c334fe'
                        key: {
                            name: 'x_snc_travel_request'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '05e00dc986a04def98e9f9e3fe9f2876'
                        key: {
                            name: 'x_snc_travel_request'
                            element: 'x_snc_travel_travel_type'
                            value: 'international'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '0738182acd144f8eae4de5a0762c815f'
                        key: {
                            sys_security_acl: '1fc87a711a174103b35f58c293869b1d'
                            sys_user_role: {
                                id: '85c8395a10ef433d82884c71cb96f561'
                                key: {
                                    name: 'admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '08ffb8004c8445daa9c678f16a67a0a0'
                        key: {
                            name: 'x_snc_travel_request'
                            element: 'x_snc_travel_destination'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '10b3b92dfeec4b27b5c118c1d84766b4'
                        key: {
                            name: 'x_snc_travel_request'
                            element: 'x_snc_travel_travel_type'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: '179038a27c284a6685f81b8b60fc2e4b'
                        key: {
                            application_file: '01af5bbbad774d7aa623b736de8f450f'
                            source_artifact: 'ec38e003e9fb46dea630f0eef344ac56'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '1b39ae31d443486aacc5ccd4d4c1ff05'
                        key: {
                            name: 'x_snc_travel_request'
                            element: 'x_snc_travel_estimated_cost'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '1d7503b2db1b40afa728ce3716f52e55'
                        key: {
                            name: 'x_snc_travel_request'
                            element: 'x_snc_travel_purpose'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '2253a86619144fb6924b55d66a3f72f2'
                        key: {
                            name: 'x_snc_travel_request'
                            element: 'x_snc_travel_destination'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '2856f4a6406f4d278fd70ec3c6479903'
                        key: {
                            name: 'x_snc_travel_request'
                            element: 'x_snc_travel_travel_type'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '33dcf8477b704fefad4856d9d3bd51bc'
                        key: {
                            sys_security_acl: '75053800311348d4b898950656e59e3f'
                            sys_user_role: {
                                id: '75b6489d48024ffdb06f704e427ef96d'
                                key: {
                                    name: 'admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '3aa00526a93545f0afdb4ca82122c47f'
                        key: {
                            sys_security_acl: '22d63a57dec942ac8507996c809cee36'
                            sys_user_role: {
                                id: 'b0329f39cf1743e0abbe871631f116f9'
                                key: {
                                    name: 'itil'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '3b06cefbe4b3417395f33479e476c3a2'
                        key: {
                            name: 'x_snc_travel_request'
                            element: 'x_snc_travel_state'
                            value: 'submitted'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '3becb2af974c4cb1a0a110afc45adbbc'
                        key: {
                            sys_security_acl: '398710bcf06c43169df231cf2b4f7981'
                            sys_user_role: {
                                id: '835e8a5c7aaf4216a6587508e4a583ce'
                                key: {
                                    name: 'itil'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '44e95d0d7f0f4c708adb0e6f56f7bcd3'
                        key: {
                            name: 'x_snc_travel_request'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '456949aa51bf46f4ba75ae9a242bc388'
                        key: {
                            name: 'x_snc_travel_request'
                            element: 'x_snc_travel_traveler'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '4656b164596a47b4a45053e6a336aece'
                        key: {
                            name: 'x_snc_travel_request'
                            element: 'x_snc_travel_state'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '46a89acdaa9d4b50b10c81dcc38a7035'
                        key: {
                            name: 'x_snc_travel_request'
                            element: 'x_snc_travel_state'
                            value: 'rejected'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '511d3786ed3a4817ad600da2fb94d290'
                        key: {
                            name: 'x_snc_travel_request'
                            element: 'x_snc_travel_departure_date'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: '51988e486dbe423984a6e4c60aeddab4'
                        key: {
                            application_file: 'c75b9c4ad9b44ac0a3323a78760f9fc3'
                            source_artifact: 'ec38e003e9fb46dea630f0eef344ac56'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '670c6ce5133c4db2bb62cb57df81e7fa'
                        key: {
                            name: 'x_snc_travel_request'
                            element: 'x_snc_travel_return_date'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '682810ab0c784ec3ad7153199ebfde00'
                        key: {
                            name: 'x_snc_travel_request'
                            element: 'x_snc_travel_state'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '69cbd6930e6043cebfc4f4198babc4a2'
                        key: {
                            name: 'x_snc_travel_request'
                            element: 'x_snc_travel_estimated_cost'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '7f60b37b0be2458f99c1c2ca2b166c72'
                        key: {
                            sys_security_acl: '1fc87a711a174103b35f58c293869b1d'
                            sys_user_role: {
                                id: '28e50316a937448bbab5588599dae310'
                                key: {
                                    name: 'itil'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '84a74dcba93a4f9fad40b76cc2f35459'
                        key: {
                            name: 'x_snc_travel_request'
                            element: 'x_snc_travel_travel_type'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '96ccb1fa85824873b6a01271eaf7b73b'
                        key: {
                            name: 'x_snc_travel_request'
                            element: 'x_snc_travel_traveler'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '987b918cbafc432dbcc452a7175b1c49'
                        key: {
                            name: 'x_snc_travel_request'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'a537c538c54145dd971d970adfb065fe'
                        key: {
                            name: 'x_snc_travel_request'
                            element: 'x_snc_travel_state'
                            value: 'draft'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'ae2a852e3fb24c4e883e486be71972d5'
                        key: {
                            name: 'x_snc_travel_request'
                            element: 'x_snc_travel_state'
                            value: 'approved'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'ae808ed55ba2418e8fabc060ccb733d1'
                        key: {
                            name: 'x_snc_travel_request'
                            element: 'x_snc_travel_travel_type'
                            value: 'domestic'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b5dc7affa1ac48fc88cc98464f5b75e1'
                        key: {
                            name: 'x_snc_travel_request'
                            element: 'x_snc_travel_departure_date'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c331290ecd5f413c971665c0c5d0b97a'
                        key: {
                            name: 'x_snc_travel_request'
                            element: 'x_snc_travel_return_date'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: 'c3c1f3308225484380b16a8ff8dd1e81'
                        key: {
                            application_file: '00abc1265e284af79c1a4ab059d863ea'
                            source_artifact: 'ec38e003e9fb46dea630f0eef344ac56'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: 'c75b9c4ad9b44ac0a3323a78760f9fc3'
                        key: {
                            name: 'x_snc_travel/app'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: 'cecc0e0c83e243eaa6c244a11ea55a15'
                        key: {
                            name: 'x_snc_travel_request'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'd08702fc9b0f4a6c98c020fd3956c567'
                        key: {
                            name: 'x_snc_travel_request'
                            element: 'x_snc_travel_state'
                            value: 'completed'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'e7c78030c2144416a9fa8b914aa1ef24'
                        key: {
                            name: 'x_snc_travel_request'
                            element: 'x_snc_travel_state'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact'
                        id: 'ec38e003e9fb46dea630f0eef344ac56'
                        key: {
                            name: 'x_snc_travel_request_ui.do - BYOUI Files'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'fb8a4b1e3cac435dbbdf01ac71a89115'
                        key: {
                            name: 'x_snc_travel_request'
                            element: 'x_snc_travel_purpose'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'fe83728ea4c646e092aa3be1745e22c6'
                        key: {
                            sys_security_acl: '22d63a57dec942ac8507996c809cee36'
                            sys_user_role: {
                                id: '696b1b52099a4c96987f4b1d31b9ecdc'
                                key: {
                                    name: 'admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'ffd7f62fd32342ceb477707a01f16f0b'
                        key: {
                            sys_security_acl: '398710bcf06c43169df231cf2b4f7981'
                            sys_user_role: {
                                id: '8654e375b00b45c893bb0f765c406c49'
                                key: {
                                    name: 'admin'
                                }
                            }
                        }
                    },
                ]
            }
        }
    }
}
