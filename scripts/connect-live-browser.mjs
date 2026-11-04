import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';

const run = promisify(execFile);
const root = path.resolve(import.meta.dirname, '..');
const origin = 'https://dev431102.service-now.com';
const browser = path.join(process.env.APPDATA, 'npm/node_modules/agent-browser/bin/agent-browser-win32-x64.exe');
// Reuse the SDK's short-lived UI session. Do not print or write session secrets.
let headers;
try {
  const response = await run(process.execPath, [path.join(root,'node_modules/@servicenow/sdk/bin/index.js'),'auth','--print','servicenow-lab09','--format','headers'], {cwd:root,env:{...process.env,NO_TELEMETRY:'1'},windowsHide:true,timeout:90000});
  headers = response.stdout;
} catch { throw new Error('Could not resolve the saved SDK session.'); }
const cookieHeader = headers.split(/\r?\n/).find(line=>/^cookie:/i.test(line));
if (!cookieHeader) throw new Error('SDK session did not supply browser cookies.');
const cookiePairs = cookieHeader.slice(cookieHeader.indexOf(':')+1).trim().split(/;\s*/);
let count=0;
for (const pair of cookiePairs) {
  const separator=pair.indexOf('=');
  if(separator<1)continue;
  const name=pair.slice(0,separator),value=pair.slice(separator+1);
  try {
    await run(browser,['--session','midnight-live','cookies','set',name,value,'--url',origin,'--secure','--httpOnly','--sameSite','Lax'],{windowsHide:true,timeout:30000});
    count++;
  } catch { throw new Error('Could not initialize the browser session.'); }
}
headers=undefined;
process.stdout.write('Initialized authenticated development-instance browser session ('+count+' cookies).\n');
