/* =============================================
   SHARON CAMPAIGN WEBSITE – SCRIPT.JS
   ============================================= */

'use strict';

// ── Intro Splash Screen Logic ────────────────
window.addEventListener('DOMContentLoaded', () => {
  const splash = document.getElementById('splashScreen');
  if (!splash) return;

  // After 2.5s, start the fade out
  setTimeout(() => {
    splash.classList.add('splash-hidden');
    document.body.classList.remove('intro-active');
  }, 2500);
});

// ── Campaign Video Logic ──────────────────────
window.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('sharonVideo');
  const playBtn = document.getElementById('playBtn');
  const overlay = document.querySelector('.video-controls-overlay');
  const videoMsg = document.getElementById('videoMsg');

  if (!video || !playBtn || !overlay) return;

  const togglePlay = () => {
    if (video.paused || video.muted) {
      video.muted = false; // Unmute on first play interaction
      video.play();
      overlay.classList.add('hidden');
    } else {
      video.pause();
      overlay.classList.remove('hidden');
      if (videoMsg) videoMsg.textContent = "Click to Resume Sharon's Vision";
    }
  };

  overlay.addEventListener('click', togglePlay);

  // Native controls will handle play/pause once unmuted

  // Handle video ending
  video.addEventListener('ended', () => {
    overlay.classList.remove('hidden');
    if (videoMsg) videoMsg.textContent = "Replay Sharon's Vision";
  });
});

// ── Navbar scroll effect ──────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Mobile nav toggle ─────────────────────────
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.innerHTML = navLinks.classList.contains('open') ? '&#10005;' : '&#9776;';
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.innerHTML = '&#9776;';
  });
});

// ── Smooth active nav link ────────────────────
const sections = document.querySelectorAll('section[id]');
const navAs = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navAs.forEach(a => {
    a.classList.remove('nav-active');
    if (a.getAttribute('href') === '#' + current) a.classList.add('nav-active');
  });
}, { passive: true });

// ── Scroll reveal ─────────────────────────────
const fadeEls = document.querySelectorAll('.fade-in-left, .fade-in-right, .fade-up');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
fadeEls.forEach(el => revealObs.observe(el));

// ── Animated progress bars ────────────────────
const progressBars = document.querySelectorAll('.progress-bar');
const barObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const target = e.target.dataset.width || '60';
      e.target.style.width = target + '%';
      barObs.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });
progressBars.forEach(b => barObs.observe(b));

// ── Gallery tab switching ─────────────────────
const tabs = document.querySelectorAll('.gallery-tab');
const panes = document.querySelectorAll('.gallery-pane');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    panes.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('pane-' + tab.dataset.tab).classList.add('active');
  });
});

// ── Particle Canvas ───────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  const PARTICLE_COUNT = 80;
  const particles = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(createParticle());
  }

  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2.2 + 0.3,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4 - 0.15,
      alpha: Math.random() * 0.5 + 0.1,
      red: Math.random() > 0.6,   // true = red tint, false = white/pink
      life: Math.random() * Math.PI * 2,  // phase offset
    };
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const now = Date.now() * 0.001;

    particles.forEach((p, i) => {
      p.life += 0.01;
      p.x += p.vx;
      p.y += p.vy;

      // wrap around
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;

      const pulse = 0.5 + 0.5 * Math.sin(p.life);
      const finalAlpha = p.alpha * pulse;

      if (p.red) {
        ctx.fillStyle = `rgba(177, 18, 38, ${finalAlpha})`;
      } else {
        ctx.fillStyle = `rgba(255, 107, 138, ${finalAlpha * 0.7})`;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();

      // draw glow halo for bigger particles
      if (p.r > 1.2 && p.red) {
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
        grad.addColorStop(0, `rgba(177, 18, 38, ${finalAlpha * 0.3})`);
        grad.addColorStop(1, `rgba(177, 18, 38, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    requestAnimationFrame(draw);
  }

  draw();
})();

// ── Counter animation ────────────────────────
function animateCount(el, target, suffix = '', duration = 1500) {
  const start = 0;
  const startTime = performance.now();
  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const statObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const nums = e.target.querySelectorAll('.stat-num');
      nums.forEach(n => {
        const text = n.textContent.trim();
        if (text === '∞') return;
        const match = text.match(/^(\d+)(.*)$/);
        if (match) animateCount(n, parseInt(match[1]), match[2]);
      });
      statObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
const statsArea = document.querySelector('.about-stats');
if (statsArea) statObs.observe(statsArea);

// ── Parallax tilt on hero shapes ─────────────
document.addEventListener('mousemove', (e) => {
  const shapes = document.querySelectorAll('.shape');
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx;
  const dy = (e.clientY - cy) / cy;
  shapes.forEach((s, i) => {
    const depth = (i + 1) * 8;
    s.style.transform = `translate(${dx * depth}px, ${dy * depth}px)`;
  });
});

// ── Why section number counter (why items) ────
const whyItems = document.querySelectorAll('.why-item');
const whyObs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => { e.target.classList.add('visible'); }, i * 80);
    }
  });
}, { threshold: 0.1 });
whyItems.forEach(item => {
  item.classList.add('fade-up');
  whyObs.observe(item);
});

// ── Cursor glow (optional subtle effect) ──────
(function cursorGlow() {
  const glow = document.createElement('div');
  glow.style.cssText = `
    pointer-events:none; position:fixed; z-index:9999; top:0; left:0;
    width:300px; height:300px; border-radius:50%;
    background: radial-gradient(circle, rgba(177,18,38,0.07) 0%, transparent 70%);
    transform:translate(-50%,-50%); transition:transform 0.15s ease, opacity 0.3s;
    opacity:0;
  `;
  document.body.appendChild(glow);
  let mx = 0, my = 0;
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    glow.style.left = mx + 'px';
    glow.style.top = my + 'px';
    glow.style.opacity = '1';
  });
  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
})();

// ── Add nav-active style ──────────────────────
const style = document.createElement('style');
style.textContent = `.nav-active { color: var(--white) !important; }`;
document.head.appendChild(style);
