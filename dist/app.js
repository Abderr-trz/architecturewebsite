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

// CSS perspective gallery: a static grid is the baseline on touch and reduced motion.
(() => {
  const projects = [
    {image:'residence-minerale',title:'Volumes & lumière',alt:'Perspective d’une villa contemporaine en pierre claire et d’une terrasse'},
    {image:'facade-sable',title:'Lignes & douceur',alt:'Façade aux tons sable, aux lignes arrondies et aux balcons végétalisés'},
    {image:'jardin-eau',title:'Eau & paysage',alt:'Jardin avec piscine, cascade et végétation'},
    {image:'facade-jardin',title:'Ombre & matière',alt:'Vue frontale d’une façade sable et de son jardin planté'}
  ];
  const section=document.querySelector('.projects');
  const track=document.querySelector('.gallery-track');
  const ring=document.querySelector('.gallery-ring');
  const cards=[...document.querySelectorAll('.project-card')];
  const viewer=document.getElementById('project-viewer');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const desktop=matchMedia('(min-width:1000px) and (hover:hover) and (pointer:fine)');
  let active=0, viewed=0, frame=0, enabled=false, rotation=0, target=0, lastFocus=null;
  const clamp=(n,min,max)=>Math.min(max,Math.max(min,n));
  function select(index){
    active=clamp(index,0,projects.length-1);
    document.getElementById('project-number').textContent=`0${active+1} / 04`;
    document.getElementById('project-title').textContent=projects[active].title;
    cards.forEach((card,i)=>{
      const button=card.querySelector('button');
      if(enabled){card.setAttribute('aria-hidden',String(i!==active));button.tabIndex=i===active?0:-1;}
      else{card.removeAttribute('aria-hidden');button.removeAttribute('tabindex');}
    });
  }
  function targetFromScroll(){
    const box=track.getBoundingClientRect();
    const travel=Math.max(1,track.offsetHeight-window.innerHeight+70);
    const progress=clamp((35-box.top)/travel,0,1);
    // Four deliberate stops, with a smooth 60-degree turn between each.
    const segment=progress*3;
    const step=Math.min(2,Math.floor(segment));
    const local=clamp((segment-step-.17)/.66,0,1);
    const eased=local*local*(3-2*local);
    return -60*(step+eased);
  }
  function animate(){
    frame=0;
    if(!enabled)return;
    target=targetFromScroll();
    rotation+=(target-rotation)*.16;
    if(Math.abs(target-rotation)<.03)rotation=target;
    ring.style.setProperty('--rotation',`${rotation}deg`);
    select(Math.round(-rotation/60));
    if(Math.abs(target-rotation)>.03)frame=requestAnimationFrame(animate);
  }
  function schedule(){if(enabled&&!frame)frame=requestAnimationFrame(animate);}
  function configure(){
    enabled=desktop.matches&&!reduced.matches;
    section.classList.toggle('gallery-enhanced',enabled);
    cancelAnimationFrame(frame);frame=0;
    if(!enabled){ring.style.removeProperty('--rotation');select(active);}
    else{rotation=targetFromScroll();schedule();}
  }
  function go(direction){
    const next=clamp(active+direction,0,projects.length-1);
    const top=window.scrollY+track.getBoundingClientRect().top;
    const travel=Math.max(1,track.offsetHeight-window.innerHeight+70);
    // Stop centers correspond to the integer progress positions.
    window.scrollTo({top:Math.max(0,top-35+(next/3)*travel),behavior:reduced.matches?'instant':'smooth'});
    document.getElementById('gallery-announcement').textContent=`Perspective ${next+1} sur 4 : ${projects[next].title}`;
  }
  function showImage(index){
    viewed=(index+projects.length)%projects.length;
    const image=document.getElementById('viewer-image');
    image.src=`assets/${projects[viewed].image}.webp`;
    image.alt=projects[viewed].alt;
    document.getElementById('viewer-title').textContent=projects[viewed].title;
    document.getElementById('viewer-count').textContent=`0${viewed+1} / 04`;
  }
  function openViewer(index,trigger){lastFocus=trigger;showImage(index);viewer.showModal();}
  document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>openViewer(Number(button.dataset.project),button)));
  document.querySelector('.gallery-view').addEventListener('click',event=>openViewer(active,event.currentTarget));
  document.querySelector('.gallery-prev').addEventListener('click',()=>go(-1));
  document.querySelector('.gallery-next').addEventListener('click',()=>go(1));
  document.querySelector('.viewer-prev').addEventListener('click',()=>showImage(viewed-1));
  document.querySelector('.viewer-next').addEventListener('click',()=>showImage(viewed+1));
  document.querySelector('.viewer-close').addEventListener('click',()=>viewer.close());
  viewer.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();showImage(viewed-1);}if(event.key==='ArrowRight'){event.preventDefault();showImage(viewed+1);}});
  viewer.addEventListener('close',()=>lastFocus?.focus({preventScroll:true}));
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule);
  desktop.addEventListener('change',configure);
  reduced.addEventListener('change',configure);
  window.addEventListener('pageshow',configure);
  window.addEventListener('pagehide',event=>{
    cancelAnimationFrame(frame);frame=0;
    if(event.persisted)return;
    window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);
    desktop.removeEventListener('change',configure);reduced.removeEventListener('change',configure);
    window.removeEventListener('pageshow',configure);
  });
  configure();
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
