/* ============================================================
   helpers
   ============================================================ */
const $  = (s, c=document) => c.querySelector(s);
const $$ = (s, c=document) => [...c.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile = matchMedia('(max-width: 820px)').matches;
const lerp = (a,b,t) => a + (b-a)*t;

/* ============================================================
   clock + deploy time
   ============================================================ */
(function clock(){
  const el = $('#clock'), dep = $('#deploy');
  if (!el) return;
  function tick(){
    const d = new Date();
    const pad = n => String(n).padStart(2,'0');
    el.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }
  tick(); setInterval(tick, 1000);
  if (dep){
    const dd = new Date();
    dep.textContent = dd.toISOString().slice(0,10) + 'T' + dd.toTimeString().slice(0,5);
  }
})();

/* ============================================================
   scramble text (hero name on load)
   ============================================================ */
(function scramble(){
  const chars = '!<>-_\\/[]{}—=+*^?#01';
  $$('.scramble').forEach((el, idx) => {
    const target = el.dataset.text;
    if (reduce){ el.textContent = target; return; }
    let frame = 0;
    const dur = 38 + target.length * 4;
    const start = performance.now() + idx * 140;
    el.textContent = '';
    function run(now){
      if (now < start){ requestAnimationFrame(run); return; }
      let out = '';
      const t = Math.min(1, (now - start) / (dur * 16));
      for (let i = 0; i < target.length; i++){
        const reveal = i / target.length;
        if (t > reveal + .15){
          out += target[i];
        } else if (t > reveal){
          out += chars[(Math.random()*chars.length)|0];
        } else {
          out += chars[(Math.random()*chars.length)|0];
        }
      }
      el.textContent = out;
      frame++;
      if (t < 1) requestAnimationFrame(run);
      else el.textContent = target;
    }
    requestAnimationFrame(run);
  });
})();

/* ============================================================
   typed terminal tagline
   ============================================================ */
(function typed(){
  const phrase = 'software engineer · full-stack · ml enthusiast_';
  const el = $('#typed');
  if (!el) return;
  if (reduce){ el.textContent = phrase; return; }
  let i = 0;
  setTimeout(function step(){
    el.textContent = phrase.slice(0, i++);
    if (i <= phrase.length) setTimeout(step, 38 + Math.random()*60);
  }, 900);
})();

/* ============================================================
   intersection-observer reveals
   ============================================================ */
(function reveals(){
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, {threshold: .14, rootMargin:'0px 0px -8% 0px'});
  $$('.reveal, .stagger').forEach(el => io.observe(el));

  const u = $('#leadU');
  if (u){
    const uio = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && u.classList.add('in')), {threshold:.4});
    uio.observe(u);
  }
})();

/* ============================================================
   marquee — clone for seamless loop
   ============================================================ */
(function marquee(){
  const track = $('#track');
  if (!track) return;
  track.innerHTML += track.innerHTML;
})();

/* ============================================================
   custom cursor + magnetic + hover states
   ============================================================ */
(function cursor(){
  if (mobile) return;
  const c = $('#cursor'), dot = $('#cursor-dot');
  if (!c || !dot) return;
  let mx = innerWidth/2, my = innerHeight/2;
  let cx = mx, cy = my, dx = mx, dy = my;
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  function loop(){
    cx = lerp(cx, mx, .18); cy = lerp(cy, my, .18);
    dx = lerp(dx, mx, .55); dy = lerp(dy, my, .55);
    c.style.transform   = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
    dot.style.transform = `translate(${dx}px,${dy}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  }
  loop();

  $$('[data-hover], a, button').forEach(el => {
    el.addEventListener('mouseenter', () => c.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => c.classList.remove('is-hover'));
  });

  $$('.magnet').forEach(el => {
    const radius = 90, strength = .35;
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width/2);
      const y = e.clientY - (r.top + r.height/2);
      const d = Math.hypot(x,y);
      if (d < radius * 2){
        el.style.transform = `translate(${x*strength}px, ${y*strength}px)`;
      }
    });
    el.addEventListener('mouseleave', () => el.style.transform = '');
  });
})();

/* ============================================================
   distortion grid background
   ============================================================ */
(function grid(){
  if (reduce) return;
  const cvs = $('#grid');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  let w, h, dpr = Math.min(devicePixelRatio || 1, 2);
  let mx = -9999, my = -9999;
  const step = 56;

  function size(){
    w = cvs.width = innerWidth * dpr;
    h = cvs.height = innerHeight * dpr;
    cvs.style.width = innerWidth+'px';
    cvs.style.height = innerHeight+'px';
  }
  size(); addEventListener('resize', size);
  addEventListener('mousemove', e => { mx = e.clientX * dpr; my = e.clientY * dpr; });
  addEventListener('mouseleave', () => { mx = my = -9999; });

  const RAD = 180 * dpr;

  function draw(){
    ctx.clearRect(0,0,w,h);
    ctx.lineWidth = 1;
    for (let x = 0; x <= w; x += step*dpr){
      for (let y = 0; y <= h; y += step*dpr){
        const dx = x - mx, dy = y - my;
        const d = Math.hypot(dx,dy);
        const inside = d < RAD;
        const push = inside ? (1 - d/RAD) * 18 * dpr : 0;
        const ang = Math.atan2(dy,dx);
        const px = x + Math.cos(ang) * push;
        const py = y + Math.sin(ang) * push;
        const alpha = inside ? .6 - (d/RAD)*.5 : .08;
        ctx.fillStyle = inside
          ? `rgba(195,255,0,${alpha})`
          : `rgba(245,240,232,${alpha})`;
        ctx.fillRect(px-1*dpr, py-1*dpr, 1.5*dpr, 1.5*dpr);
      }
    }
    requestAnimationFrame(draw);
  }
  if (!mobile) draw();
})();

/* ============================================================
   project preview (follow cursor + tilt)
   ============================================================ */
(function preview(){
  if (mobile) return;
  const pv = $('#preview'), tag = $('#prev-tag'), cap = $('#prev-cap'), frame = $('#prev-frame');
  if (!pv) return;
  let active = null, mx = 0, my = 0;
  let px = 0, py = 0, rx = 0, ry = 0;

  const ph = (label, hue) => `
    <svg viewBox="0 0 320 220" preserveAspectRatio="none">
      <defs>
        <pattern id="s${hue}" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(${hue})">
          <rect width="6" height="6" fill="#0e0e0e"/>
          <line x1="0" y1="0" x2="0" y2="6" stroke="#1f1d19" stroke-width="2"/>
        </pattern>
      </defs>
      <rect width="320" height="220" fill="url(#s${hue})"/>
      <rect x="20" y="20" width="280" height="180" fill="none" stroke="#3a3833" stroke-dasharray="3 6"/>
    </svg>
    <div style="position:relative;font-family:var(--mono);font-size:10px;letter-spacing:.18em;color:#8a857d;text-transform:uppercase">${label}</div>`;

  const img = (src) =>
    `<img src="${src}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover" alt="">`;

  const data = {
    p1: { tag: 'ai resume builder · 2025',   cap: 'ats scoring + jd matching · react/ts', svg: img('images/ai-resume-builder-preview.png') },
    p2: { tag: 'pos system · 2026',          cap: 'nasema pharmacy POS · real build · mern', svg: img('parmacyShop/02-dashboard.png') },
    p3: { tag: 'scroll animation · 2025',    cap: 'scroll-linked canvas reveal',          svg: img('Animation/222_026.png') },
    p4: { tag: 'e-commerce · 2024',          cap: 'mern storefronts · stripe',            svg: img('MegaBazar/01-homepage-top.png') },
    p5: { tag: 'llm & agents · 2024',        cap: 'openai · rag pipelines',               svg: ph('python · openai', 68) },
    p6: { tag: 'automation · 2024',          cap: 'selenium + maps api scraper',          svg: ph('python · selenium', 12) },
  };

  $$('.proj').forEach(p => {
    p.addEventListener('mouseenter', () => {
      const k = p.dataset.preview;
      active = k;
      const d = data[k]; if (!d) return;
      tag.textContent = d.tag; cap.textContent = d.cap; frame.innerHTML = d.svg;
      pv.classList.add('on');
    });
    p.addEventListener('mouseleave', () => { active = null; pv.classList.remove('on'); });
  });

  addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function loop(){
    if (active){
      px = lerp(px, mx + 40, .18);
      py = lerp(py, my,       .18);
      const tx = (mx - px) / 12;
      const ty = (my - py) / 12;
      rx = lerp(rx, -ty, .15);
      ry = lerp(ry,  tx, .15);
      pv.style.transform = `translate(${px}px,${py}px) translate(-50%,-50%) rotateX(${rx}deg) rotateY(${ry}deg) scale(1)`;
    }
    requestAnimationFrame(loop);
  }
  loop();
})();
