import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve('dist');
const files=await fs.readdir(root);let count=0;
for(const file of files.filter(f=>f.endsWith('.html'))){const text=await fs.readFile(path.join(root,file),'utf8');assert(text.includes('lang="pt-BR"'));assert(text.includes('name="viewport"'));assert.equal((text.match(/<h1[ >]/g)||[]).length,1,file+' needs one h1');for(const match of text.matchAll(/(?:href|src)="([^"#?]+)(?:[^\"]*)"/g)){const target=match[1];if(/^(https?:|mailto:|tel:)/.test(target))continue;assert(await fs.stat(path.resolve(root,target)).catch(()=>false),file+' missing '+target);count++}}
console.log(`PASS: ${files.filter(f=>f.endsWith('.html')).length} HTML pages, ${count} local references, language, viewport and headings.`);
