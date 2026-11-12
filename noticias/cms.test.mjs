import test from 'node:test';
import assert from 'node:assert/strict';
import {renderBody,mapPost,safeUrl,imageUrl,loadArticles} from './cms.mjs';
const post={title:'Título <teste>',slug:{current:'noticia-teste'},summary:'Resumo',category:'ATP',publishedAt:'2026-11-12T12:00:00Z',kind:'curadoria',sourceName:'Fonte',sourceUrl:'https://example.com/reportagem',body:[{_type:'block',children:[{text:'Texto <script>alert(1)</script>',marks:[]}]}],cover:{asset:{_ref:'image-abc123-1600x900-jpg'},alt:'Imagem',credit:'Fotógrafo'}};
test('CMS text and link marks cannot inject HTML or JavaScript',()=>{
 const html=renderBody([{_type:'block',children:[{text:'<img onerror=alert(1)>',marks:['link']}],markDefs:[{_key:'link',href:'javascript:alert(1)'}]}]);
 assert(!html.includes('<img'));assert(!html.includes('javascript:'));assert(html.includes('&lt;img'));assert.equal(safeUrl('data:text/html,test'),'');
});
test('Rich text preserves headings, lists, formatting and links',()=>{
 const html=renderBody([{_type:'block',style:'h2',children:[{text:'Título',marks:['strong']}]},{_type:'block',listItem:'bullet',children:[{text:'Item'}]},{_type:'block',children:[{text:'Fonte',marks:['a']}],markDefs:[{_key:'a',href:'https://example.com'}]}]);
 assert(html.includes('<h2><strong>Título</strong></h2>'));assert(html.includes('<ul><li>Item</li></ul>'));assert(html.includes('rel="noopener noreferrer"'));
});
test('Invalid routes, dates, covers and missing curation sources stop publication',()=>{
 for(const value of [{slug:{current:'../escape'}},{slug:{current:'index'}},{publishedAt:'bad'},{cover:{}},{sourceUrl:'javascript:alert(1)'}])assert.throws(()=>mapPost({...post,...value}));
 const mapped=mapPost(post);assert.equal(mapped.slug,'noticia-teste');assert(mapped.bodyHtml.includes('&lt;script&gt;'));assert.equal(mapped.read,1);
});
test('Images use trusted CDN and responsive sizes',()=>{assert(imageUrl(post.cover,640).startsWith('https://cdn.sanity.io/images/cxk75bbp/production/'));assert.throws(()=>imageUrl({asset:{_ref:'https://evil.example/image'}},640))});
test('Empty CMS keeps the archive without requesting a write token',async()=>{
 const fs=await import('node:fs/promises');const os=await import('node:os');const path=await import('node:path');
 const folder=await fs.mkdtemp(path.join(os.tmpdir(),'40iguais-cms-'));const fixture=path.join(folder,'empty.json');await fs.writeFile(fixture,'[]');process.env.CMS_FIXTURE=fixture;
 try{const result=await loadArticles();assert.equal(result.cmsCount,0);assert(result.articles.length>0)}finally{delete process.env.CMS_FIXTURE;await fs.unlink(fixture);await fs.rmdir(folder)}
});
