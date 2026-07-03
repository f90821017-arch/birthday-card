/* assets/script.js */

// Utility: reduced motion
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Heart generation and animation
const heartsContainerSelector = '.hearts-back';
const HEART_COUNT = 12;

function rand(min,max){return Math.random()*(max-min)+min}

function createHearts(){
  const container = document.querySelector(heartsContainerSelector);
  if(!container) return;
  container.innerHTML = '';

  for(let i=0;i<HEART_COUNT;i++){
    const el = document.createElement('div');
    el.className = 'heart';
    const size = Math.round(rand(18,64));
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.left = `${rand(6,94)}%`;
    el.style.top = `${rand(10,80)}%`;
    const hue = rand(340,355);
    el.style.opacity = rand(0.35,0.9);
    el.innerHTML = `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 21s-7.5-4.6-10-7.5C-1 8.5 3 3 7.5 5.5 10 7 12 9.5 12 9.5s2-2.5 4.5-4c4.5-2.5 8.5 3.5 5.5 8.5C19.5 16.4 12 21 12 21z" fill="rgba(199,116,116,0.95)"/></svg>`;
    // store physics
    el.dataset.vx = rand(-0.02,0.02);
    el.dataset.vy = rand(-0.02,-0.06);
    el.dataset.sw = rand(0.6,1.6);
    container.appendChild(el);
  }
}

let lastScrollY = window.scrollY;
function animateHearts(){
  if(REDUCED_MOTION) return;
  const hearts = document.querySelectorAll('.heart');
  if(!hearts.length) return;
  hearts.forEach(h =>{
    let top = parseFloat(h.style.top || 50);
    let left = parseFloat(h.style.left || 50);
    const vx = parseFloat(h.dataset.vx);
    const vy = parseFloat(h.dataset.vy);
    const sway = parseFloat(h.dataset.sw);

    // scroll parallax: hearts lag behind scroll
    const scrollDelta = (window.scrollY - lastScrollY) * 0.03;
    top += vy*10 - scrollDelta;
    left += Math.sin(Date.now()/1000 * sway) * 0.03 + vx*10;

    if(top < -10) top = 110;
    if(top > 110) top = -10;
    if(left < -10) left = 110;
    if(left > 110) left = -10;

    h.style.top = `${top}%`;
    h.style.left = `${left}%`;
    const scale = 0.9 + Math.abs(Math.sin(Date.now()/1000* (sway/1.1))) * 0.12;
    h.style.transform = `translate3d(-50%,-50%,0) scale(${scale})`;
  });
  lastScrollY = window.scrollY;
  requestAnimationFrame(animateHearts);
}

// Page navigation and accessibility
let currentPage = 0;
const pages = Array.from(document.querySelectorAll('.page'));
const totalPages = pages.length;
const announcer = document.getElementById('announcer');

function showPage(i){
  if(i<0 || i>=totalPages) return;
  pages.forEach((p, idx)=>{
    p.classList.toggle('active', idx===i);
  });
  currentPage = i;
  updateNavState();
  // move focus to heading
  const h = pages[i].querySelector('h1');
  if(h){ h.tabIndex = -1; h.focus(); }
  // announce
  if(announcer) announcer.textContent = `Page ${i+1} of ${totalPages}: ${h ? h.textContent : ''}`;
}

function updateNavState(){
  document.querySelectorAll('.prev').forEach(btn=>{
    const index = Array.from(document.querySelectorAll('.prev')).indexOf(btn);
    btn.disabled = (currentPage===0);
  });
  document.querySelectorAll('.next').forEach(btn=>{
    const index = Array.from(document.querySelectorAll('.next')).indexOf(btn);
    btn.disabled = (currentPage>=totalPages-1);
  });
  // update counters
  document.querySelectorAll('.page-counter').forEach(el=> el.textContent = `${currentPage+1} of ${totalPages}`);
}

function setupNavigation(){
  pages.forEach((p, idx)=>{
    const next = p.querySelector('.next');
    const prev = p.querySelector('.prev');
    if(next){ next.addEventListener('click', ()=>{ showPage(Math.min(totalPages-1, currentPage+1)); }); }
    if(prev){ prev.addEventListener('click', ()=>{ showPage(Math.max(0, currentPage-1)); }); }
  });

  // keyboard
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' '){
      if(currentPage < totalPages-1){ showPage(currentPage+1); }
    } else if(e.key === 'ArrowLeft' || e.key === 'PageUp'){
      if(currentPage > 0) showPage(currentPage-1);
    }
  });
}

// Parallax on scroll for card (subtle)
function setupParallax(){
  const card = document.querySelector('.card');
  if(!card || REDUCED_MOTION) return;
  window.addEventListener('scroll', ()=>{
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    const bgShift = pct * -12;
    card.style.transform = `translate3d(0, ${bgShift}px, 0)`;
  });
}

// Audio handling
const audio = document.getElementById('background-music');
const audioToggle = document.getElementById('audio-toggle');
let isPlaying = false;

function readPref(){
  try{ return localStorage.getItem('birthday-music-muted') === 'true'; }catch(e){return true}
}

function writePref(v){
  try{ localStorage.setItem('birthday-music-muted', v); }catch(e){}
}

function updateAudioUI(){
  const icon = document.getElementById('audio-icon');
  if(isPlaying && !audio.muted){ audioToggle.setAttribute('aria-label','Music playing — Click to mute'); audioToggle.classList.add('playing'); }
  else { audioToggle.setAttribute('aria-label','Music muted — Click to play'); audioToggle.classList.remove('playing'); }
}

function toggleAudio(){
  if(isPlaying){ audio.pause(); isPlaying=false; }
  else{ audio.muted = false; audio.play().then(()=>{ isPlaying=true; }).catch(()=>{ isPlaying=false; }); }
  updateAudioUI(); writePref(audio.muted);
}

if(audio){
  // prefer external file but allow local override when available
  const prefMuted = readPref();
  audio.muted = prefMuted;
  // slight slow-down for romantic feel
  try{ audio.playbackRate = 0.95; }catch(e){}
  // attempt autoplay muted
  audio.volume = 0.45;
  audio.play().then(()=>{ isPlaying = true; updateAudioUI(); }).catch(()=>{ /* user interaction required */ updateAudioUI(); });
}

audioToggle.addEventListener('click', ()=>{
  if(audio){
    if(audio.muted){ audio.muted = false; audio.play(); isPlaying=true; }
    else { audio.muted = true; audio.pause(); isPlaying=false; }
    writePref(audio.muted); updateAudioUI();
  }
});

audioToggle.addEventListener('keydown', (e)=>{
  if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); audioToggle.click(); }
});

// Init
createHearts();
if(!REDUCED_MOTION) requestAnimationFrame(animateHearts);
setupNavigation();
setupParallax();
showPage(0);
updateNavState();

// Recreate hearts on resize to better fit layout
window.addEventListener('resize', ()=>{ if(!REDUCED_MOTION){ createHearts(); } });

