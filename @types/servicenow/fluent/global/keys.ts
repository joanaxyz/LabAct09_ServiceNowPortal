import '@servicenow/sdk/global'

declare global {
    namespace Now {
        namespace Internal {
            interface Keys extends KeysRegistry {
                explicit: {
                    bom_json: {
                        table: 'sys_module'
                        id: '761b11a3adcc4a64802be36aba23562f'
                    }
                    package_json: {
                        table: 'sys_module'
                        id: '61c5288cd0bc4692931e369083630991'
                    }
                }
                composite: [
                    {
                        table: 'ua_table_licensing_config'
                        id: '211388d10cfb03106c6c6604db46db7e'
                        key: {
                            name: 'sp_css'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '304040d90cb703106c6c6604db46db10'
                        key: {
                            name: 'sp_css'
                            element: 'css'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '704040d90cb703106c6c6604db46db12'
                        key: {
                            name: 'sp_css'
                            element: 'turn_off_scss_compilation'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '744040d90cb703106c6c6604db46db0c'
                        key: {
                            name: 'sp_css'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '784040d90cb703106c6c6604db46db13'
                        key: {
                            name: 'sp_css'
                            element: 'sys_id'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b44040d90cb703106c6c6604db46db10'
                        key: {
                            name: 'sp_css'
                            element: 'css'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b84040d90cb703106c6c6604db46db0b'
                        key: {
                            name: 'sp_css'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'bc4040d90cb703106c6c6604db46db0d'
                        key: {
                            name: 'sp_css'
                            element: 'name'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'f04040d90cb703106c6c6604db46db13'
                        key: {
                            name: 'sp_css'
                            element: 'sys_id'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'f44040d90cb703106c6c6604db46db09'
                        key: {
                            name: 'sp_css'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'f84040d90cb703106c6c6604db46db0e'
                        key: {
                            name: 'sp_css'
                            element: 'name'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'f84040d90cb703106c6c6604db46db11'
                        key: {
                            name: 'sp_css'
                            element: 'turn_off_scss_compilation'
                        }
                    },
                ]
            }
        }
    }
}
