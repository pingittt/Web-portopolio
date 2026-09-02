/* ================= MOBILE NAV ================= */
const burger = document.getElementById('burgerBtn');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => navLinks.classList.toggle('open'));
document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => navLinks.classList.remove('open')));

/* ================= ACTIVE LINK ON SCROLL ================= */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      navItems.forEach(n => n.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if(active) active.classList.add('active');
    }
  });
}, {rootMargin:'-45% 0px -45% 0px'});
sections.forEach(s => navObserver.observe(s));

/* ================= REVEAL ON SCROLL ================= */
const revealEls = document.querySelectorAll('.reveal, .skill-card');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('in-view');
    }
  });
}, {threshold:0.15});
revealEls.forEach(el => revealObserver.observe(el));

/* ================= PROJECT FILTER ================= */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('#projectGrid .project-card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    projectCards.forEach(card => {
      const show = (f === 'all' || card.dataset.cat === f);
      card.style.display = show ? '' : 'none';
    });
  });
});

/* ================= CONTACT FORM (demo only) ================= */
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  document.getElementById('formNote').textContent = 'Pesan terkirim! (demo — hubungkan ke backend/email service untuk pengiriman sungguhan)';
  e.target.reset();
});

/* ================= PARTICLE FIELD ================= */
(() => {
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let w, h, dpr;
  let particles = [];
  const mouse = { x:-9999, y:-9999, active:false };
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    initParticles();
  }

  function initParticles(){
    const count = Math.round((w*h)/16000);
    particles = new Array(count).fill(0).map(() => ({
      x: Math.random()*w,
      y: Math.random()*h,
      r: Math.random()*1.8 + 0.6,
      baseAlpha: Math.random()*0.35 + 0.15,
      vx: (Math.random()-0.5)*0.18,
      vy: (Math.random()-0.5)*0.18,
      alpha: 0
    }));
  }

  const colorA = [36,64,240];   // blue
  const colorB = [18,19,26];    // ink

  function draw(){
    ctx.clearRect(0,0,w,h);
    const repelRadius = 140;

    for(const p of particles){
      // drift
      p.x += p.vx;
      p.y += p.vy;
      if(p.x < -10) p.x = w+10;
      if(p.x > w+10) p.x = -10;
      if(p.y < -10) p.y = h+10;
      if(p.y > h+10) p.y = -10;

      let dx = p.x - mouse.x;
      let dy = p.y - mouse.y;
      let dist = Math.sqrt(dx*dx + dy*dy);

      let targetAlpha = p.baseAlpha;
      let drawX = p.x, drawY = p.y;

      if(mouse.active && dist < repelRadius){
        // particle fades out / gets pushed away near cursor -> "hilang" effect
        const force = (1 - dist/repelRadius);
        targetAlpha = p.baseAlpha * (1 - force); // fade toward invisible
        const angle = Math.atan2(dy, dx);
        const push = force * 34;
        drawX = p.x + Math.cos(angle) * push;
        drawY = p.y + Math.sin(angle) * push;
      }

      p.alpha += (targetAlpha - p.alpha) * 0.12;

      const mix = (p.r > 1.4) ? colorA : colorB;
      ctx.beginPath();
      ctx.fillStyle = `rgba(${mix[0]},${mix[1]},${mix[2]},${Math.max(p.alpha,0)})`;
      ctx.arc(drawX, drawY, p.r, 0, Math.PI*2);
      ctx.fill();
    }

    if(!reduceMotion) requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true;
  });
  window.addEventListener('mouseleave', () => { mouse.active = false; });
  window.addEventListener('touchmove', (e) => {
    if(e.touches[0]){ mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; mouse.active = true; }
  }, {passive:true});
  window.addEventListener('touchend', () => { mouse.active = false; });

  resize();
  if(reduceMotion){
    draw(); // draw once, static
  } else {
    requestAnimationFrame(draw);
  }
})();