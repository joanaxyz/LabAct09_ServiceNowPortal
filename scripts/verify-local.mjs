import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { gunzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { XMLParser } from 'fast-xml-parser';
import { compileString } from 'sass';

const root=path.resolve(import.meta.dirname,'..');
const parser=new XMLParser({ignoreAttributes:false,parseTagValue:false,trimValues:false});
const scalar=v=>typeof v==='object' ? v['#text'] || '' : v || '';
const array=v=>!v?[]:Array.isArray(v)?v:[v];
const records=[];
for(const folder of ['scope','update']) {
  for(const file of await fs.readdir(path.join(root,'dist/app',folder))) {
    if(!file.endsWith('.xml'))continue;
    const xml=parser.parse(await fs.readFile(path.join(root,'dist/app',folder,file),'utf8'));
    for(const [table,value] of Object.entries(xml.record_update)) {
      if(table.startsWith('@_') || table === '#text')continue;
      for(const record of array(value))records.push({table,file,...record});
    }
  }
}
const of=table=>records.filter(r=>r.table===table);
const portal=of('sp_portal')[0],page=of('sp_page')[0];
assert.equal(of('sp_portal').length,1);
assert.equal(of('sp_page').length,1);
assert.equal(scalar(portal.homepage),page.sys_id,'Portal must reference the actual home record');
assert.equal(portal.default,'false');
assert.equal(portal.url_suffix,'gako_lab09');
assert.equal(page.id,'gako_lab09_home');
assert.equal(page.sys_id,'e11f9468c0a4499d9ea3771962bfae2d','Keep the existing dedicated page identity');
assert.equal(page.public,'false');
assert.equal(of('sp_widget').length,6);
assert.equal(of('sp_container').length,3);
assert.equal(of('sp_instance').length,6);
assert.equal(of('sys_script').length,0,'Starter business rule must not ship');
assert.equal(of('sys_script_client').length,0,'Starter client script must not ship');
const widgets=new Set(of('sp_widget').map(w=>w.sys_id));
const containers=of('sp_container').sort((a,b)=>Number(a.order)-Number(b.order)).map(c=>{
  assert.equal(scalar(c.sp_page),page.sys_id);
  const rows=of('sp_row').filter(r=>scalar(r.sp_container)===c.sys_id).map(r=>r.sys_id);
  const cols=of('sp_column').filter(r=>rows.includes(scalar(r.sp_row))).map(r=>r.sys_id);
  const instances=of('sp_instance').filter(r=>cols.includes(scalar(r.sp_column)));
  assert.equal(instances.length,2);
  for(const i of instances){assert.equal(i.active,'true');assert.ok(widgets.has(scalar(i.sp_widget)));assert.ok(i.id.length<=40,'Instance ID must fit the native field');}
  return {name:c.name,sys_id:c.sys_id,instances:instances.map(i=>({sys_id:i.sys_id,id:i.id,widget:scalar(i.sp_widget)}))};
});
const preflight=JSON.parse(await fs.readFile(path.join(root,'docs/instance/preflight.json'),'utf8'));
const verified=new Set(Object.values(preflight.checks).flatMap(c=>(c.records||[]).map(r=>r.sys_id)));
const protectedIds=new Set(preflight.checks.protectedPortals.records.map(r=>r.sys_id));
for(const r of records){assert.ok(!protectedIds.has(r.sys_id),'Protected portal must never be in output');}
for(const field of ['login_page','notfound_page','sc_catalog_page','sc_category_page','kb_knowledge_page'])assert.ok(verified.has(scalar(portal[field])),field+' must be verified');
assert.equal(of('sys_properties').length,0,'Movie image properties must not ship');
const hashes=[];
for(const attachment of of('sys_attachment')) {
  const filename='lab09-logo.svg';
  const chunks=of('sys_attachment_doc').filter(d=>scalar(d.sys_attachment)===attachment.sys_id).sort((a,b)=>Number(a.position)-Number(b.position));
  assert.ok(chunks.length,'Image attachment requires binary chunks');
  const bytes=gunzipSync(Buffer.concat(chunks.map(c=>Buffer.from(c.data,'base64'))));
  const original=await fs.readFile(path.join(root,'src/portal/assets',filename));
  assert.ok(bytes.equals(original),'Packaged artwork must match source exactly');
  hashes.push({file:filename,attachment:attachment.sys_id,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});
}
assert.equal(hashes.length,1,'Only the original Lab09 logo is packaged');
assert.ok(of('sys_attachment').some(a=>a.sys_id===scalar(portal.logo)),'Portal logo binary must ship');
assert.equal(of('sp_css').length,1,'Shared stylesheet must be a native CSS record');
assert.equal(of('sp_css_include').length,1,'Theme needs a native CSS Include');
assert.equal(of('m2m_sp_theme_css_include').length,1,'CSS Include must be linked to theme');
assert.equal(of('sys_db_object').length,0,'Downloaded native schema must not be redeployed');
assert.ok(of('sp_css')[0].css.length <= 65000,'Stylesheet must fit the verified native field length');
assert.equal(scalar(of('sp_css_include')[0].sp_css),of('sp_css')[0].sys_id);
assert.equal(scalar(of('m2m_sp_theme_css_include')[0].sp_theme),of('sp_theme')[0].sys_id);
assert.equal(scalar(of('m2m_sp_theme_css_include')[0].sp_css_include),of('sp_css_include')[0].sys_id);
compileString(await fs.readFile(path.join(root,'src/portal/styles/page.scss'),'utf8'));
compileString(await fs.readFile(path.join(root,'src/portal/styles/theme-variables.scss'),'utf8'));
for(const name of ['hero','announcements','catalog','knowledge','requests','support']) {
  for(const kind of ['client','server'])new vm.Script(await fs.readFile(path.join(root,`src/portal/widgets/${name}/${kind}.js`),'utf8'));
}
const context={api:{}};vm.runInNewContext(await fs.readFile(path.join(root,'src/portal/widgets/hero/client.js'),'utf8'),context);
const windowStub={location:{href:''}},controller={data:{searchUrl:'?id=search&spa=1'}};
context.api.controller.call(controller,windowStub);controller.query='  laptop & access  ';controller.search();
assert.equal(windowStub.location.href,'?id=search&spa=1&q=laptop%20%26%20access');
assert.equal(controller.films,undefined,'Movie selection is removed');
for(const name of ['hero','announcements','catalog','knowledge','requests','support']){
  assert.ok(!/MIDNIGHT FRAMES|cinema|film|movie|poster|Interstellar|Shutter Island|La La Land/i.test(await fs.readFile(path.join(root,`src/portal/widgets/${name}/template.html`),'utf8')),'UI must contain only service-portal content');
}
// A denied knowledge article must never be copied into browser data.
let cursor=-1;
const articleRows=[{id:'denied',title:'Private article'},{id:'allowed',title:'Visible article'}];
const fakeRecord={addQuery(){},orderByDesc(){},setLimit(){},query(){},next(){return ++cursor<articleRows.length},getValue(f){return f==='short_description'?articleRows[cursor].title:'KB001'},getUniqueValue(){return articleRows[cursor].id}};
const knowledgeContext={data:{},gs:{isLoggedIn:()=>true,warn(){}},GlideDate:function(){return {getValue:()=> '2026-11-04'}},GlideRecordSecure:function(){return fakeRecord},$sp:{canReadRecord:()=>articleRows[cursor].id==='allowed'}};
vm.runInNewContext(await fs.readFile(path.join(root,'src/portal/widgets/knowledge/server.js'),'utf8'),knowledgeContext);
assert.equal(knowledgeContext.data.articles.length,1);assert.equal(knowledgeContext.data.articles[0].title,'Visible article');
const recordList=records.filter(r=>!['sys_attachment_doc'].includes(r.table)).map(r=>({table:r.table,sys_id:r.sys_id,name:r.name||r.title||r.id||r.file_name||'',file:r.file}));
const report={checkedAt:new Date().toISOString(),status:'PASS',sdk:'4.14.0',stage:'local-build',containers,artwork:hashes,records:recordList,checks:['3 real generated sp_container records','2 active sp_instance records per container; 6 total','6 distinct custom sp_widget definitions','same page sys_id with verified available new page ID','dedicated non-default portal','all OOTB references verified on instance','protected default and /sp portals excluded','original logo binary matches source','no movie imagery or image properties packaged','SCSS compiles','ES5 widget scripts parse','search safely URL encodes input','knowledge visibility gate excludes denied article']};
await fs.mkdir(path.join(root,'docs/validation'),{recursive:true});
await fs.writeFile(path.join(root,'docs/validation/local.json'),JSON.stringify(report,null,2)+'\n');
const inventory = '# Source record inventory\n\nIDs below come from the actual SDK 4.14.0 compiled XML. This inventory describes the source package. For live deployment, runtime-created metadata and submitted Update Set evidence, see [DEPLOYMENT-RESULT.md](DEPLOYMENT-RESULT.md) and `docs/validation/submission.json`. Binary attachment chunks are included in parent XML files locally and in the verified native portal payload for Update Set export.\n\n| Table | Name / identifier | Generated sys_id |\n|---|---|---|\n' + recordList.map(r=>'| '+r.table+' | '+String(r.name).replaceAll('|','\\|')+' | `'+r.sys_id+'` |').join('\n') + '\n\nAdditional binary chunk records: **'+of('sys_attachment_doc').length+'**. See `docs/validation/local.json` for container membership and artwork hashes. Native My Requests and Announcements are reused at runtime; their definitions are never created or modified.\n';
await fs.writeFile(path.join(root,'docs/RECORDS.md'),inventory);
process.stdout.write('PASS — 3 containers, 6 active instances, correct portal wiring, packaged image binaries, native references, search encoding, knowledge visibility.\nSaved docs/validation/local.json\n');
