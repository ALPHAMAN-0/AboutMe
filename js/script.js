/* ============================================================
   Siam Hossain — portfolio
   Minimal JS: live competitive-programming stats + active nav.
   No scroll-reveal hides scan-critical content (HR 5-second scan).
   ============================================================ */
const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* ------------------------------------------------------------
   Active nav link highlight (which section is in view)
   ------------------------------------------------------------ */
(function activeNav(){
  const links = $$('.topbar nav a');
  if (!links.length) return;
  const map = new Map();
  links.forEach(a => {
    const id = a.getAttribute('href');
    if (id && id.startsWith('#')){ const el = $(id); if (el) map.set(el, a); }
  });
  if (!map.size) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const a = map.get(e.target);
      if (a && e.isIntersecting){
        links.forEach(l => l.removeAttribute('aria-current'));
        a.setAttribute('aria-current', 'true');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  map.forEach((_, el) => io.observe(el));
})();

/* ------------------------------------------------------------
   Mobile nav — hamburger toggles the nav panel (<=920px)
   ------------------------------------------------------------ */
(function mobileNav(){
  const btn = $('.nav-toggle');
  const nav = $('#site-nav');
  if (!btn || !nav) return;

  const close = () => {
    nav.removeAttribute('data-open');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Open menu');
  };
  const open = () => {
    nav.setAttribute('data-open', 'true');
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', 'Close menu');
  };

  btn.addEventListener('click', () => {
    nav.getAttribute('data-open') === 'true' ? close() : open();
  });
  nav.addEventListener('click', e => { if (e.target.tagName === 'A') close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* ------------------------------------------------------------
   Intro video — the About video block (and the hero "Watch my
   intro" button) only appear when videos/intro.mp4 actually
   exists, so the site stays deployable before it's recorded.
   ------------------------------------------------------------ */
(function introVideo(){
  const block   = $('#intro');
  const video   = $('#intro-player');
  const overlay = $('.iv-overlay');
  if (!block || !video || !overlay) return;

  const SRC    = 'videos/intro.mp4';
  const POSTER = 'images/intro-poster.jpg';

  fetch(SRC, { headers: { Range: 'bytes=0-0' } })
    .then(r => { if (r.ok) enable(); })
    .catch(() => {});

  function enable(){
    block.hidden = false;
    $('#about')?.classList.add('video-on');
    const cta = $('.sc-video-cta');
    if (cta) cta.hidden = false;

    // use the poster if one has been committed; otherwise the
    // first video frame serves as the still
    const img = new Image();
    img.onload = () => { video.poster = POSTER; };
    img.src = POSTER;

    video.preload = 'metadata';
    video.load();
    video.addEventListener('loadedmetadata', () => {
      const t = $('.iv-time');
      if (t && isFinite(video.duration) && video.duration > 0){
        const total = Math.round(video.duration);
        const m = Math.floor(total / 60);
        const s = total % 60;
        t.textContent = ` · ${m}:${String(s).padStart(2, '0')}`;
        overlay.setAttribute('aria-label',
          `Play my video introduction (${m ? m + ' min ' : ''}${s} sec)`);
      }
    }, { once: true });
  }

  const restoreOverlay = () => {
    video.controls = false;
    overlay.hidden = false;
  };

  overlay.addEventListener('click', () => {
    overlay.hidden = true;
    video.controls = true;
    video.focus();
    const p = video.play();
    if (p) p.catch(restoreOverlay);
  });

  // if the media itself fails (network drop, bad file), bring the
  // branded play button back instead of stranding a black frame
  const source = video.querySelector('source');
  (source || video).addEventListener('error', restoreOverlay);

  video.addEventListener('ended', () => {
    const hadFocus = document.activeElement === video ||
                     video.contains(document.activeElement);
    video.controls = false;
    video.currentTime = 0;
    overlay.hidden = false;
    if (hadFocus) overlay.focus();
  });
})();

/* ------------------------------------------------------------
   Competitive-programming — live solved counts
   ------------------------------------------------------------ */
(async function platformStats(){
  async function setLive(platform, text, label){
    const card = $(`.ps-card[data-platform="${platform}"]`);
    if (!card) return;
    const numEl = card.querySelector('.ps-stat-num');
    const labEl = card.querySelector('.ps-stat-label');
    if (!numEl) return;
    numEl.style.opacity = '0';
    await new Promise(r => setTimeout(r, 180));
    numEl.textContent = text;
    if (label && labEl) labEl.textContent = label;
    numEl.style.opacity = '1';
  }

  async function fetchWithTimeout(url, ms){
    const ctrl = new AbortController();
    const tid = setTimeout(() => ctrl.abort(), ms);
    try {
      const r = await fetch(url, { signal: ctrl.signal });
      clearTimeout(tid);
      return r;
    } catch (e){ clearTimeout(tid); throw e; }
  }

  async function leetcode(){
    try {
      const r = await fetchWithTimeout('https://alfa-leetcode-api.onrender.com/RedApple47/solved', 8000);
      if (!r.ok) return;
      const d = await r.json();
      if (typeof d.solvedProblem === 'number'){
        await setLive('leetcode', d.solvedProblem.toLocaleString(), 'solved');
      }
    } catch {}
  }

  async function codeforces(){
    try {
      const r = await fetchWithTimeout(
        'https://codeforces.com/api/user.status?handle=SIAM001&from=1&count=10000', 15000
      );
      if (!r.ok) return;
      const d = await r.json();
      if (d.status !== 'OK') return;
      const seen = new Set();
      for (const s of d.result){
        if (s.verdict === 'OK'){
          seen.add(`${s.problem.contestId ?? s.problem.name}_${s.problem.index}`);
        }
      }
      if (seen.size > 0) await setLive('codeforces', seen.size.toLocaleString(), 'solved');
    } catch {}
  }

  // HackerRank has no CORS-enabled public API, so we route through a CORS proxy
  // and sum solved counts across badges. If the proxy is unavailable, the
  // hardcoded value in the HTML stays as a reliable fallback.
  async function hackerrank(){
    try {
      const ep = 'https://www.hackerrank.com/rest/hackers/BaBaYaGa_A1/badges';
      const r = await fetchWithTimeout('https://corsproxy.io/?url=' + encodeURIComponent(ep), 9000);
      if (!r.ok) return;
      const d = await r.json();
      if (!d || !Array.isArray(d.models)) return;
      const total = d.models.reduce((s, b) => s + (Number(b.solved) || 0), 0);
      if (total > 0) await setLive('hackerrank', total.toLocaleString(), 'solved');
    } catch {}
  }

  Promise.allSettled([leetcode(), codeforces(), hackerrank()]);
})();

/* ============================================================
   HACKER MODE — toggle, boot sequence, glitch, terminal, XP bars
   ============================================================ */

/* ------------------------------------------------------------
   Skill levels — subjective ratings per skill chip.
   Matched against .sg-list li text content (case-insensitive,
   trimmed). Order doesn't matter; first match wins.
   ------------------------------------------------------------ */
const SKILL_LEVELS = {
  // Frontend
  'react': 95, 'angular': 80, 'typescript': 92, 'javascript (es6+)': 90,
  'html5 / css3': 88, 'redux': 78, 'next.js': 85,
  // Backend
  'node.js': 90, 'express': 88, 'python': 90, 'rest apis': 85, 'jwt / auth': 82,
  // Languages
  'python': 90, 'typescript': 92, 'java': 75, 'c++': 80, 'c#': 72,
  'go': 60, 'php': 65, 'bash': 70,
  // Database
  'postgresql': 80, 'mysql': 80, 'prisma': 78, 'vector databases': 70, 'mongodb': 85,
  // AI / ML
  'openai / llms': 80, 'rag pipelines': 75, 'prompt engineering': 78,
  'ai agents': 72, 'pytorch': 65, 'langchain': 70, 'llamaindex': 65,
  // Data & DevOps
  'docker': 82, 'aws': 72, 'microsoft azure': 70, 'linux': 80, 'git': 90,
  // Tools
  'vs code': 95, 'visual studio': 78, 'postman': 88, 'pycharm': 80, 'webstorm': 85,
  // CS Fundamentals
  'data structures & algorithms': 88, 'networking (tcp/ip, osi)': 75, 'system design basics': 72,
  // Spoken
  'bangla (native)': 100, 'english (fluent)': 92, 'german (a2)': 35
};
function normalizeKey(s){ return s.replace(/\s+/g,' ').trim().toLowerCase(); }

/* ------------------------------------------------------------
   Mode toggle — flips <html class="hacker-mode">, persists in
   localStorage, and triggers boot sequence on first activation.
   ------------------------------------------------------------ */
(function initModeToggle(){
  const btn = $('[data-mode-toggle]');
  if (!btn) return;

  const root = document.documentElement;
  const STORAGE = (() => { try { return localStorage; } catch { return null; } })();
  const SESSION = (() => { try { return sessionStorage; } catch { return null; } })();

  const apply = (on, fireBoot) => {
    root.classList.toggle('hacker-mode', !!on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.textContent = on ? '[EXIT.exe]' : '[HACKER.exe]';
    if (STORAGE) STORAGE.setItem('hackerMode', on ? '1' : '0');
    if (on && fireBoot) {
      runBootSequence();
      if (SESSION) SESSION.setItem('booted', '1');
    }
  };

  // Restore previous state. Boot plays on EVERY page load when
  // HACKER mode is active — the "feel like hacker" opener.
  let saved = '0';
  try { saved = STORAGE ? (STORAGE.getItem('hackerMode') || '0') : '0'; } catch {}
  if (saved === '1'){
    apply(true, true);
  } else {
    apply(false, false);
  }

  btn.addEventListener('click', () => {
    const next = !root.classList.contains('hacker-mode');
    apply(next, true);
  });

  // Expose for the terminal command
  window.__toggleHackerMode = (force) => {
    if (typeof force === 'boolean') apply(force, true);
    else apply(!root.classList.contains('hacker-mode'), true);
  };
})();

/* ------------------------------------------------------------
   Boot sequence — typewriter boot logs with progress bar,
   corner brackets that close in like a "window opening", and a
   hacker-style header. Auto-dismisses on completion or click.
   ------------------------------------------------------------ */
function runBootSequence(){
  const screen = $('.boot-screen');
  const log    = screen?.querySelector('.boot-log');
  const bar    = screen?.querySelector('.boot-bar-fill');
  if (!screen || !log || !bar) return;

  screen.hidden = false;
  screen.classList.remove('is-done', 'is-opening');
  // Force reflow so the window-open animation re-triggers cleanly
  void screen.offsetWidth;
  screen.classList.add('is-opening');

  log.innerHTML = '';
  bar.style.width = '0%';

  const LINES = [
    { text: '> initializing portfolio v2.0.4 ...', cls: '' },
    { text: '> handshake with aiub.edu.bd ...', cls: '' },
    { text: '> loading skills.db ........... ', cls: '', tail: { text: '[ OK ]', cls: 'boot-ok' } },
    { text: '> connecting leetcode.api ...... ', cls: '', tail: { text: '[ OK ]', cls: 'boot-ok' } },
    { text: '> mounting react + node runtime . ', cls: '', tail: { text: '[ OK ]', cls: 'boot-ok' } },
    { text: '> spinning up ai-agent cluster . ', cls: '', tail: { text: '[ OK ]', cls: 'boot-ok' } },
    { text: '> decrypting resume.pdf ........ ', cls: '', tail: { text: '[ OK ]', cls: 'boot-ok' } },
    { text: '> scanning cv for skills ....... ', cls: '', tail: { text: '[ OK ]', cls: 'boot-ok' } },
    { text: '> verifying llm.api key ........ ', cls: '', tail: { text: '[ OK ]', cls: 'boot-ok' } },
    { text: '> ⚠ coffee.level low — refilling ... ', cls: 'boot-warn' },
    { text: '> [ READY ] siam.hossain.online', cls: 'boot-ok' },
    { text: '', cls: '' },
    { text: 'welcome, visitor. click anywhere or wait to enter.', cls: 'boot-warn' }
  ];

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const charDelay = reduce ? 0 : 6;
  const lineDelay = reduce ? 0 : 70;

  let cancelled = false;
  const dismiss = () => {
    if (cancelled) return;
    cancelled = true;
    screen.classList.remove('is-opening');
    screen.classList.add('is-done');
    setTimeout(() => { screen.hidden = true; }, 650);
  };
  screen.addEventListener('click', dismiss, { once: true });

  // Wait for window-open animation to finish before typing
  const openDelay = reduce ? 0 : 600;

  setTimeout(() => {
    let lineIdx = 0;
    const nextLine = () => {
      if (cancelled) return;
      if (lineIdx >= LINES.length){
        bar.style.width = '100%';
        setTimeout(dismiss, reduce ? 200 : 1100);
        return;
      }
      const L = LINES[lineIdx++];
      const div = document.createElement('span');
      div.className = 'term-line ' + (L.cls || 'term-out');
      log.appendChild(div);
      if (L.text === ''){ nextLine(); return; }

      let i = 0;
      const caret = document.createElement('span');
      caret.className = 'boot-cursor';
      div.appendChild(caret);
      const type = () => {
        if (cancelled) return;
        if (i < L.text.length){
          caret.insertAdjacentText('beforebegin', L.text[i++]);
          bar.style.width = Math.min(100, (lineIdx / LINES.length) * 100) + '%';
          setTimeout(type, charDelay);
        } else {
          caret.remove();
          if (L.tail){
            const tail = document.createElement('span');
            tail.className = 'term-line ' + L.tail.cls;
            tail.textContent = ' ' + L.tail.text;
            div.appendChild(tail);
          }
          setTimeout(nextLine, lineDelay);
        }
      };
      type();
    };
    nextLine();
  }, openDelay);
}

/* ------------------------------------------------------------
   Glitch text — mirrors text content into data-text so the CSS
   pseudo-elements have something to render.
   ------------------------------------------------------------ */
(function initGlitch(){
  $$('.glitch').forEach(el => {
    if (!el.getAttribute('data-text')) {
      el.setAttribute('data-text', el.textContent || '');
    }
  });
})();

/* ------------------------------------------------------------
   Skill XP meters — apply levels from SKILL_LEVELS and animate
   fills via IntersectionObserver.
   ------------------------------------------------------------ */
(function animateSkillMeters(){
  const items = $$('.sg-list li');
  if (!items.length) return;

  items.forEach(li => {
    const txt = normalizeKey(li.textContent || '');
    let level = 70;
    for (const k in SKILL_LEVELS){
      if (txt.includes(k)){ level = SKILL_LEVELS[k]; break; }
    }
    li.style.setProperty('--level', level + '%');

    // Inject meter + LVL label (idempotent)
    if (!li.querySelector('.meter')){
      const textNode = [...li.childNodes].find(n => n.nodeType === 3 && n.textContent.trim());
      const skillName = textNode ? textNode.textContent.trim() : '';
      // Rebuild contents: text + meter + lvl
      li.innerHTML = '';
      const span = document.createElement('span');
      span.className = 'sg-name';
      span.textContent = skillName;
      li.appendChild(span);
      const meter = document.createElement('span');
      meter.className = 'meter';
      meter.innerHTML = '<span class="meter-fill"></span>';
      li.appendChild(meter);
      const lvl = document.createElement('span');
      lvl.className = 'lvl';
      lvl.textContent = 'LVL ' + level;
      li.appendChild(lvl);
    }
  });

  if (!('IntersectionObserver' in window)) {
    items.forEach(li => li.classList.add('is-animated'));
    return;
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      e.target.classList.add('is-animated');
    });
  }, { threshold: 0.25, rootMargin: '0px 0px -8% 0px' });

  items.forEach(li => io.observe(li));
})();

/* ------------------------------------------------------------
   Terminal command widget — bottom-left CLI for navigation,
   CV download, theme switch, and a few easter eggs.
   ------------------------------------------------------------ */
(function initTerminal(){
  const toggle = $('.terminal-toggle');
  const panel  = $('.terminal-cmd');
  const input  = panel?.querySelector('.term-input');
  const log    = panel?.querySelector('.term-log');
  const close  = panel?.querySelector('.term-close');
  if (!toggle || !panel || !input || !log) return;

  let history = [];
  let histIdx = -1;

  const write = (text, cls) => {
    const line = document.createElement('div');
    line.className = 'term-line ' + (cls || 'term-out');
    line.textContent = text;
    log.appendChild(line);
    log.scrollTop = log.scrollHeight;
  };

  const printBanner = () => {
    write('┌─────────────────────────────────────┐', 'term-info');
    write('│  siam@aboutme:~$ type "help"        │', 'term-info');
    write('└─────────────────────────────────────┘', 'term-info');
  };

  const goto = (id) => {
    const el = $(id);
    if (!el){ write(`section not found: ${id}`, 'term-err'); return; }
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    write(`→ navigating to ${id}`, 'term-ok');
  };

  const COMMANDS = {
    help(){
      write('available commands:', 'term-info');
      write('  about · experience · skills · work · contact', 'term-out');
      write('  cv           download resume.pdf', 'term-out');
      write('  theme        toggle hacker / light mode', 'term-out');
      write('  whoami       who is behind this terminal', 'term-out');
      write('  ls           list virtual filesystem', 'term-out');
      write('  clear        clear the screen', 'term-out');
      write('  ping         check latency', 'term-out');
      write('  matrix       ???', 'term-out');
    },
    about(){ goto('#about'); },
    experience(){ goto('#experience'); },
    skills(){ goto('#skills'); },
    work(){ goto('#work'); },
    contact(){ goto('#contact'); },
    cv(){
      const a = document.createElement('a');
      a.href = 'Siam-Hossain-CV.pdf';
      a.download = '';
      document.body.appendChild(a);
      a.click();
      a.remove();
      write('→ downloading resume.pdf', 'term-ok');
    },
    theme(){
      if (typeof window.__toggleHackerMode === 'function'){
        window.__toggleHackerMode(false);
        write('→ theme: light', 'term-ok');
      } else {
        write('theme toggle unavailable', 'term-err');
      }
    },
    hacker(){
      if (typeof window.__toggleHackerMode === 'function'){
        window.__toggleHackerMode(true);
        write('→ theme: hacker', 'term-ok');
      } else {
        write('hacker toggle unavailable', 'term-err');
      }
    },
    whoami(){
      write('siam hossain — full-stack / ai engineer · dhaka, bd', 'term-ok');
      write('cs @ aiub · open to opportunities · 2000+ dsa problems', 'term-info');
    },
    ls(){
      write('README.md  skills.db  projects/  contact.vcf  resume.pdf', 'term-out');
    },
    pwd(){ write('/home/siam/AboutMe', 'term-out'); },
    date(){ write(new Date().toString(), 'term-info'); },
    ping(){ write('pong · 14ms · ttl=64', 'term-ok'); },
    matrix(){
      write('01001001 01100001 01101101 00100000', 'term-ok');
      write('... wake up, neo ...', 'term-info');
    },
    coffee(){
      write('☕ brewing ...', 'term-ok');
      setTimeout(() => write('☕ ready. productivity +5', 'term-ok'), 600);
    },
    clear(){ log.innerHTML = ''; printBanner(); }
  };

  const open = () => {
    panel.hidden = false;
    panel.setAttribute('data-open', 'true');
    toggle.setAttribute('aria-expanded', 'true');
    panel.removeAttribute('inert');
    if (!log.dataset.bannered){ printBanner(); log.dataset.bannered = '1'; }
    setTimeout(() => input.focus(), 50);
  };
  const shut = () => {
    panel.removeAttribute('data-open');
    toggle.setAttribute('aria-expanded', 'false');
    panel.setAttribute('inert', '');
    setTimeout(() => { panel.hidden = true; }, 280);
    toggle.focus();
  };

  toggle.addEventListener('click', () => {
    panel.hidden ? open() : shut();
  });
  close?.addEventListener('click', shut);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && panel.getAttribute('data-open') === 'true') shut();
    // ` to toggle
    if (e.key === '`' && !panel.hidden && !['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)){
      shut();
    }
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter'){
      const raw = input.value.trim();
      if (!raw) return;
      write('visitor@aboutme:~$ ' + raw, 'term-info');
      history.push(raw);
      histIdx = history.length;
      input.value = '';
      const cmd = COMMANDS[raw.toLowerCase()];
      if (cmd){
        try { cmd(); } catch (err){ write('error: ' + err.message, 'term-err'); }
      } else {
        write(`command not found: ${raw}. type "help"`, 'term-err');
      }
    } else if (e.key === 'ArrowUp'){
      if (histIdx > 0){ histIdx--; input.value = history[histIdx]; }
      e.preventDefault();
    } else if (e.key === 'ArrowDown'){
      if (histIdx < history.length - 1){ histIdx++; input.value = history[histIdx]; }
      else { histIdx = history.length; input.value = ''; }
      e.preventDefault();
    }
  });
})();
