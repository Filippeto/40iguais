import fs from 'node:fs/promises';
import path from 'node:path';
// Run from noticias/ after building the public site and Studio.
const output=path.resolve('dist');
await fs.cp('studio/dist',path.join(output,'admin'),{recursive:true});
const restore=`<script>try{const p=sessionStorage.getItem('40iguais:admin-route');sessionStorage.removeItem('40iguais:admin-route');if(p&&p.startsWith('/40iguais/admin/'))history.replaceState(null,'',p)}catch{}</script>`;
const adminFile=path.join(output,'admin/index.html');
await fs.writeFile(adminFile,(await fs.readFile(adminFile,'utf8')).replace('<head>','<head>'+restore));
const redirect=`<script>if(location.pathname.startsWith('/40iguais/admin/')){try{sessionStorage.setItem('40iguais:admin-route',location.pathname+location.search+location.hash);location.replace('/40iguais/admin/')}catch{location.replace('/40iguais/admin/')}}else{document.addEventListener('DOMContentLoaded',()=>{document.querySelectorAll('a[href="index.html"]').forEach(a=>a.href='/40iguais/')})}</script>`;
const missing=path.join(output,'404.html');
await fs.writeFile(missing,(await fs.readFile(missing,'utf8')).replace('</head>',redirect+'</head>'));
// Keep the existing presentation and its relative assets reachable at /projeto/.
const legacy=path.resolve('..');
if(await fs.stat(path.join(legacy,'index.html')).catch(()=>false)){
 const target=path.join(output,'projeto');await fs.mkdir(target,{recursive:true});
 for(const entry of await fs.readdir(legacy,{withFileTypes:true})){
  if(entry.name.startsWith('.')||entry.name==='noticias')continue;
  if(entry.name==='assets'||entry.isFile()&&/\.(html|css|js|svg|png|jpg|jpeg|webp|otf|ttf)$/.test(entry.name))await fs.cp(path.join(legacy,entry.name),path.join(target,entry.name),{recursive:true});
 }
}
await fs.writeFile(path.join(output,'.nojekyll'),'');
console.log('Assembled portal, Studio and brand presentation.');
