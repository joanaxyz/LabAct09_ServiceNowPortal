import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import fs from 'node:fs/promises';
import path from 'node:path';
import {XMLParser} from 'fast-xml-parser';
import assert from 'node:assert/strict';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const run=promisify(execFile),root=path.resolve(import.meta.dirname,'..');
const setId=process.argv[2];
if(!/^[a-f0-9]{32}$/.test(setId||''))throw new Error('Provide the actual published Update Set sys_id.');
async function query(table,q,fields){
 const {stdout}=await run(process.execPath,[path.join(root,'node_modules/@servicenow/sdk/bin/index.js'),'query',table,'-q',q,'-f',fields,'--limit','1000','-o','json'],{cwd:root,env:{...process.env,NO_TELEMETRY:'1'},windowsHide:true,maxBuffer:32*1024*1024,timeout:90000});
 const response=JSON.parse(stdout.trim());if(!response.ok||response.hasMore)throw new Error('Incomplete submission query');return response.records;
}
const sets=(await query('sys_update_set','name=GAKO_JoanaCarla Hello World Portal','sys_id,name,state,application,description')).filter(s=>s.sys_id===setId);
if(sets.length!==1||sets[0].name!=='GAKO_JoanaCarla Hello World Portal'||sets[0].application!=='d02a2003fd1f4a7698b9995b314584cd'||sets[0].state!=='complete')throw new Error('Published Update Set identity/state mismatch');
const children=await query('sys_update_set','parent='+setId,'sys_id,name,state,application,parent');
assert.equal(children.length,0,'Current portal needs no separate image child set');
const allSets=[...sets,...children];
const updates=await query('sys_update_xml','update_setIN'+allSets.map(s=>s.sys_id).join(','),'sys_id,name,type,target_name,payload,application,update_set');
for(const update of updates)assert.equal(update.application,allSets.find(s=>s.sys_id===update.update_set).application,'No mixed-scope customer updates');
await fs.writeFile(path.join(root,'docs/instance/published-update-set.json'),JSON.stringify({checkedAt:new Date().toISOString(),set:sets[0],children,updates},null,2)+'\n');
const parser=new XMLParser({ignoreAttributes:false,parseTagValue:false,trimValues:false});
const records=[];
for(const update of updates){
 const parsed=parser.parse(update.payload).record_update;
 if(!parsed)continue;
 for(const [table,value] of Object.entries(parsed)){
   if(table.startsWith('@_')||table==='#text')continue;
   for(const record of (Array.isArray(value)?value:[value]))records.push({table,...record});
 }
}
const expected=JSON.parse(await fs.readFile(path.join(root,'docs/validation/local.json'),'utf8'));
const ids=new Set(records.map(r=>r.sys_id));
const missing=expected.records.filter(r=>!ids.has(r.sys_id));
const counts={};for(const r of records)counts[r.table]=(counts[r.table]||0)+1;
const scalar=v=>typeof v==='object'?v['#text']||'':v||'';
const binaries=[];
for(const attachment of records.filter(r=>r.table==='sys_attachment')){
 const chunks=records.filter(r=>r.table==='sys_attachment_doc'&&scalar(r.sys_attachment)===attachment.sys_id).sort((a,b)=>Number(a.position)-Number(b.position));
 const bytes=gunzipSync(Buffer.concat(chunks.map(c=>Buffer.from(c.data,'base64'))));
 const art=expected.artwork.find(a=>a.attachment===attachment.sys_id);
 assert.ok(art,'No obsolete imagery may be exported');
 const original=await fs.readFile(path.join(root,'src/portal/assets',art.file));
 assert.ok(bytes.equals(original),'Published binary differs from source: '+attachment.sys_id);
 binaries.push({sys_id:attachment.sys_id,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});
}
assert.equal(binaries.length,1,'Only the current original Lab09 logo is exported');
const forbidden=['incident','sc_request','sc_req_item','sys_user','kb_knowledge','sc_cat_item','sys_db_object','sys_dictionary'];
assert.ok(records.every(r=>!forbidden.includes(r.table)),'No seeded business data or native schema changes');
const deletedProperties=records.filter(r=>r.table==='sys_properties');
const retiredIds=new Set(['d50edcf0b85f4ef980978c3009012883','649187f84e8840fd889da18778bb85b9','0163b16ecd794330ac74eaf6239eb8ba','de421a8aade640048b7df0e8642acddd']);
assert.ok(deletedProperties.every(r=>r['@_action']==='DELETE'&&retiredIds.has(r.sys_id)),'Only removal of the four retired image properties is permitted');
const report={checkedAt:new Date().toISOString(),set:sets[0],children,customerUpdates:updates.length,customerUpdatesBySet:allSets.map(s=>({sys_id:s.sys_id,name:s.name,count:updates.filter(u=>u.update_set===s.sys_id).length})),recordCounts:counts,missingExpectedRecords:missing,attachmentRecords:records.filter(r=>r.table==='sys_attachment').map(r=>({sys_id:r.sys_id,file_name:r.file_name,table_name:r.table_name,table_sys_id:r.table_sys_id})),attachmentChunks:records.filter(r=>r.table==='sys_attachment_doc').length,binaries,scopeConsistency:'PASS',businessDataExcluded:true,updates:updates.map(({payload,...metadata})=>metadata),status:missing.length?'INCOMPLETE':'PASS'};
await fs.writeFile(path.join(root,'docs/validation/submission.json'),JSON.stringify(report,null,2)+'\n');
process.stdout.write(JSON.stringify({set:sets[0],customerUpdates:updates.length,recordCounts:counts,missingExpectedRecords:missing,status:report.status},null,2)+'\n');
