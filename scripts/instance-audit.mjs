import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs/promises';
import path from 'node:path';

const run = promisify(execFile);
const root = path.resolve(import.meta.dirname, '..');
const sdk = path.join(root, 'node_modules/@servicenow/sdk/bin/index.js');
const mode = process.argv[2] || 'preflight';
if (!['preflight', 'deployed'].includes(mode)) throw new Error('Use preflight or deployed');
const scope = 'x_lab09_hello_worl';
const prefix = scope + '_midnight';
const widgetIds = ['hero','announcements','catalog','knowledge','requests','support','header'].map(n => prefix + '_' + n);
const instanceIds = ['hero','announcements','catalog','knowledge','requests','support'].map(n => scope + '_mf_' + n + '_i');
async function query(table, encoded, fields) {
  const { stdout } = await run(process.execPath, [sdk, 'query', table, '-q', encoded, '-f', fields, '--limit', '1000', '-o', 'json'], {cwd: root, maxBuffer: 16 * 1024 * 1024, timeout: 90000, windowsHide: true});
  const data = JSON.parse(stdout.trim());
  if (!data.ok || data.hasMore) throw new Error('Incomplete query: ' + table);
  return { table, query: encoded, fields, records: data.records };
}
const checks = {
  portal: ['sp_portal', 'url_suffix=gako_lab09', 'sys_id,title,url_suffix,homepage,theme,default,sys_scope'],
  home: ['sp_page', 'id=gako_lab09_home', 'sys_id,id,title,public,sys_scope'],
  widgetIdentities: ['sp_widget', 'idIN' + widgetIds.join(','), 'sys_id,id,name,sys_scope'],
  headerIdentity: ['sp_header_footer', 'id=' + prefix + '_header', 'sys_id,id,name,sys_scope'],
  instanceIdentities: ['sp_instance', 'idIN' + instanceIds.join(','), 'sys_id,id,sp_widget,sp_column,active,order'],
  nativeWidgets: ['sp_widget', 'sys_idIN8cc0df25875023000f220cf888cb0bb5,94c300c7e777320075c2a117c2f6a9e7,200fbd96cb20020000f8d856634c9ca1,12fbe2d287330300a785940307cb0b1b,5b255672cb03020000f8d856634c9c28', 'sys_id,id,name,sys_scope'],
  nativePages: ['sp_page','idINsc_home,sc_category,sc_cat_item,kb_view,kb_article,search,my_requests,ticket,login,404','sys_id,id,title,public,sys_scope'],
  nativeThemes: ['sp_theme','sys_idIN281507c44317d210ca4c1f425db8f2fd,79315153cb33310000f8d856634c9c4b','sys_id,name'],
  catalog: ['sc_catalog','sys_id=e0d08b13c3330100c8b837659bba8fb4','sys_id,title,active'],
  knowledge: ['kb_knowledge_base','sys_id=a7e8a78bff0221009b20ffffffffff17','sys_id,title,active'],
  searchSources: ['sp_search_source','sys_idINc6170ae86721220023c82e08f585efe6,c96eb1686721220023c82e08f585efff','sys_id,id,name'],
  artworkProperties: ['sys_properties','nameINx_lab09_hello_worl.midnight.art.hero,x_lab09_hello_worl.midnight.art.mystery,x_lab09_hello_worl.midnight.art.drama,x_lab09_hello_worl.midnight.art.scifi','sys_id,name,value'],
  stylesheetIdentity: ['sp_css','name=x_lab09_hello_worl_midnight_styles','sys_id,name'],
  existingUpdateSet: ['sys_update_set','name=GAKO_JoanaCarla Hello World Portal','sys_id,name,state,application'],
  existingCapturedMetadata: ['sys_update_xml','update_set=7e37b29a2f5813108b2f298a6fa4e303','sys_id,name,type,target_name,sys_updated_on'],
  protectedPortals: ['sp_portal','sys_idIN70cd9f3b734b13001fdae9c54cf6a72f,81b75d3147032100ba13a5554ee4902b','sys_id,title,url_suffix,homepage,theme,default,sys_updated_on']
};
// Limit parallel requests to avoid credential-store contention.
const results = {};
for (const [name, args] of Object.entries(checks)) {
  results[name] = await query(...args);
  process.stdout.write(name + ': ' + results[name].records.length + ' records\n');
}
if (mode === 'preflight') {
  const local = JSON.parse(await fs.readFile(path.join(root,'docs/validation/local.json'),'utf8'));
  const ownedIds = new Set(local.records.map(r=>r.sys_id));
  for (const n of ['portal','home','widgetIdentities','headerIdentity','instanceIdentities','artworkProperties','stylesheetIdentity']) {
    if (results[n].records.some(r=>!ownedIds.has(r.sys_id))) throw new Error('Identity collision: ' + n + '. Resolve before build/deploy.');
  }
}
if (mode === 'deployed') {
  const portal = results.portal.records[0];
  const home = results.home.records[0];
  if (results.portal.records.length !== 1 || !home || portal.homepage !== home.sys_id || portal.default !== 'false') throw new Error('Portal wiring/default check failed');
  results.containers = await query('sp_container', 'sp_page=' + home.sys_id, 'sys_id,name,sp_page,order');
  const containers = results.containers.records;
  if (containers.length !== 3) throw new Error('Expected exactly three containers');
  results.rows = await query('sp_row','sp_containerIN' + containers.map(x=>x.sys_id).join(','),'sys_id,sp_container,order');
  results.columns = await query('sp_column','sp_rowIN' + results.rows.records.map(x=>x.sys_id).join(','),'sys_id,sp_row,order');
  results.instances = await query('sp_instance','sp_columnIN' + results.columns.records.map(x=>x.sys_id).join(','),'sys_id,id,sp_widget,sp_column,active,order');
  if (results.instances.records.length !== 6) throw new Error('Expected six direct widget instances');
  results.containerCounts = containers.map(container => {
    const rows = results.rows.records.filter(x=>x.sp_container === container.sys_id).map(x=>x.sys_id);
    const columns = results.columns.records.filter(x=>rows.includes(x.sp_row)).map(x=>x.sys_id);
    const widgets = results.instances.records.filter(x=>columns.includes(x.sp_column) && x.active === 'true' && x.sp_widget);
    if (widgets.length < 2) throw new Error('Fewer than two active widgets in ' + container.name);
    return { name: container.name, sys_id: container.sys_id, activeWidgetInstances: widgets.length };
  });
  results.realUrl = 'https://dev431102.service-now.com/' + portal.url_suffix + '?id=' + home.id;
  const baseline = JSON.parse(await fs.readFile(path.join(root,'docs/instance/preflight.json'),'utf8'));
  if (JSON.stringify(baseline.checks.protectedPortals.records) !== JSON.stringify(results.protectedPortals.records)) throw new Error('Protected portal metadata differs from baseline; investigate');
}
const report = { checkedAt: new Date().toISOString(), sdk: '4.14.0', instance: 'https://dev431102.service-now.com', mode, checks: results };
await fs.mkdir(path.join(root,'docs/instance'),{recursive:true});
await fs.writeFile(path.join(root,'docs/instance',mode+'.json'),JSON.stringify(report,null,2)+'\n');
process.stdout.write('Saved docs/instance/' + mode + '.json\n');
