(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let introTimer;
  if (!reduced.matches) {
    try {
      if (!sessionStorage.getItem('kr-intro')) {
        document.body.classList.add('motion-ready');
        sessionStorage.setItem('kr-intro', '1');
        introTimer = setTimeout(() => document.querySelector('.intro')?.remove(), 2000);
      }
    } catch { /* A blocked session store leaves the content visible. */ }
  }
  const slides = [
    { title: 'La force des lignes.', category: 'ARCHITECTURE', image: 'residence-minerale', announcement: 'Villa contemporaine en pierre claire' },
    { title: 'La douceur des courbes.', category: 'ARCHITECTURE', image: 'facade-sable', announcement: 'Façade aux lignes arrondies et aux teintes sable' },
    { title: 'Un dialogue avec le vivant.', category: 'ESPACES EXTÉRIEURS', image: 'jardin-eau', announcement: 'Jardin et piscine' }
  ];
  let current = 0;
  const images = [...document.querySelectorAll('.hero-image')];
  const indicators = [...document.querySelectorAll('[data-slide]')];
  function showSlide(index) {
    current = (index + slides.length) % slides.length;
    images.forEach((image, i) => {
      image.classList.toggle('is-active', i === current);
      image.setAttribute('aria-hidden', String(i !== current));
    });
    indicators.forEach((button, i) => {
      button.classList.toggle('is-active', i === current);
      button.setAttribute('aria-pressed', String(i === current));
    });
    document.getElementById('card-image').src = `assets/${slides[current].image}-small.webp`;
    document.getElementById('card-title').textContent = slides[current].title;
    document.getElementById('card-category').textContent = slides[current].category;
    document.getElementById('slide-count').innerHTML = `0${current + 1} <b>/ 03</b>`;
    document.getElementById('slide-announcement').textContent = `Visuel ${current + 1} sur 3 : ${slides[current].announcement}`;
  }
  document.querySelectorAll('[data-direction]').forEach(button => button.addEventListener('click', () => showSlide(current + Number(button.dataset.direction))));
  indicators.forEach(button => button.addEventListener('click', () => showSlide(Number(button.dataset.slide))));
  const menu = document.getElementById('menu');
  const opener = document.querySelector('.menu-button');
  opener.addEventListener('click', () => {menu.showModal();opener.setAttribute('aria-expanded', 'true');});
  const closeMenu = () => menu.close();
  document.querySelector('.close-menu').addEventListener('click', closeMenu);
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  menu.addEventListener('close', () => {opener.setAttribute('aria-expanded', 'false');opener.focus({preventScroll: true});});
  window.addEventListener('pagehide', () => clearTimeout(introTimer), {once:true});
})();

// Spatial image carousel: images move in depth; captions stay outside the 3D scene.
(() => {
 const projects=[
  {image:'residence-minerale',slug:'volumes-lumiere',title:'Volumes & lumière',alt:'Perspective d’une villa contemporaine en pierre claire et d’une terrasse'},
  {image:'facade-sable',slug:'lignes-douceur',title:'Lignes & douceur',alt:'Façade aux tons sable, aux lignes arrondies et aux balcons végétalisés'},
  {image:'jardin-eau',slug:'eau-paysage',title:'Eau & paysage',alt:'Jardin avec piscine, cascade et végétation'},
  {image:'facade-jardin',slug:'ombre-matiere',title:'Ombre & matière',alt:'Vue frontale d’une façade sable et de son jardin planté'}
 ];
 const section=document.querySelector('.projects');if(!section)return;
 const track=section.querySelector('.gallery-track'),sticky=section.querySelector('.gallery-sticky');
 const scene=section.querySelector('.gallery-scene'),viewer=document.getElementById('project-viewer');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const desktop=matchMedia('(min-width:1000px) and (hover:hover) and (pointer:fine)');
 const clamp=(n,a,b)=>Math.min(b,Math.max(a,n)),wrap=n=>(n%4+4)%4;
 const orbit=document.createElement('div');orbit.className='gallery-orbit';orbit.hidden=true;
 const slots=Array.from({length:6},(_,i)=>{
  const card=document.createElement('div');card.className='orbit-card';card.setAttribute('aria-hidden','true');
  const link=document.createElement('a');link.tabIndex=-1;
  const image=document.createElement('img');image.alt='';image.width=1104;image.height=624;image.decoding='async';
  link.append(image);card.append(link);orbit.append(card);return {card,link,image,offset:i-2,index:-1};
 });scene.append(orbit);
 let active=-1,viewed=0,frame=0,enabled=false,position=0,lastFocus=null;
 function select(index){
  if(index===active)return;active=index;
  document.getElementById('project-number').textContent=`0${active+1} / 04`;
  section.querySelector('.gallery-prev').disabled=active===0;section.querySelector('.gallery-next').disabled=active===3;
  const title=document.getElementById('project-title');
  title.textContent='';const link=document.createElement('a');link.href=`projets/${projects[active].slug}.html`;link.textContent=projects[active].title;title.append(link);
  if(enabled&&!reduced.matches)title.animate([{opacity:.3,transform:'translateY(7px)'},{opacity:1,transform:'none'}],{duration:360,easing:'ease-out'});
 }
 function metrics(){const box=track.getBoundingClientRect(),top=parseFloat(getComputedStyle(sticky).top)||0;return {box,top,travel:Math.max(1,track.offsetHeight-sticky.offsetHeight)};}
 function target(){
  const {box,top,travel}=metrics();const p=clamp((top-box.top)/travel,0,1)*3;
  const step=Math.min(2,Math.floor(p)),t=clamp((p-step-.17)/.66,0,1);return step+t*t*(3-2*t);
 }
 function render(){
  const base=Math.floor(position),fraction=position-base,width=section.clientWidth;
  const spacing=width*.335,tail=width*.155;
  slots.forEach(slot=>{
   const d=slot.offset-fraction,a=Math.abs(d),index=wrap(base+slot.offset),sign=Math.sign(d);
   const x=sign*(a<=1?a*spacing:spacing+(a-1)*tail);
   const z=-a*155,y=a*7,yaw=-sign*Math.min(74,a*36);
   slot.card.style.transform=`translate3d(${x}px,${y}px,${z}px) rotateY(${yaw}deg) scale(${1-.4*Math.min(a,1)})`;
   slot.card.style.opacity=String(clamp((2.65-a)/.55,0,1));
   const selected=a<.5;
   slot.card.style.pointerEvents=selected?'auto':'none';
   slot.card.setAttribute('aria-hidden',String(!selected));slot.link.tabIndex=selected?0:-1;
   if(index!==slot.index){slot.index=index;slot.image.src=`assets/${projects[index].image}.webp`;slot.image.alt=projects[index].alt;slot.link.href=`projets/${projects[index].slug}.html`;slot.link.setAttribute('aria-label',`Découvrir la perspective : ${projects[index].title}`);}
  });
  select(clamp(Math.round(position),0,3));
 }
 function animate(){frame=0;if(!enabled)return;const t=target();position+=(t-position)*.15;if(Math.abs(t-position)<.001)position=t;render();if(Math.abs(t-position)>=.001)frame=requestAnimationFrame(animate);}
 function schedule(){if(enabled&&!frame)frame=requestAnimationFrame(animate);}
 function configure(){enabled=desktop.matches&&!reduced.matches;section.classList.toggle('gallery-enhanced',enabled);orbit.hidden=!enabled;cancelAnimationFrame(frame);frame=0;if(enabled){position=target();render();}else select(Math.max(0,active));}
 function go(direction){const next=clamp(active+direction,0,3),{box,top,travel}=metrics();window.scrollTo({top:scrollY+box.top-top+(next/3)*travel,behavior:reduced.matches?'instant':'smooth'});document.getElementById('gallery-announcement').textContent=`Perspective ${next+1} sur 4 : ${projects[next].title}`;}
 function showImage(index){viewed=wrap(index);const image=document.getElementById('viewer-image');image.src=`assets/${projects[viewed].image}.webp`;image.alt=projects[viewed].alt;document.getElementById('viewer-title').textContent=projects[viewed].title;document.getElementById('viewer-count').textContent=`0${viewed+1} / 04`;}
 function openViewer(index,trigger){lastFocus=trigger;showImage(index);viewer.showModal();}
 document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>openViewer(Number(button.dataset.project),button)));
 section.querySelector('.gallery-view').addEventListener('click',e=>openViewer(active,e.currentTarget));
 section.querySelector('.gallery-prev').addEventListener('click',()=>go(-1));section.querySelector('.gallery-next').addEventListener('click',()=>go(1));
 document.querySelector('.viewer-prev').addEventListener('click',()=>showImage(viewed-1));document.querySelector('.viewer-next').addEventListener('click',()=>showImage(viewed+1));document.querySelector('.viewer-close').addEventListener('click',()=>viewer.close());
 viewer.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();showImage(viewed-1);}if(e.key==='ArrowRight'){e.preventDefault();showImage(viewed+1);}});viewer.addEventListener('close',()=>lastFocus?.focus({preventScroll:true}));
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);desktop.addEventListener('change',configure);reduced.addEventListener('change',configure);addEventListener('pageshow',configure);
 addEventListener('pagehide',e=>{cancelAnimationFrame(frame);frame=0;if(e.persisted)return;removeEventListener('scroll',schedule);removeEventListener('resize',schedule);desktop.removeEventListener('change',configure);reduced.removeEventListener('change',configure);removeEventListener('pageshow',configure);});configure();
})();

// Native disclosures stay usable without JavaScript; motion is a progressive enhancement.
(() => {
  const items=[...document.querySelectorAll('.expertise-item')];
  const visual=document.querySelector('.expertise-visual');
  const image=document.getElementById('expertise-image');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const hover=matchMedia('(hover:hover) and (pointer:fine)');
  const content=[
    {image:'residence-minerale',alt:'Perspective d’une villa contemporaine ouverte sur son jardin',caption:'PERSPECTIVE ARCHITECTURALE',statement:'Dessiner ce qui nous entoure.'},
    {image:'jardin-eau',alt:'Perspective paysagère avec piscine et végétation, illustration des rapports entre espaces',caption:'VUE PAYSAGÈRE · ILLUSTRATION',statement:'Relier les lieux et les usages.'},
    {image:'perspectives-selection',alt:'Sélection de perspectives fournies : façades, salon et chambres',caption:'SÉLECTION DE PERSPECTIVES FOURNIES',statement:'Habiter jusque dans le détail.'}
  ];
  let current=0,animationTimer;
  function update(index){
    if(index===current)return;
    current=index;
    image.src=`assets/${content[index].image}.webp`;
    image.alt=content[index].alt;
    document.getElementById('expertise-caption').textContent=content[index].caption;
    document.getElementById('expertise-count').textContent=`0${index+1} / 03`;
    document.getElementById('expertise-statement').textContent=content[index].statement;
    if(!reduced.matches){
      visual.classList.remove('is-changing');
      // Restart a finite reveal, with no persistent frame loop.
      void visual.offsetWidth;
      visual.classList.add('is-changing');
      clearTimeout(animationTimer);
      animationTimer=setTimeout(()=>visual.classList.remove('is-changing'),550);
    }
  }
  items.forEach((item,index)=>{
    item.addEventListener('toggle',()=>{if(item.open){items.forEach(other=>{if(other!==item)other.open=false;});update(index);}});
    item.addEventListener('mouseenter',()=>{if(hover.matches)item.open=true;});
  });
  // Only elements below the viewport are staged; content stays visible if enhancement fails.
  let observer;
  function setupReveals(){
    observer?.disconnect();
    document.querySelectorAll('.reveal-pending').forEach(el=>el.classList.remove('reveal-pending'));
    if(reduced.matches||!('IntersectionObserver' in window))return;
    observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){entry.target.classList.remove('reveal-pending');entry.target.classList.add('reveal-visible');observer.unobserve(entry.target);}
      });
    },{threshold:.08,rootMargin:'0px 0px 20px 0px'});
    document.querySelectorAll('[data-reveal]').forEach(el=>{
      if(el.getBoundingClientRect().top>innerHeight){el.classList.add('reveal-pending');observer.observe(el);}
    });
  }
  reduced.addEventListener('change',setupReveals);
  window.addEventListener('pageshow',setupReveals);
  window.addEventListener('pagehide',event=>{clearTimeout(animationTimer);observer?.disconnect();if(!event.persisted){reduced.removeEventListener('change',setupReveals);window.removeEventListener('pageshow',setupReveals);}});
  setupReveals();
})();

(() => {
 const form=document.getElementById('brief-form');if(!form)return;
 const result=document.getElementById('brief-result'),message=document.getElementById('brief-message'),status=document.getElementById('copy-status');
 form.addEventListener('submit',event=>{event.preventDefault();if(!form.reportValidity())return;const data=new FormData(form);message.value=`Bonjour Kenza,\n\nJe m’appelle ${String(data.get('prenom')).trim()}. Je souhaite échanger avec vous au sujet d’un projet à ${String(data.get('ville')).trim()}.\n\nType de projet : ${String(data.get('type'))}.\n${String(data.get('idee')).trim()}\n\nSeriez-vous disponible pour un premier échange ?\nMerci !`;result.hidden=false;status.textContent='Votre message est prêt. Copiez-le puis envoyez-le sur Instagram.';message.focus({preventScroll:true});});
 document.getElementById('copy-brief').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(message.value);status.textContent='Message copié. Ouvrez Instagram pour l’envoyer à Kenza.';}catch{message.focus();message.select();status.textContent='Sélectionnez et copiez le texte, puis envoyez-le sur Instagram.';}});
})();
