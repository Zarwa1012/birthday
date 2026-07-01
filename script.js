/* =====================================================================
   BIRTHDAY WEBSITE — SCRIPT.JS
   Sections:
   1. Loader
   2. Background layer generation (hearts/stars/sparkles/fireflies,
      bubbles/blobs/clouds, butterflies)
   3. Cursor glow + mouse parallax on aurora
   4. Confetti burst
   5. Page swipe engine (touch, mouse drag, keyboard, dots)
   6. Sequential gallery reveal
   7. Music control
===================================================================== */

/* ---------------------------------------------------------------
   1. LOADER — hide once everything is ready
--------------------------------------------------------------- */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hide');
    fireConfetti();          // premium surprise burst as the site opens
  }, 900);
});

/* ---------------------------------------------------------------
   2. BACKGROUND LAYER GENERATION
--------------------------------------------------------------- */
function randomBetween(min, max){ return Math.random() * (max - min) + min; }

// Layer 1: hearts, stars, sparkles, fireflies
function buildLayer1(){
  const layer = document.getElementById('layer1');
  const hearts = ['💗','💕','💖','💓'];
  const total = 22;

  for(let i = 0; i < total; i++){
    const type = i % 4;
    const el = document.createElement('span');
    el.classList.add('float-item');

    const left = randomBetween(0, 100);
    const duration = randomBetween(9, 20);
    const delay = randomBetween(0, 15);

    el.style.left = left + '%';
    el.style.animationDuration = duration + 's';
    el.style.animationDelay = '-' + delay + 's';

    if(type === 0){
      el.classList.add('f-heart');
      el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    } else if(type === 1){
      el.classList.add('f-star');
      el.textContent = '⭐';
    } else if(type === 2){
      el.classList.add('f-spark');
    } else {
      el.classList.add('f-firefly');
      el.style.animationDuration = randomBetween(6, 10) + 's';
    }
    layer.appendChild(el);
  }
}

// Layer 2: bubbles, blurred blobs, clouds
function buildLayer2(){
  const layer = document.getElementById('layer2');

  // bubbles
  for(let i = 0; i < 10; i++){
    const el = document.createElement('span');
    el.classList.add('float-item', 'f-bubble');
    const size = randomBetween(10, 26);
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    el.style.left = randomBetween(0, 100) + '%';
    el.style.animationDuration = randomBetween(12, 22) + 's';
    el.style.animationDelay = '-' + randomBetween(0, 15) + 's';
    layer.appendChild(el);
  }

  // soft gradient blobs (gently pulsing in place, not rising)
  const blobColors = ['var(--pink)', 'var(--lavender)', 'var(--blue)'];
  for(let i = 0; i < 4; i++){
    const el = document.createElement('span');
    el.classList.add('float-item', 'f-blob');
    const size = randomBetween(120, 220);
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    el.style.left = randomBetween(0, 90) + '%';
    el.style.top = randomBetween(0, 90) + '%';
    el.style.bottom = 'auto';
    el.style.background = blobColors[i % blobColors.length];
    el.style.animationDuration = randomBetween(8, 14) + 's';
    el.style.animationDelay = '-' + randomBetween(0, 8) + 's';
    layer.appendChild(el);
  }

  // slow clouds
  for(let i = 0; i < 3; i++){
    const el = document.createElement('span');
    el.classList.add('float-item', 'f-cloud');
    el.textContent = '☁️';
    el.style.fontSize = randomBetween(30, 55) + 'px';
    el.style.top = randomBetween(5, 60) + '%';
    el.style.bottom = 'auto';
    el.style.left = '0';
    el.style.animationDuration = randomBetween(40, 70) + 's';
    el.style.animationDelay = '-' + randomBetween(0, 30) + 's';
    layer.appendChild(el);
  }
}

// Floating butterflies
function buildButterflies(){
  const wrap = document.getElementById('butterflies');
  const emojis = ['🦋'];
  for(let i = 0; i < 6; i++){
    const el = document.createElement('span');
    el.classList.add('butterfly');
    el.textContent = emojis[0];
    el.style.left = randomBetween(5, 95) + '%';
    el.style.bottom = randomBetween(-10, 10) + '%';
    el.style.animationDuration = randomBetween(10, 18) + 's';
    el.style.animationDelay = '-' + randomBetween(0, 12) + 's';
    wrap.appendChild(el);
  }
}

buildLayer1();
buildLayer2();
buildButterflies();

/* ---------------------------------------------------------------
   3. CURSOR GLOW + MOUSE PARALLAX ON AURORA
--------------------------------------------------------------- */
const cursorGlow = document.getElementById('cursorGlow');
const auroras = document.querySelectorAll('.aurora');

window.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';

  // subtle parallax: aurora shifts opposite to cursor for depth feeling
  const xPercent = (e.clientX / window.innerWidth - 0.5) * 2;   // -1 to 1
  const yPercent = (e.clientY / window.innerHeight - 0.5) * 2;

  auroras.forEach((a, i) => {
    const strength = (i + 1) * 8; // different depth per aurora blob
    a.style.transform = `translate(${xPercent * strength}px, ${yPercent * strength}px)`;
  });
});

/* ---------------------------------------------------------------
   4. CONFETTI BURST (lightweight canvas confetti, no library)
--------------------------------------------------------------- */
const confettiCanvas = document.getElementById('confettiCanvas');
const ctx = confettiCanvas.getContext('2d');
let confettiPieces = [];
let confettiRunning = false;

function resizeCanvas(){
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function fireConfetti(){
  const colors = ['#ff9ecf', '#ffd6ec', '#d7bfff', '#b8e7ff', '#ffffff'];
  confettiPieces = [];

  for(let i = 0; i < 140; i++){
    confettiPieces.push({
      x: randomBetween(0, confettiCanvas.width),
      y: randomBetween(-confettiCanvas.height * 0.3, 0),
      size: randomBetween(5, 10),
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: randomBetween(2, 5),
      speedX: randomBetween(-1.5, 1.5),
      rotation: randomBetween(0, 360),
      rotationSpeed: randomBetween(-6, 6),
      shape: Math.random() > 0.5 ? 'circle' : 'rect'
    });
  }

  if(!confettiRunning){
    confettiRunning = true;
    requestAnimationFrame(animateConfetti);
  }

  // stop spawning influence after a while, let pieces fall off-screen
  setTimeout(() => { confettiPieces = confettiPieces.filter(() => false === false); }, 10);
}

function animateConfetti(){
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  let stillActive = false;

  confettiPieces.forEach(p => {
    p.y += p.speedY;
    p.x += p.speedX;
    p.rotation += p.rotationSpeed;

    if(p.y < confettiCanvas.height + 20) stillActive = true;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;
    if(p.shape === 'circle'){
      ctx.beginPath();
      ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    }
    ctx.restore();
  });

  if(stillActive){
    requestAnimationFrame(animateConfetti);
  } else {
    confettiRunning = false;
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }
}

/* ---------------------------------------------------------------
   5. PAGE NAVIGATION ENGINE — VERTICAL
   CHANGED: entire section rewritten from horizontal swipe
   (translateX / left-right) to vertical navigation (translateY /
   up-down), driven by:
     - mouse wheel / trackpad  (desktop)
     - touch swipe up/down     (mobile)
     - ArrowDown / ArrowUp keys
     - nav dots (unchanged, still clickable)
   A transition lock (isAnimating) stops multiple triggers from
   firing mid-animation, matching the 800ms CSS transition.
--------------------------------------------------------------- */
const pagesEl = document.getElementById('pages');
const totalPages = pagesEl.children.length;
const dotsEl = document.getElementById('dots');
const parallaxTargets = document.querySelectorAll('.bg-layer, .light-rays, .butterflies');
let current = 0;
let isAnimating = false;                 // NEW: transition lock
const TRANSITION_MS = 800;               // matches --transition-page in CSS

for(let i = 0; i < totalPages; i++){
  const d = document.createElement('div');
  d.classList.add('dot');
  if(i === 0) d.classList.add('active');
  d.addEventListener('click', () => goTo(i));
  dotsEl.appendChild(d);
}
const dotEls = document.querySelectorAll('.dot');

function goTo(index){
  const newIndex = Math.max(0, Math.min(totalPages - 1, index));
  if(newIndex === current || isAnimating) return;  // NEW: ignore no-op / mid-animation calls

  isAnimating = true;
  current = newIndex;

  // CHANGED: translateY instead of translateX — moves pages up/down
  pagesEl.style.transform = `translateY(-${current * 100}vh)`;
  dotEls.forEach((d, i) => d.classList.toggle('active', i === current));

  // NEW: slight parallax — background layers move at a fraction of the
  // page's distance, so they appear to glide slower than the foreground
  parallaxTargets.forEach(layer => {
    layer.style.transform = `translateY(-${current * 12}px)`;
  });

  // trigger gallery sequential reveal the first time page 2 is opened
  if(current === 1) revealGallery();

  // release the lock once the CSS transition finishes
  setTimeout(() => { isAnimating = false; }, TRANSITION_MS);
}

/* --- Mouse wheel / trackpad (desktop) --- */
window.addEventListener('wheel', (e) => {
  if(isAnimating) return;                 // NEW: swallow extra wheel events mid-transition
  if(e.deltaY > 20) goTo(current + 1);     // scroll down -> next page
  else if(e.deltaY < -20) goTo(current - 1); // scroll up -> previous page
}, { passive: true });

/* --- Touch swipe up/down (mobile) --- */
let touchStartY = 0;
let touchDragging = false;

pagesEl.addEventListener('touchstart', (e) => {
  touchStartY = e.touches[0].clientY;
  touchDragging = true;
});
pagesEl.addEventListener('touchend', (e) => {
  if(!touchDragging || isAnimating) return;
  touchDragging = false;
  const diff = touchStartY - e.changedTouches[0].clientY;
  const threshold = 50;
  if(diff > threshold) goTo(current + 1);        // swiped up -> next page
  else if(diff < -threshold) goTo(current - 1);  // swiped down -> previous page
});

/* --- Keyboard arrows --- */
window.addEventListener('keydown', (e) => {
  if(e.key === 'ArrowDown') goTo(current + 1);
  if(e.key === 'ArrowUp') goTo(current - 1);
});

/* ---------------------------------------------------------------
   6. SEQUENTIAL GALLERY REVEAL (one photo at a time, 500ms apart)
--------------------------------------------------------------- */
let galleryRevealed = false;

function revealGallery(){
  if(galleryRevealed) return; // only run once
  galleryRevealed = true;

  const frames = document.querySelectorAll('.frame');
  frames.forEach((frame, i) => {
    setTimeout(() => {
      // CHANGED: every frame now uses the same unified animation
      // (fade in + scale up + soft glow) instead of a different
      // animation per card, per the updated requirements.
      frame.style.animationName = 'revealFrame';
      frame.classList.add('visible');
      frame.style.opacity = '1';
      frame.style.transform = 'translateY(0) scale(1)';
    }, i * 500); // still 500ms apart, one by one
  });
}

/* ---------------------------------------------------------------
   7. MUSIC CONTROL
   CHANGED: music now tries to autoplay as soon as the site opens.
   If the browser's autoplay policy blocks that (very common), a
   floating "Tap to Start Music" button appears automatically; the
   very next click/tap anywhere on the page starts the music and
   hides the button. The existing Play/Pause button keeps working
   as a manual toggle either way. Music loops continuously.
--------------------------------------------------------------- */
const music = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
const musicIcon = document.getElementById('musicIcon');
const musicLabel = document.getElementById('musicLabel');
const tapMusicBtn = document.getElementById('tapMusicBtn');
let isPlaying = false;

function setPlayingUI(playing){
  isPlaying = playing;
  musicIcon.textContent = playing ? '⏸' : '🎵';
  musicLabel.textContent = playing ? 'Pause Music' : 'Play Music';
  tapMusicBtn.classList.add('hidden');
}

function tryAutoplay(){
  const playPromise = music.play();
  if(playPromise !== undefined){
    playPromise
      .then(() => setPlayingUI(true))       // autoplay succeeded
      .catch(() => {                        // NEW: autoplay blocked by browser
        tapMusicBtn.classList.remove('hidden');

        // start music on the very next click/tap anywhere on the page
        const startOnFirstInteraction = () => {
          music.play().then(() => setPlayingUI(true)).catch(() => {});
          document.removeEventListener('click', startOnFirstInteraction);
          document.removeEventListener('touchstart', startOnFirstInteraction);
        };
        document.addEventListener('click', startOnFirstInteraction);
        document.addEventListener('touchstart', startOnFirstInteraction);
      });
  }
}

// attempt autoplay as soon as the page has loaded
window.addEventListener('load', tryAutoplay);

// manual toggle button still works as before
musicBtn.addEventListener('click', () => {
  if(!isPlaying){
    music.play().catch(() => {});
    setPlayingUI(true);
  } else {
    music.pause();
    setPlayingUI(false);
  }
});

// clicking the floating "Tap to Start Music" button also starts it directly
tapMusicBtn.addEventListener('click', () => {
  music.play().then(() => setPlayingUI(true)).catch(() => {});
});
