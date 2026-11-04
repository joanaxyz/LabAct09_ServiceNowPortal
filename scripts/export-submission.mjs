import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import fs from 'node:fs/promises';
import path from 'node:path';
const run=promisify(execFile),root=path.resolve(import.meta.dirname,'..');
const cli=path.join(root,'node_modules/@servicenow/sdk/bin/index.js');
const options={cwd:root,env:{...process.env,NO_TELEMETRY:'1'},windowsHide:true,maxBuffer:8*1024*1024,timeout:90000};
const setId=process.argv[2];
const audit=JSON.parse(await fs.readFile(path.join(root,'docs/validation/submission.json'),'utf8'));
if(!/^[a-f0-9]{32}$/.test(setId||'')||audit.status!=='PASS'||audit.set.sys_id!==setId||audit.children.length)throw new Error('Provide the current audited standalone submission set ID');
const script=`(function(){var set=new GlideRecord('sys_update_set');if(!set.get('${setId}')||set.getValue('name')!=='GAKO_JoanaCarla Hello World Portal'||set.getValue('state')!=='complete')throw new Error('Submission identity mismatch');var exporter=new UpdateSetExport();gs.info(JSON.stringify({exportId:String(exporter.exportUpdateSet(set))}));})();`;
await fs.writeFile(path.join(root,'scripts/native-export.server.js'),script);
const {stdout}=await run(process.execPath,[cli,'exec','--file','scripts/native-export.server.js','--scope','global','--auth','servicenow-lab09','--reason','Export the current complete Lab09 portal set using the native UI action implementation','--record-for-rollback','-o','json'],options);
const execution=JSON.parse(stdout.trim());if(!execution.ok)throw new Error('Native batch export failed');
const line=execution.output.find(l=>l.startsWith('{"exportId":'));
const id=JSON.parse(line||'{}').exportId;if(!/^[a-f0-9]{32}$/.test(id))throw new Error('Native exporter did not return a valid export ID');
// Resolve the short-lived saved SDK session in memory; never print or persist it.
const auth=await run(process.execPath,[cli,'auth','--print','servicenow-lab09','--format','headers'],options);
const headers={};
for(const line of auth.stdout.split(/\r?\n/)){
 const i=line.indexOf(':');if(i<1)continue;
 const key=line.slice(0,i).trim(),value=line.slice(i+1).trim();
 if(/^(cookie|authorization|x-usertoken|accept)$/i.test(key))headers[key]=value;
}
if(!Object.keys(headers).some(k=>/^cookie|authorization$/i.test(k)))throw new Error('Saved session unavailable');
const response=await fetch('https://dev431102.service-now.com/export_update_set.do?sysparm_sys_id='+id+'&sysparm_delete_when_done=true&sysparm_is_remote=false',{headers,signal:AbortSignal.timeout(90000)});
const bytes=Buffer.from(await response.arrayBuffer());
if(!response.ok||!bytes.toString('utf8',0,150).includes('<?xml'))throw new Error('Export response was not XML (HTTP '+response.status+', '+response.headers.get('content-type')+')');
const file=path.join(root,'output/GAKO_JoanaCarla Hello World Portal.xml');await fs.writeFile(file,bytes);
await fs.writeFile(path.join(root,'docs/instance/native-export.json'),JSON.stringify({checkedAt:new Date().toISOString(),file,bytes:bytes.length,setId,method:'Native UpdateSetExport.exportUpdateSet, matching observed Export to XML action',executionHistoryId:execution.executionHistoryId,rollbackContextId:execution.rollbackContextId},null,2)+'\n');
console.log(JSON.stringify({file,bytes:bytes.length,status:'EXPORTED'}));
