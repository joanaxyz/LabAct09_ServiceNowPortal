import '@servicenow/sdk/global'
import { ServicePortal, SPPage, SPWidget, SPTheme, SPHeaderFooter, Record, CssInclude } from '@servicenow/sdk/core'

// Stable source keys retain ownership of the existing dedicated portal records.
// Only the original geometric logo is attached. No movie assets or demo data ship.

export const hero = SPWidget({
    $id: Now.ID['x_lab09_hello_worl_midnight_hero'], id: 'x_lab09_hello_worl_midnight_hero',
    name: 'LAB09 — Welcome and search', controllerAs: 'c', public: false,
    htmlTemplate: Now.include('../portal/widgets/hero/template.html'),
    clientScript: Now.include('../portal/widgets/hero/client.js'),
    serverScript: Now.include('../portal/widgets/hero/server.js'),
    description: 'Welcome and native Service Portal search.'
})
export const announcements = SPWidget({
    $id: Now.ID['x_lab09_hello_worl_midnight_announcements'], id: 'x_lab09_hello_worl_midnight_announcements',
    name: 'LAB09 — Announcements', controllerAs: 'c', public: false,
    htmlTemplate: Now.include('../portal/widgets/announcements/template.html'),
    clientScript: Now.include('../portal/widgets/announcements/client.js'),
    serverScript: Now.include('../portal/widgets/announcements/server.js'),
    description: 'Displays the native Announcements widget.'
})
export const catalog = SPWidget({
    $id: Now.ID['x_lab09_hello_worl_midnight_catalog'], id: 'x_lab09_hello_worl_midnight_catalog',
    name: 'LAB09 — Service catalog', controllerAs: 'c', public: false,
    htmlTemplate: Now.include('../portal/widgets/catalog/template.html'),
    clientScript: Now.include('../portal/widgets/catalog/client.js'),
    serverScript: Now.include('../portal/widgets/catalog/server.js'),
    description: 'Opens the native service catalog.'
})
export const knowledge = SPWidget({
    $id: Now.ID['x_lab09_hello_worl_midnight_knowledge'], id: 'x_lab09_hello_worl_midnight_knowledge',
    name: 'LAB09 — Knowledge base', controllerAs: 'c', public: false,
    htmlTemplate: Now.include('../portal/widgets/knowledge/template.html'),
    clientScript: Now.include('../portal/widgets/knowledge/client.js'),
    serverScript: Now.include('../portal/widgets/knowledge/server.js'),
    description: 'Published article previews filtered by user access.'
})
export const requests = SPWidget({
    $id: Now.ID['x_lab09_hello_worl_midnight_requests'], id: 'x_lab09_hello_worl_midnight_requests',
    name: 'LAB09 — My requests', controllerAs: 'c', public: false,
    htmlTemplate: Now.include('../portal/widgets/requests/template.html'),
    clientScript: Now.include('../portal/widgets/requests/client.js'),
    serverScript: Now.include('../portal/widgets/requests/server.js'),
    description: 'Displays the native My Requests widget.'
})
export const support = SPWidget({
    $id: Now.ID['x_lab09_hello_worl_midnight_support'], id: 'x_lab09_hello_worl_midnight_support',
    name: 'LAB09 — Help', controllerAs: 'c', public: false,
    htmlTemplate: Now.include('../portal/widgets/support/template.html'),
    clientScript: Now.include('../portal/widgets/support/client.js'),
    serverScript: Now.include('../portal/widgets/support/server.js'),
    description: 'Help links and frequently asked questions.'
})

export const header = SPHeaderFooter({
    $id: Now.ID['x_lab09_hello_worl_midnight_header'], id: 'x_lab09_hello_worl_midnight_header',
    name: 'LAB09 — Navigation', static: true, controllerAs: 'c', public: true,
    htmlTemplate: Now.include('../portal/header/template.html'),
    clientScript: Now.include('../portal/header/client.js'),
    serverScript: Now.include('../portal/header/server.js')
})
export const stylesheet = Record({
    $id: Now.ID['x_lab09_hello_worl_midnight_styles'], table: 'sp_css',
    data: { name: 'x_lab09_hello_worl_midnight_styles', css: Now.include('../portal/styles/page.scss'), turn_off_scss_compilation: false }
})
export const stylesInclude = CssInclude({
    $id: Now.ID['x_lab09_hello_worl_midnight_styles_include'], name: 'LAB09 — Shared styles',
    spCss: stylesheet, lazyLoad: false
})
export const theme = SPTheme({
    $id: Now.ID['x_lab09_hello_worl_midnight_theme'], name: 'LAB09 — Service Portal theme',
    header: header, fixedHeader: false, fixedFooter: false,
    customCss: Now.include('../portal/styles/theme-variables.scss'),
    cssIncludes: [{ order: 100, include: stylesInclude }]
})

export const home = SPPage({
    pageId: 'gako_lab09_home', title: 'LAB09 Service Portal',
    public: false, draft: false, category: 'custom',
    shortDescription: 'Find services, read help articles and track requests.',
    containers: [
        { $id: Now.ID['x_lab09_hello_worl_midnight_opening'], name: 'Welcome & announcements', width: 'container-fluid', order: 100, parentClass: 'mf-page', cssClass: 'mf-container-opening',
          rows: [{ $id: Now.ID['x_lab09_hello_worl_midnight_opening_row'], order: 100, columns: [
            { $id: Now.ID['x_lab09_hello_worl_midnight_opening_col'], size: 12, sizeSm: 12, sizeXs: 12, order: 100, instances: [
              { $id: Now.ID['x_lab09_hello_worl_midnight_hero_instance'], id: 'x_lab09_hello_worl_mf_hero_i', widget: hero, active: true, order: 100 },
              { $id: Now.ID['x_lab09_hello_worl_midnight_announcements_instance'], id: 'x_lab09_hello_worl_mf_announcements_i', widget: announcements, active: true, order: 200 }
            ] }
          ] }] },
        { $id: Now.ID['x_lab09_hello_worl_midnight_discover'], name: 'Services & knowledge', width: 'container-fluid', order: 200, parentClass: 'mf-page', cssClass: 'mf-container-discover',
          rows: [{ $id: Now.ID['x_lab09_hello_worl_midnight_discover_row'], order: 100, columns: [
            { $id: Now.ID['x_lab09_hello_worl_midnight_discover_col'], size: 6, sizeSm: 12, sizeXs: 12, order: 100, instances: [
              { $id: Now.ID['x_lab09_hello_worl_midnight_catalog_instance'], id: 'x_lab09_hello_worl_mf_catalog_i', widget: catalog, active: true, order: 100 }
            ] },
            { $id: Now.ID['lab09_knowledge_column'], size: 6, sizeSm: 12, sizeXs: 12, order: 200, instances: [
              { $id: Now.ID['x_lab09_hello_worl_midnight_knowledge_instance'], id: 'x_lab09_hello_worl_mf_knowledge_i', widget: knowledge, active: true, order: 200 }
            ] }
          ] }] },
        { $id: Now.ID['x_lab09_hello_worl_midnight_backstage'], name: 'Requests & help', width: 'container-fluid', order: 300, parentClass: 'mf-page', cssClass: 'mf-container-backstage',
          rows: [{ $id: Now.ID['x_lab09_hello_worl_midnight_backstage_row'], order: 100, columns: [
            { $id: Now.ID['x_lab09_hello_worl_midnight_backstage_col'], size: 8, sizeSm: 12, sizeXs: 12, order: 100, instances: [
              { $id: Now.ID['x_lab09_hello_worl_midnight_requests_instance'], id: 'x_lab09_hello_worl_mf_requests_i', widget: requests, active: true, order: 100 }
            ] },
            { $id: Now.ID['lab09_support_column'], size: 4, sizeSm: 12, sizeXs: 12, order: 200, instances: [
              { $id: Now.ID['x_lab09_hello_worl_midnight_support_instance'], id: 'x_lab09_hello_worl_mf_support_i', widget: support, active: true, order: 200 }
            ] }
          ] }] }
    ]
})

export const portal = ServicePortal({
    $id: Now.ID['x_lab09_hello_worl_midnight_portal'], title: 'LAB09 Service Portal',
    urlSuffix: 'gako_lab09', homePage: home, theme: theme,
    defaultPortal: false, inactive: false, enableAiSearch: false, enableFavorites: false,
    hidePortalName: true, logoAltText: 'LAB09 Service Portal',
    logo: Now.attach('../portal/assets/lab09-logo.svg'),
    loginPage: '6995a144cb11120000f8d856634c9c25', notFoundPage: '3c2c9063cb11020000f8d856634c9c1f',
    catalogHomePage: 'fe87a11147132100ba13a5554ee490b9', categoryHomePage: '07261a2147132100ba13a5554ee49092',
    knowledgeHomePage: 'db9fcab847101200ba13a5554ee490cf',
    catalogs: [{ catalog: 'e0d08b13c3330100c8b837659bba8fb4', order: 100, active: true }],
    knowledgeBases: [{ knowledgeBase: 'a7e8a78bff0221009b20ffffffffff17', order: 100, active: true }],
    searchSources: [{ searchSource: 'c96eb1686721220023c82e08f585efff', order: 100 }, { searchSource: 'c6170ae86721220023c82e08f585efe6', order: 200 }]
})
