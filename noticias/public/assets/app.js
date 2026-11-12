'use strict';
const menu=document.querySelector('.menu-button');
const nav=document.querySelector('#nav');
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');nav.classList.toggle('is-open',open)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu?.getAttribute('aria-expanded')==='true'){menu.click();menu.focus()}});
const dialog=document.querySelector('#newsletter-dialog');
let opener;
document.querySelectorAll('[data-newsletter]').forEach(button=>button.addEventListener('click',()=>{opener=button;dialog.showModal();document.body.classList.add('dialog-open')}));
dialog?.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog?.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
dialog?.addEventListener('close',()=>{document.body.classList.remove('dialog-open');opener?.focus()});
const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const filters=[...document.querySelectorAll('[data-filter]')];
const search=document.querySelector('#q');
const stories=[...document.querySelectorAll('.news .story')];
const params=new URLSearchParams(location.search);
let category=filters.some(b=>b.dataset.filter===params.get('categoria'))?params.get('categoria'):'Todas';
function filter(updateUrl=true){
 if(!search)return;
 const query=normalize(search.value.trim());let count=0;
 for(const story of stories){const match=(category==='Todas'||story.dataset.category===category)&&normalize(story.dataset.search).includes(query);story.hidden=!match;if(match)count++}
 filters.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===category)));
 document.querySelector('.empty').hidden=count>0;
 document.querySelector('.result-status').textContent=`${count} ${count===1?'história encontrada':'histórias encontradas'}`;
 document.querySelectorAll('[data-nav]').forEach(a=>{if(a.dataset.nav===category)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
 if(updateUrl){const url=new URL(location.href);category==='Todas'?url.searchParams.delete('categoria'):url.searchParams.set('categoria',category);search.value.trim()?url.searchParams.set('q',search.value.trim()):url.searchParams.delete('q');history.replaceState(null,'',url)}
}
if(search){search.value=(params.get('q')||'').slice(0,100);filter(false);filters.forEach(b=>b.addEventListener('click',()=>{category=b.dataset.filter;filter()}));search.addEventListener('input',()=>filter());search.form.addEventListener('submit',e=>{e.preventDefault();filter();document.querySelector('#noticias').scrollIntoView()});document.querySelector('#reset-filters').addEventListener('click',()=>{category='Todas';search.value='';filter();search.focus()});document.querySelector('.header-actions>a').addEventListener('click',()=>{requestAnimationFrame(()=>search.focus())});document.querySelectorAll('[data-nav]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();category=a.dataset.nav;filter();document.querySelector('#noticias').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});if(menu.getAttribute('aria-expanded')==='true')menu.click()}));window.addEventListener('popstate',()=>{const p=new URLSearchParams(location.search);category=filters.some(b=>b.dataset.filter===p.get('categoria'))?p.get('categoria'):'Todas';search.value=p.get('q')||'';filter(false)})}
const save=document.querySelector('[data-save]');
const status=document.querySelector('.share-status');
const saveKey='40iguais:salvos';
if(save){let saved=[];try{saved=JSON.parse(localStorage.getItem(saveKey)||'[]');if(!Array.isArray(saved))saved=[]}catch{}const sync=()=>{const active=saved.includes(save.dataset.save);save.setAttribute('aria-pressed',String(active));save.setAttribute('aria-label',active?'Remover dos salvos neste dispositivo':'Salvar para ler depois neste dispositivo');save.textContent=active?'♥':'♡'};sync();save.addEventListener('click',()=>{const slug=save.dataset.save;saved=saved.includes(slug)?saved.filter(s=>s!==slug):[...saved,slug];try{localStorage.setItem(saveKey,JSON.stringify(saved));sync();status.textContent=saved.includes(slug)?'História salva neste dispositivo.':'História removida dos salvos.'}catch{status.textContent='O navegador não permitiu salvar. Você pode adicionar esta página aos favoritos.'}})}
document.querySelector('[data-share]')?.addEventListener('click',async()=>{const data={title:document.title,url:location.href};try{if(navigator.share){await navigator.share(data);status.textContent='História compartilhada.'}else if(navigator.clipboard){await navigator.clipboard.writeText(data.url);status.textContent='Link copiado. É só compartilhar.'}else{status.textContent='Copie o endereço desta página para compartilhar.'}}catch(e){if(e.name!=='AbortError')status.textContent='Copie o endereço desta página para compartilhar.'}});
