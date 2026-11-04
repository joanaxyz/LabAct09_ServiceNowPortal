# Deployment result

[LAB09 Service Portal](https://dev431102.service-now.com/gako_lab09?id=gako_lab09_home) is deployed on the dedicated development instance. The current source build and live checks passed on 4 November 2026.

Portal: `2c0bf7f909364e16927cb72cbbd4a090`. Home: `e11f9468c0a4499d9ea3771962bfae2d` (`gako_lab09_home`). Theme: `daa67a9829e54159b964de395b538acd`. Default=false. The new suffix and page ID were queried for availability before updating the same owned records.

## Records and page structure

- **Welcome & announcements** — `e692ac3d036b4970834e4416f281b0ce`: 2 direct active widget instances.
- **Services & knowledge** — `22247889d01e4831b0c2b9318d53e4ea`: 2 direct active widget instances.
- **Requests & help** — `43ccb17374d54ee28a67b0eba24a8ae2`: 2 direct active widget instances.

The [source inventory](RECORDS.md) lists all current record IDs. Server traversal and the rendered DOM verify 3 containers with 2 instances each. The 6 widgets are distinct custom definitions, with verified native Announcements and My Requests reused inside their dedicated wrappers.

## Update Set

**GAKO_JoanaCarla Hello World Portal**, sys_id `82b45c2e2f5453108b2f298a6fa4e34c`, state **Complete**, application `x_lab09_hello_worl`. **46 Customer Updates**; no child set is needed. Use [the supplied XML](../submission/GAKO_JoanaCarla%20Hello%20World%20Portal.xml), which contains the current revision.

| Payload record type | Count |
|---|---:|
| m2m_sp_portal_catalog | 1 |
| m2m_sp_portal_knowledge_base | 1 |
| m2m_sp_portal_search_source | 2 |
| m2m_sp_theme_css_include | 1 |
| sp_column | 5 |
| sp_container | 3 |
| sp_css | 1 |
| sp_css_include | 1 |
| sp_header_footer | 1 |
| sp_instance | 6 |
| sys_translated_text | 13 |
| sp_page | 1 |
| sp_portal | 1 |
| sys_attachment | 1 |
| sys_attachment_doc | 2 |
| sp_row | 3 |
| sp_theme | 1 |
| sp_widget | 6 |
| sys_app | 1 |
| sys_module | 2 |
| sys_properties | 4 |
| sys_scope_privilege | 5 |

The four sys_properties entries are **DELETE** actions for retired image properties, not active properties or seeded data. The one attachment and two chunks are the current original logo. Every binary and exported payload was verified against source/on-instance metadata. File size 164747 bytes; SHA-256 `6a586b8b6072069340cd48e5f0aae4850fb9efb9e09665c1e9f6c7aa3eaf869b`.

SDK install was not assumed to capture the UI Update Set. The original SDK install succeeded; this instance later rejected incremental install as a third-party application. Updates used verified SDK-generated XML through an ownership-guarded SDK execution and native update manager, with rollback tracking. [Actual execution result](instance/service-deployment.json). Native Publish to Update Set then captured the app with demo data excluded, followed by native Export to XML.

## Live checks

- Original logo, current service-focused content and correct home wiring.
- 3 actual containers / 6 active direct instances; five native layout columns.
- 1440, 768, 720, 390 and 320px widths without horizontal page overflow.
- Mobile menu, keyboard FAQ, reduced motion and readable native controls.
- Genuine announcement empty state, real knowledge previews, native request open/closed filters and search.
- Native closed/open transitions and request search work without recreating or duplicating the embedded widget. A direct View all link opens the full native requests page.
- Native search, catalog/request form, knowledge article and branded return-home navigation checked as admin.
- Protected default portals match the preflight baseline. No business data was seeded.

Full-page screenshots use the real native search filter for the existing Lab 8.1.1 request. The internal Service Portal scroll wrapper was temporarily expanded only in the QA browser for capture, then restored. The workbook embeds that same screenshot.

The first service design received an independent review. A further independent review of the sleek revision could not finish because its evaluator reached a usage limit. Final desktop/mobile visual review and live functional/responsive QA were completed by the primary agent. Non-admin eligibility and second-instance transport remain untested.

[Official SDK 4.14.0 Service Portal guide](https://servicenow.github.io/sdk/4.14.0/guides/service-portal-guide) · [Native publication procedure](https://www.servicenow.com/docs/r/application-development/t_PublishApplicationsToAnUpdateSet.html)
