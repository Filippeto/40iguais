import fs from 'node:fs/promises';
import {articles as archive} from './content.mjs';
export const config=JSON.parse(await fs.readFile(new URL('./cms.config.json',import.meta.url),'utf8'));
export const escapeHtml=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
export function safeUrl(value){try{const url=new URL(value);return ['https:','http:'].includes(url.protocol)?url.href:''}catch{return ''}}
const reserved=new Set(['index','404','admin','projeto','sobre-o-40iguais','entenda-o-circuito']);
export function imageUrl(image,width){
 const ref=image?.asset?._ref;
 if(!ref)return '';
 const match=/^image-([a-zA-Z0-9]+)-(\d+)x(\d+)-([a-zA-Z0-9]+)$/.exec(ref);
 if(!match)throw Error('Referência de imagem inválida.');
 return `https://cdn.sanity.io/images/${config.projectId}/${config.dataset}/${match[1]}-${match[2]}x${match[3]}.${match[4]}?w=${width}&auto=format&fit=max&q=82`;
}
export function renderBody(blocks=[]){
 let html='',list='';
 const close=()=>{if(list){html+=`</${list}>`;list=''}};
 for(const block of blocks){
  if(block._type==='image'){
   close();const url=imageUrl(block,1100);if(!url)continue;
   html+=`<figure class="inline-image"><img src="${escapeHtml(url)}" alt="${escapeHtml(block.alt)}" loading="lazy" decoding="async">${block.caption||block.credit?`<figcaption>${escapeHtml([block.caption,block.credit].filter(Boolean).join(' · '))}</figcaption>`:''}</figure>`;continue;
  }
  if(block._type!=='block')continue;
  const text=(block.children||[]).map(span=>{
   let value=escapeHtml(span.text).replaceAll('\n','<br>');
   for(const mark of span.marks||[]){
    if(mark==='strong')value=`<strong>${value}</strong>`;
    else if(mark==='em')value=`<em>${value}</em>`;
    else {const def=block.markDefs?.find(d=>d._key===mark);const href=safeUrl(def?.href);if(href)value=`<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${value}</a>`}
   }return value;
  }).join('');
  if(block.listItem){const type=block.listItem==='number'?'ol':'ul';if(list!==type){close();html+=`<${type}>`;list=type}html+=`<li>${text}</li>`}
  else {close();const tag=['h2','h3','blockquote'].includes(block.style)?block.style:'p';html+=`<${tag}>${text}</${tag}>`}
 }
 close();return html;
}
export function mapPost(post){
 const slug=post.slug?.current;
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug||'')||reserved.has(slug))throw Error(`Endereço de matéria inválido: ${slug}`);
 if(!post.title?.trim()||!post.summary?.trim()||!Array.isArray(post.body)||!post.body.length)throw Error(`Matéria incompleta: ${slug}`);
 if(!['ATP','WTA','Duplas','Cultura'].includes(post.category))throw Error(`Categoria inválida: ${slug}`);
 if(!Number.isFinite(Date.parse(post.publishedAt)))throw Error(`Data inválida: ${slug}`);
 if(!post.cover?.alt?.trim()||!post.cover?.credit?.trim()||!imageUrl(post.cover,640))throw Error(`Capa sem imagem, descrição ou crédito: ${slug}`);
 if(post.kind==='curadoria'&&(!post.sourceName?.trim()||!safeUrl(post.sourceUrl)))throw Error(`Curadoria sem fonte: ${slug}`);
 const plain=(post.body||[]).flatMap(b=>(b.children||[]).map(c=>c.text||'')).join(' ');
 return {slug,title:post.title,dek:post.summary,category:post.category,date:post.publishedAt.slice(0,10),publishedAt:post.publishedAt,author:post.author||'40iguais',tag:post.kicker||'Na nossa quadra',take:post.take||'',source:post.sourceName||null,url:safeUrl(post.sourceUrl),bodyHtml:renderBody(post.body),body:[],cover:post.cover,imageAlt:post.cover.alt,credit:post.cover.credit,read:Math.max(1,Math.ceil(plain.split(/\s+/).length/200)),featured:!!post.featured,searchTerms:[...(post.players||[]),post.tournament||''].join(' '),cms:true};
}
export async function loadArticles(){
 let posts;
 if(process.env.CMS_FIXTURE){posts=JSON.parse(await fs.readFile(process.env.CMS_FIXTURE,'utf8'))}
 else {
  const query='*[_type == "post" && !(_id in path("drafts.**")) && publishedAt <= now()] | order(featured desc, publishedAt desc)';
  const url=new URL(`https://${config.projectId}.api.sanity.io/v${config.apiVersion}/data/query/${config.dataset}`);
  url.searchParams.set('query',query);url.searchParams.set('perspective','published');
  const response=await fetch(url,{signal:AbortSignal.timeout(20000)});
  if(!response.ok)throw Error(`Sanity respondeu ${response.status}; publicação interrompida para preservar o site atual.`);
  const data=await response.json();if(data.error||!Array.isArray(data.result))throw Error('Resposta inválida do Sanity.');posts=data.result;
 }
 const mapped=posts.map(mapPost);const slugs=new Set();for(const item of mapped){if(slugs.has(item.slug))throw Error(`Endereço duplicado: ${item.slug}`);slugs.add(item.slug)}
 return {articles:mapped.length?[...mapped,...archive.filter(a=>['sobre-o-40iguais','entenda-o-circuito'].includes(a.slug))]:archive,cmsCount:mapped.length};
}
