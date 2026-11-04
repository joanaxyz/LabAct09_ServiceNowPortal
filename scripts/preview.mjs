import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {compileString} from 'sass';

const root=path.resolve(import.meta.dirname,'..');
const names=['hero','announcements','catalog','knowledge','requests','support'];
const read=file=>fs.readFile(path.join(root,file),'utf8');
const port=Number(process.env.LAB09_PREVIEW_PORT||4173);
// Fixtures are intentionally empty. Native widgets and authorized records need ServiceNow.
const data={
 header:{art:{logo:'/assets/lab09-logo.svg'},homeUrl:'?id=gako_lab09_home'},
 hero:{searchUrl:'?id=search&spa=1',catalogUrl:'?id=sc_home',knowledgeUrl:'?id=kb_view'},
 announcements:{localPreview:true},
 catalog:{catalogUrl:'?id=sc_home',requestsUrl:'?id=my_requests'},
 knowledge:{knowledgeUrl:'?id=kb_view',articles:[],knowledgeError:''},
 requests:{authenticated:true,localPreview:true,requests:[],requestsUrl:'?id=my_requests',requestsError:''},
 support:{helpUrl:'?id=sc_home',knowledgeUrl:'?id=kb_view',requestsUrl:'?id=my_requests'}
};
async function html(){
 const header=await read('src/portal/header/template.html');
 const templates=await Promise.all(names.map(n=>read('src/portal/widgets/'+n+'/template.html')));
 const css=compileString(await read('src/portal/styles/page.scss')).css;
 const allNames=['header',...names];
 const controllers=await Promise.all(allNames.map(async n=>{
  const source=await read(n==='header'?'src/portal/header/client.js':'src/portal/widgets/'+n+'/client.js');
  return `(function(){var api={};${source}\napp.controller(${JSON.stringify('LAB_'+n)},['$scope','$injector','$q',function($scope,$injector,$q){var c=this;c.data=angular.copy(window.previewData[${JSON.stringify(n)}]);c.server={refresh:function(){return $q.resolve({data:c.data});},get:function(){return $q.resolve({data:c.data});}};$injector.invoke(api.controller,c,{$scope:$scope});}]);})();`;
 }));
 const widget=i=>`<div class="mf-preview-widget" data-widget="${names[i]}" ng-controller="LAB_${names[i]} as c">${templates[i]}</div>`;
 const container=(name,inside)=>`<div class="mf-container-${name}" data-container="${name}"><div class="container-fluid mf-page"><div class="row">${inside}</div></div></div>`;
 const column=(width,inside)=>`<div class="col-md-${width} col-sm-12 col-xs-12">${inside}</div>`;
 return `<!doctype html><html lang="en" ng-app="labPreview"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>LAB09 Service Portal — Local preview</title><link rel="icon" href="/assets/lab09-logo.svg"><link rel="stylesheet" href="/vendor/bootstrap/dist/css/bootstrap.min.css"><style>html,body{margin:0}[ng-cloak]{display:none!important}.preview-label{padding:7px 20px;background:#e8eef8;color:#405774;font:11px/1.4 'Segoe UI',Arial,sans-serif;text-align:center}${css}</style></head><body ng-cloak><div class="preview-label">LOCAL PREVIEW · Live records and native widgets load on ServiceNow</div><div ng-controller="LAB_header as c">${header}</div><main id="mf-main" aria-label="Lab09 Service Portal homepage">${container('opening',column(12,widget(0)+widget(1)))}${container('discover',column(6,widget(2))+column(6,widget(3)))}${container('backstage',column(8,widget(4))+column(4,widget(5)))}</main><script src="/vendor/angular/angular.min.js"></script><script>window.previewData=${JSON.stringify(data)};var app=angular.module('labPreview',[]);${controllers.join('\n')}</script></body></html>`;
}
const types={'.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.js':'application/javascript','.css':'text/css','.woff2':'font/woff2','.woff':'font/woff','.ttf':'font/ttf'};
http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://127.0.0.1');
  if(url.pathname==='/'){const body=await html();res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});res.end(body);return;}
  let file;
  if(url.pathname.startsWith('/assets/'))file=path.join(root,'src/portal/assets',decodeURIComponent(url.pathname.slice(8)));
  else if(url.pathname.startsWith('/vendor/'))file=path.join(root,'node_modules',decodeURIComponent(url.pathname.slice(8)));
  else{res.writeHead(404);res.end('Not found');return;}
  if(!file.startsWith(path.join(root,'src/portal/assets')+path.sep)&&!file.startsWith(path.join(root,'node_modules')+path.sep))throw new Error('Invalid path');
  const body=await fs.readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(body);
 }catch(error){res.writeHead(500,{'Content-Type':'text/plain'});res.end(String(error));}
}).listen(port,'127.0.0.1',()=>process.stdout.write('Local source preview: http://127.0.0.1:'+port+'\n'));
