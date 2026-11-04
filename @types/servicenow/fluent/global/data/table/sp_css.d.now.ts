import { BooleanColumn, GenericColumn, GuidColumn, StringColumn, Table } from '@servicenow/sdk/core'

export const sp_css = Table({
    actions: {
        read: true,
        update: false,
        delete: false,
        create: false,
    },
    allowClientScripts: false,
    allowConfiguration: false,
    allowNewFields: false,
    allowUiActions: false,
    allowWebServiceAccess: true,
    attributes: {
        update_synch: true,
    },
    audit: true,
    extends: 'sys_metadata',
    label: [
        {
            label: 'Style Sheet',
            help: 'Style sheets that can be added to any Service Portal page or component to overwrite the theme.',
        },
    ],
    name: 'sp_css',
    schema: {
        css: GenericColumn({
            columnType: 'css',
            maxLength: 65000,
        }),
        name: StringColumn({
            attributes: {
                edge_encryption_enabled: true,
            },
            maxLength: 100,
        }),
        sys_id: GuidColumn({
            maxLength: 32,
            primary: true,
        }),
        turn_off_scss_compilation: BooleanColumn({
            default: false,
            label: [
                {
                    label: 'Turn off SCSS compilation',
                    hint: 'If selected then SCSS will not be compiled',
                },
            ],
            maxLength: 40,
        }),
    },
    writeRoles: ['sp_admin'],
})
