(() => {
 const compact=matchMedia('(max-width:999px), (pointer:coarse)');
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 let observer;
 function setup(){
  observer?.disconnect();
  document.querySelectorAll('.mobile-frame-wait,.mobile-rise-wait').forEach(el=>el.classList.remove('mobile-frame-wait','mobile-rise-wait'));
  if(!compact.matches||reduced.matches||!('IntersectionObserver' in window))return;
  observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(!entry.isIntersecting)return;
   const el=entry.target;
   el.classList.remove('mobile-frame-wait','mobile-rise-wait');
   el.classList.add(el.dataset.mobileMotion==='frame'?'mobile-frame-in':'mobile-rise-in');
   observer.unobserve(el);
  }),{threshold:.08,rootMargin:'0px 0px 25px 0px'});
  const frames=[...document.querySelectorAll('.hero-media,.full-image-frame,.expertise-image-frame,.project-detail-figure,.related-card')];
  const text=[...document.querySelectorAll('.projects-heading,.gallery-sticky,.regard-main,.contact-copy,.brief-form,.project-detail h1,.project-reading,.related-perspectives .section-heading,.detail-invitation')];
  [...frames,...text].forEach(el=>{
   if(el.classList.contains('mobile-frame-in')||el.classList.contains('mobile-rise-in'))return;
   const frame=frames.includes(el);el.dataset.mobileMotion=frame?'frame':'rise';
   el.classList.add(frame?'mobile-frame-wait':'mobile-rise-wait');observer.observe(el);
  });
 }
 compact.addEventListener('change',setup);reduced.addEventListener('change',setup);addEventListener('pageshow',setup);
 addEventListener('pagehide',e=>{observer?.disconnect();if(!e.persisted){compact.removeEventListener('change',setup);reduced.removeEventListener('change',setup);removeEventListener('pageshow',setup);}});
 setup();
})();
