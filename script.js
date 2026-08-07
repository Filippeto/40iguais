const cursor=document.querySelector('.cursor');
window.addEventListener('pointermove',e=>{cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px'});
document.querySelectorAll('a,button,.card').forEach(el=>{el.addEventListener('mouseenter',()=>cursor.style.width=cursor.style.height='42px');el.addEventListener('mouseleave',()=>cursor.style.width=cursor.style.height='13px')});
const toggle=document.querySelector('.menu-toggle'),menu=document.querySelector('#menu');
toggle.addEventListener('click',()=>{const open=menu.classList.toggle('open');toggle.setAttribute('aria-expanded',open);toggle.querySelector('span').textContent=open?'×':'+'});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.querySelector('span').textContent='+'}));
const progress=document.querySelector('.progress span');
window.addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(scrollY/max*100)+'%'},{passive:true});
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('visible',entry.isIntersecting)),{threshold:.55});
document.querySelectorAll('.manifesto-copy p').forEach(p=>observer.observe(p));
document.querySelector('.ball').addEventListener('click',()=>document.querySelector('#manifesto').scrollIntoView({behavior:'smooth'}));
const logoStage=document.querySelector('.logo-stage'),logo=logoStage.querySelector('img'),logoLabel=logoStage.querySelector('span');
const logoVersions=['assets/svg/Logo-1.svg','assets/svg/Alternative-Logo.svg','assets/svg/Logo-Icon.svg'];let logoIndex=0;
function nextLogo(){logoIndex=(logoIndex+1)%logoVersions.length;logoStage.classList.add('switching');setTimeout(()=>{logo.src=logoVersions[logoIndex];logoLabel.textContent=`clique · ${String(logoIndex+1).padStart(2,'0')}/03`;logoStage.classList.remove('switching')},180)}
logoStage.addEventListener('click',nextLogo);logoStage.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();nextLogo()}});
const legacy=document.querySelector('.legacy');if(legacy)new IntersectionObserver(([entry])=>legacy.classList.toggle('visible',entry.isIntersecting),{threshold:.28}).observe(legacy);
document.addEventListener('keydown',e=>{if(!['ArrowDown','ArrowUp',' ','PageDown','PageUp'].includes(e.key))return;e.preventDefault();const panels=[...document.querySelectorAll('.panel')];const y=scrollY+innerHeight*.45;let i=panels.findIndex(p=>p.offsetTop>y);if(e.key==='ArrowUp'||e.key==='PageUp')i=Math.max(0,(i<0?panels.length:i)-2);else i=i<0?panels.length-1:i;panels[i]?.scrollIntoView({behavior:'smooth'})});
