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
const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('in-view')}),{threshold:.28});
document.querySelectorAll('.guga-legacy').forEach(section=>revealObserver.observe(section));
document.querySelector('.ball').addEventListener('click',()=>document.querySelector('#manifesto').scrollIntoView({behavior:'smooth'}));
const logoStage=document.querySelector('.logo-stage'),logo=logoStage.querySelector('img'),logoCount=logoStage.querySelector('span b');
const logoVariants=[
  {src:'assets/svg/Logo-1.svg',alt:'Logotipo principal 40iguais'},
  {src:'assets/svg/Alternative-Logo.svg',alt:'Logotipo alternativo 40iguais'},
  {src:'assets/svg/Logo-Icon.svg',alt:'Símbolo circular 40iguais'}
];
let logoIndex=0,logoTimer;
function cycleLogo(){
  if(logoStage.classList.contains('is-changing'))return;
  logoStage.classList.add('is-changing');
  clearTimeout(logoTimer);
  logoTimer=setTimeout(()=>{
    logoIndex=(logoIndex+1)%logoVariants.length;
    logo.src=logoVariants[logoIndex].src;
    logo.alt=logoVariants[logoIndex].alt;
    logoCount.textContent=String(logoIndex+1).padStart(2,'0');
    logoStage.classList.remove('is-changing');
  },180);
}
logoStage.addEventListener('click',cycleLogo);
logoStage.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();cycleLogo()}});
document.addEventListener('keydown',e=>{if(!['ArrowDown','ArrowUp',' ','PageDown','PageUp'].includes(e.key))return;e.preventDefault();const panels=[...document.querySelectorAll('.panel')];const y=scrollY+innerHeight*.45;let i=panels.findIndex(p=>p.offsetTop>y);if(e.key==='ArrowUp'||e.key==='PageUp')i=Math.max(0,(i<0?panels.length:i)-2);else i=i<0?panels.length-1:i;panels[i]?.scrollIntoView({behavior:'smooth'})});
