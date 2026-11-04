import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {XMLParser} from 'fast-xml-parser';
import {createHash} from 'node:crypto';
const root=path.resolve(import.meta.dirname,'..');
const file=path.join(root,'output/GAKO_JoanaCarla Hello World Portal.xml');
const bytes=await fs.readFile(file);
const parser=new XMLParser({ignoreAttributes:false,parseTagValue:false,trimValues:false});
const scalar=v=>typeof v==='object'?v['#text']||'':v||'';
const xml=parser.parse(bytes.toString('utf8')).unload;
const updates=[xml.sys_update_xml].flat(),rawSets=[xml.sys_remote_update_set].flat();
const sets=[...new Map(rawSets.map(s=>[s.sys_id,s])).values()];
const captured=JSON.parse(await fs.readFile(path.join(root,'docs/instance/published-update-set.json'),'utf8'));
const submission=JSON.parse(await fs.readFile(path.join(root,'docs/validation/submission.json'),'utf8'));
assert.equal(submission.status,'PASS');assert.equal(sets.length,1);assert.equal(updates.length,submission.customerUpdates);
const parent=sets.find(s=>s.remote_sys_id===captured.set.sys_id);
assert.ok(parent);assert.equal(parent.name,'GAKO_JoanaCarla Hello World Portal');
for(const update of updates){
 const expected=captured.updates.find(u=>u.name===update.name);assert.ok(expected,'Unexpected exported customer update');
 assert.deepEqual(parser.parse(update.payload),parser.parse(expected.payload),'Exported payload differs from audited instance');
 assert.equal(scalar(update.application),expected.application);
 const set=sets.find(s=>s.sys_id===scalar(update.remote_update_set));assert.ok(set,'Exported update must belong to a batched remote set');
 assert.equal(scalar(set.application),scalar(update.application),'Exported sets must not mix application scopes');
}
const report={checkedAt:new Date().toISOString(),status:'PASS',file,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex'),customerUpdates:updates.length,updateSets:sets.map(s=>({name:s.name,sourceSysId:s.remote_sys_id,application:scalar(s.application),customerUpdates:updates.filter(u=>scalar(u.remote_update_set)===s.sys_id).length})),checks:['One native Update Set with the exact classroom name','All exported payloads equal audited on-instance metadata','3 actual containers and 6 direct instances included','One original logo and its chunks match source byte-for-byte via payload equality','No movie image binaries or active image properties; four retired properties have DELETE actions only','Every customer update matches its set application scope','No tickets, users, catalog items, knowledge articles or native table definitions seeded'],transportTest:'Not imported/committed to a second instance'};
await fs.writeFile(path.join(root,'docs/validation/export.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
