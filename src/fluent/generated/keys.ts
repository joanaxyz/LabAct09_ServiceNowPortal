import '@servicenow/sdk/global'

declare global {
    namespace Now {
        namespace Internal {
            interface Keys extends KeysRegistry {
                explicit: {
                    bom_json: {
                        table: 'sys_module'
                        id: 'd75852940bb249d4ae13bcd7cfc4668f'
                    }
                    lab09_knowledge_column: {
                        table: 'sp_column'
                        id: 'ba74c50d59ca492db8e468268e14061c'
                    }
                    lab09_support_column: {
                        table: 'sp_column'
                        id: 'c0c843c189594a73a86f17f9573d8a2f'
                    }
                    package_json: {
                        table: 'sys_module'
                        id: '6968217633ae4655bc2ca0442fc99eb3'
                    }
                    x_lab09_hello_worl_midnight_announcements: {
                        table: 'sp_widget'
                        id: '6383fc7e54c04fd1a3d07e4ec3d7d473'
                    }
                    x_lab09_hello_worl_midnight_announcements_instance: {
                        table: 'sp_instance'
                        id: '08f6d943c97943cf97e1419d290c65ea'
                    }
                    x_lab09_hello_worl_midnight_art_drama: {
                        table: 'sys_properties'
                        id: '0163b16ecd794330ac74eaf6239eb8ba'
                        deleted: true
                    }
                    x_lab09_hello_worl_midnight_art_hero: {
                        table: 'sys_properties'
                        id: 'd50edcf0b85f4ef980978c3009012883'
                        deleted: true
                    }
                    x_lab09_hello_worl_midnight_art_mystery: {
                        table: 'sys_properties'
                        id: '649187f84e8840fd889da18778bb85b9'
                        deleted: true
                    }
                    x_lab09_hello_worl_midnight_art_scifi: {
                        table: 'sys_properties'
                        id: 'de421a8aade640048b7df0e8642acddd'
                        deleted: true
                    }
                    x_lab09_hello_worl_midnight_backstage: {
                        table: 'sp_container'
                        id: '43ccb17374d54ee28a67b0eba24a8ae2'
                    }
                    x_lab09_hello_worl_midnight_backstage_col: {
                        table: 'sp_column'
                        id: 'ef79085b36bf4dd0996d577184807162'
                    }
                    x_lab09_hello_worl_midnight_backstage_row: {
                        table: 'sp_row'
                        id: '657c1e8f59cb45e595ac8092f076466f'
                    }
                    x_lab09_hello_worl_midnight_catalog: {
                        table: 'sp_widget'
                        id: 'a43d77f11a6b4f9caad164cf10f60d56'
                    }
                    x_lab09_hello_worl_midnight_catalog_instance: {
                        table: 'sp_instance'
                        id: '015ccb4cd7704a138e59c123c9b9ebe2'
                    }
                    x_lab09_hello_worl_midnight_discover: {
                        table: 'sp_container'
                        id: '22247889d01e4831b0c2b9318d53e4ea'
                    }
                    x_lab09_hello_worl_midnight_discover_col: {
                        table: 'sp_column'
                        id: '2085c47d564043fa95c7e56c2ab86a17'
                    }
                    x_lab09_hello_worl_midnight_discover_row: {
                        table: 'sp_row'
                        id: '7e042718b5174ed08731c570c14c0bb7'
                    }
                    x_lab09_hello_worl_midnight_header: {
                        table: 'sp_header_footer'
                        id: '51b3d138ac5d4611a75f52a75679514e'
                    }
                    x_lab09_hello_worl_midnight_hero: {
                        table: 'sp_widget'
                        id: 'fcad0c3d67b54481b1d5084d4ea5f788'
                    }
                    x_lab09_hello_worl_midnight_hero_instance: {
                        table: 'sp_instance'
                        id: 'e7b914cef1794d6ca98ab31dc63bb00c'
                    }
                    x_lab09_hello_worl_midnight_knowledge: {
                        table: 'sp_widget'
                        id: '31a4c937a7d046aa94e65aeb6264fded'
                    }
                    x_lab09_hello_worl_midnight_knowledge_instance: {
                        table: 'sp_instance'
                        id: '4309350ce5a0410382ae7993cd4d4702'
                    }
                    x_lab09_hello_worl_midnight_opening: {
                        table: 'sp_container'
                        id: 'e692ac3d036b4970834e4416f281b0ce'
                    }
                    x_lab09_hello_worl_midnight_opening_col: {
                        table: 'sp_column'
                        id: 'ee3c7666dec54accb9afac7a53b62fdb'
                    }
                    x_lab09_hello_worl_midnight_opening_row: {
                        table: 'sp_row'
                        id: 'db34ec029b804d6dbca3a0b101236124'
                    }
                    x_lab09_hello_worl_midnight_portal: {
                        table: 'sp_portal'
                        id: '2c0bf7f909364e16927cb72cbbd4a090'
                    }
                    x_lab09_hello_worl_midnight_requests: {
                        table: 'sp_widget'
                        id: 'f057ce3e04cd4ba4b2f6b32fe693d689'
                    }
                    x_lab09_hello_worl_midnight_requests_instance: {
                        table: 'sp_instance'
                        id: '624d0da2bde24aee9347b8254bc72077'
                    }
                    x_lab09_hello_worl_midnight_styles: {
                        table: 'sp_css'
                        id: '245fb718491e491aba19b8ae36daa117'
                    }
                    x_lab09_hello_worl_midnight_styles_include: {
                        table: 'sp_css_include'
                        id: '95267df8a9244d99955190310f133e58'
                    }
                    x_lab09_hello_worl_midnight_support: {
                        table: 'sp_widget'
                        id: '380db8f00e7b44e6a4a18c811ccd8553'
                    }
                    x_lab09_hello_worl_midnight_support_instance: {
                        table: 'sp_instance'
                        id: 'cf1c81bf4f854afd862a15ec94270665'
                    }
                    x_lab09_hello_worl_midnight_theme: {
                        table: 'sp_theme'
                        id: 'daa67a9829e54159b964de395b538acd'
                    }
                }
                composite: [
                    {
                        table: 'm2m_sp_portal_catalog'
                        id: '105aadd161e54ec08b1f9993ca6016be'
                        key: {
                            sp_portal: '2c0bf7f909364e16927cb72cbbd4a090'
                            sc_catalog: 'e0d08b13c3330100c8b837659bba8fb4'
                        }
                    },
                    {
                        table: 'm2m_sp_portal_search_source'
                        id: '114a12e29fae4999936de3e618bedb04'
                        key: {
                            sp_portal: '2c0bf7f909364e16927cb72cbbd4a090'
                            sp_search_source: 'c96eb1686721220023c82e08f585efff'
                        }
                    },
                    {
                        table: 'm2m_sp_portal_search_source'
                        id: '1654ed70bc604c77bd4fbc1889e9cfcd'
                        key: {
                            sp_portal: '2c0bf7f909364e16927cb72cbbd4a090'
                            sp_search_source: 'c6170ae86721220023c82e08f585efe6'
                        }
                    },
                    {
                        table: 'm2m_sp_portal_knowledge_base'
                        id: '6159ab722ea645a48491d5db777d35a0'
                        key: {
                            sp_portal: '2c0bf7f909364e16927cb72cbbd4a090'
                            kb_knowledge_base: 'a7e8a78bff0221009b20ffffffffff17'
                        }
                    },
                    {
                        table: 'sp_page'
                        id: 'e11f9468c0a4499d9ea3771962bfae2d'
                        key: {
                            id: 'gako_lab09_home'
                        }
                    },
                    {
                        table: 'm2m_sp_theme_css_include'
                        id: 'fd97e76fb49b4c4997a53daaae462a1e'
                        key: {
                            sp_css_include: '95267df8a9244d99955190310f133e58'
                            sp_theme: 'daa67a9829e54159b964de395b538acd'
                        }
                    },
                ]
            }
        }
    }
}
