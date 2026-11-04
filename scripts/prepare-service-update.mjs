import fs from 'node:fs/promises';
import path from 'node:path';
import {XMLParser} from 'fast-xml-parser';
const root=path.resolve(import.meta.dirname,'..');
const parser=new XMLParser({ignoreAttributes:false,parseTagValue:false});
const scalar=v=>typeof v==='object'?v['#text']||'':v||'';
const allowed=new Set(['m2m_sp_portal_catalog','m2m_sp_portal_knowledge_base','m2m_sp_portal_search_source','m2m_sp_theme_css_include','sp_column','sp_container','sp_css','sp_css_include','sp_header_footer','sp_instance','sp_page','sp_portal','sp_row','sp_theme','sp_widget','sys_module','sys_attachment','sys_attachment_doc']);
const files=[],records=[];
for(const file of await fs.readdir(path.join(root,'dist/app/update'))){
 if(!file.endsWith('.xml'))continue;
 const xml=await fs.readFile(path.join(root,'dist/app/update',file),'utf8');
 for(const [table,data] of Object.entries(parser.parse(xml).record_update)){
  if(table.startsWith('@_')||table==='#text')continue;
  if(!allowed.has(table))throw new Error('Unreviewed table in package: '+table);
  for(const r of (Array.isArray(data)?data:[data])){
   if(!/^[a-f0-9]{32}$/.test(r.sys_id))throw new Error('Invalid source ID');
   records.push({table,id:r.sys_id,scope:scalar(r.sys_scope),parent:r.table_sys_id||scalar(r.sys_attachment)||'',parentTable:r.table_name||'',displayName:r.name||r.title||r.id||''});
  }
 }
 files.push({file,xml});
}
const validation=JSON.parse(await fs.readFile(path.join(root,'docs/validation/local.json'),'utf8'));
if(validation.status!=='PASS')throw new Error('Local validation required');
const newColumns=records.filter(r=>r.table==='sp_column'&&!['2085c47d564043fa95c7e56c2ab86a17','ee3c7666dec54accb9afac7a53b62fdb','ef79085b36bf4dd0996d577184807162'].includes(r.id)).map(r=>r.id);
if(newColumns.length!==2)throw new Error('Expected two new layout columns only');
const legacy=[{id:'d50edcf0b85f4ef980978c3009012883',name:'x_lab09_hello_worl.midnight.art.hero'},{id:'649187f84e8840fd889da18778bb85b9',name:'x_lab09_hello_worl.midnight.art.mystery'},{id:'0163b16ecd794330ac74eaf6239eb8ba',name:'x_lab09_hello_worl.midnight.art.drama'},{id:'de421a8aade640048b7df0e8642acddd',name:'x_lab09_hello_worl.midnight.art.scifi'}];
const script=`(function(){
 var scope='d02a2003fd1f4a7698b9995b314584cd',records=${JSON.stringify(records)},files=${JSON.stringify(files)},newColumns=${JSON.stringify(newColumns)},legacy=${JSON.stringify(legacy)};
 var collision=new GlideRecord('sp_portal');collision.addQuery('url_suffix','gako_lab09');collision.addQuery('sys_id','!=','2c0bf7f909364e16927cb72cbbd4a090');collision.query();if(collision.hasNext())throw new Error('Portal suffix collision');
 collision=new GlideRecord('sp_page');collision.addQuery('id','gako_lab09_home');collision.addQuery('sys_id','!=','e11f9468c0a4499d9ea3771962bfae2d');collision.query();if(collision.hasNext())throw new Error('Home ID collision');
 for(var i=0;i<records.length;i++){
  var r=records[i],gr=new GlideRecord(r.table),exists=gr.get(r.id);
  if(r.table==='sys_attachment'){
   if(r.parent!=='2c0bf7f909364e16927cb72cbbd4a090'||r.parentTable!=='ZZ_YYsp_portal')throw new Error('Only this portal logo may be imported');
   if(exists&&(gr.getValue('table_sys_id')!==r.parent||gr.getValue('table_name')!==r.parentTable))throw new Error('Attachment ownership mismatch');
  }else if(r.table==='sys_attachment_doc'){
   var found=false;for(var a=0;a<records.length;a++)if(records[a].table==='sys_attachment'&&records[a].id===r.parent)found=true;
   if(!found)throw new Error('Binary chunk has no reviewed source attachment');
   if(exists&&gr.getValue('sys_attachment')!==r.parent){
    // SDK hashes identical gzip-header chunks identically across logo revisions.
    // Reparent only a chunk from the replaced logo on this same owned portal.
    var prior=new GlideRecord('sys_attachment');
    if(gr.getValue('sys_attachment')!=='cd9bffc333dbf925051faeeba8ca6b34'||!prior.get(gr.getValue('sys_attachment'))||prior.getValue('table_sys_id')!=='2c0bf7f909364e16927cb72cbbd4a090'||prior.getValue('table_name')!=='ZZ_YYsp_portal')throw new Error('Binary chunk ownership mismatch');
   }
  }else{
   if(r.scope!==scope)throw new Error('Source scope mismatch');
   if(exists&&gr.getValue('sys_scope')!==scope)throw new Error('Existing record is not owned by this app: '+r.id);
   if(!exists&&!(r.table==='sp_column'&&newColumns.indexOf(r.id)>=0))throw new Error('Unexpected new metadata: '+r.table+' '+r.id);
  }
 }
 for(var p=0;p<legacy.length;p++){var prop=new GlideRecord('sys_properties');if(prop.get(legacy[p].id)&&(prop.getValue('name')!==legacy[p].name||prop.getValue('sys_scope')!==scope))throw new Error('Legacy property ownership mismatch');}
 var manager=new GlideUpdateManager2();
 for(var n=0;n<files.length;n++)manager.loadXML(files[n].xml);
 // Native XML import preserves old sys_name labels; refresh only renamed owned metadata.
 for(var s=0;s<records.length;s++){var item=records[s];if(!item.displayName||item.table.indexOf('sys_attachment')===0)continue;var named=new GlideRecord(item.table);if(named.get(item.id)&&named.isValidField('sys_name')&&/MIDNIGHT FRAMES|Films &|cinematic/.test(String(named.getValue('sys_name')||''))){named.setValue('sys_name',String(item.displayName).substring(0,40));named.update();}}
 var removed=[];for(var d=0;d<legacy.length;d++){var old=new GlideRecord('sys_properties');if(old.get(legacy[d].id)){if(!old.deleteRecord())throw new Error('Could not remove unused movie property');removed.push(legacy[d].id);}}
 var portal=new GlideRecord('sp_portal');portal.get('2c0bf7f909364e16927cb72cbbd4a090');
 var page=new GlideRecord('sp_page');page.get('e11f9468c0a4499d9ea3771962bfae2d');
 if(portal.getValue('url_suffix')!=='gako_lab09'||portal.getValue('homepage')!==page.getUniqueValue()||['false','0'].indexOf(String(portal.getValue('default')))===-1||page.getValue('id')!=='gako_lab09_home')throw new Error('Post-update portal wiring mismatch');
 gs.info(JSON.stringify({source:'Locally built and verified SDK 4.14.0 metadata',loadedFiles:files.length,reviewedRecords:records.length,removedUnusedMovieProperties:removed,portal:'https://dev431102.service-now.com/gako_lab09?id=gako_lab09_home'}));
})();
`;
await fs.writeFile(path.join(root,'scripts/apply-service-update.server.js'),script);
await fs.writeFile(path.join(root,'docs/validation/service-update-manifest.json'),JSON.stringify({checkedAt:new Date().toISOString(),files:files.map(f=>f.file),records,newColumns,legacyPropertiesToRemove:legacy},null,2)+'\n');
console.log(`Prepared ${files.length} source XML files; ${records.length} guarded records, two new layout columns, and four unused image properties to remove.`);
