/* ============================================================
   Siam Hossain — portfolio (Spec Sheet)
   Vanilla JS, no dependencies.
   Each module is guarded — only runs when its hook exists.
   ============================================================ */
const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================================
   Head bootstrap — set the theme before paint, clear legacy keys.
   ============================================================ */
(function bootstrap(){
  // Clear HACKER-mode legacy keys
  try { localStorage.removeItem('hackerMode'); localStorage.removeItem('booted'); } catch {}
  const saved = (() => { try { return localStorage.getItem('theme'); } catch { return null; } })();
  if (saved === 'dark' || saved === 'light') {
    document.documentElement.setAttribute('data-theme', saved);
  }
})();

/* ============================================================
   Theme toggle — View Transition circle reveal, persists.
   ============================================================ */
(function theme(){
  if (!$('[data-theme-toggle]')) return;
  const root = document.documentElement;
  const btn  = $('[data-theme-toggle]');

  const sync = () => {
    const cur = root.getAttribute('data-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    btn.setAttribute('aria-pressed', cur === 'dark' ? 'true' : 'false');
    btn.setAttribute('aria-label', cur === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  };
  sync();

  btn.addEventListener('click', (e) => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    const rect = btn.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top  + rect.height / 2;

    const apply = () => {
      if (next === 'dark') root.setAttribute('data-theme', 'dark');
      else root.removeAttribute('data-theme');
      try { localStorage.setItem('theme', next); } catch {}
      sync();
    };

    if (reduceMotion || !document.startViewTransition) {
      apply();
      return;
    }

    document.documentElement.style.setProperty('--vt-x', `${x}px`);
    document.documentElement.style.setProperty('--vt-y', `${y}px`);
    document.startViewTransition(apply);
  });
})();

/* ============================================================
   Copy email — any element with data-copy
   ============================================================ */
(function copyEmail(){
  const els = $$('[data-copy]');
  if (!els.length) return;
  els.forEach(el => {
    el.addEventListener('click', async () => {
      const text = el.getAttribute('data-copy');
      try {
        await navigator.clipboard.writeText(text);
        flash(el, 'Copied');
      } catch {
        // fallback
        const ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); flash(el, 'Copied'); } catch {}
        ta.remove();
      }
    });
  });
  function flash(el, msg){
    const orig = el.textContent;
    el.textContent = msg;
    el.disabled = true;
    setTimeout(() => { el.textContent = orig; el.disabled = false; }, 1400);
  }
})();

/* ============================================================
   Phone action bar — show once hero is scrolled past
   ============================================================ */
(function actionBar(){
  const bar = $('[data-actionbar]');
  const trigger = $('[data-actionbar-trigger]');
  if (!bar || !trigger) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) bar.classList.remove('is-on');
      else if (e.boundingClientRect.top < 0) bar.classList.add('is-on');
    });
  }, { threshold: 0 });
  io.observe(trigger);
})();

/* ============================================================
   Live Dhaka clock — any element with data-clock
   ============================================================ */
(function clock(){
  const els = $$('[data-clock]');
  if (!els.length) return;
  const fmt = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Dhaka'
  });
  const tick = () => {
    const t = fmt.format(new Date());
    els.forEach(el => el.textContent = t);
  };
  tick();
  setInterval(tick, 1000);
})();

/* ============================================================
   Active nav highlight (kept — simpler version, no IntersectionObserver)
   Sliding indicator + aria-current on the link whose target is in view.
   ============================================================ */
(function activeNav(){
  const links = $$('#site-nav a[href^="#"]');
  if (!links.length) return;
  const indicator = $('#site-nav .indicator');
  const map = new Map();
  links.forEach(a => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) map.set(el, a);
  });
  const setIndicator = (a) => {
    if (!a || !indicator) return;
    const r = a.getBoundingClientRect();
    const pr = a.parentElement.getBoundingClientRect();
    indicator.style.left  = (r.left - pr.left) + 'px';
    indicator.style.width = r.width + 'px';
  };
  const io = new IntersectionObserver(entries => {
    let active = null;
    entries.forEach(e => {
      if (e.isIntersecting && map.has(e.target)) active = map.get(e.target);
    });
    if (active){
      links.forEach(l => l.removeAttribute('aria-current'));
      active.setAttribute('aria-current', 'true');
      setIndicator(active);
    }
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
  map.forEach((_, el) => io.observe(el));

  // initial position
  const current = links.find(a => a.getAttribute('aria-current') === 'true') || links[0];
  if (current) requestAnimationFrame(() => setIndicator(current));
  window.addEventListener('resize', () => {
    const cur = $('#site-nav a[aria-current="true"]');
    if (cur) setIndicator(cur);
  });
})();

/* ============================================================
   Mobile nav — kept from before, slightly hardened
   ============================================================ */
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

/* ============================================================
   Top bar scrolled state
   ============================================================ */
(function topbarScroll(){
  const bar = $('.topbar');
  if (!bar) return;
  const onScroll = () => bar.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ============================================================
   Work filter + Grid/Index switch — same-document View Transitions.
   Filter state is reflected in the URL (?filter=ai, ?view=index).
   ============================================================ */
(function workFilter(){
  const root = $('[data-work]');
  if (!root) return;
  const cards = $$('[data-card]', root);
  const filters = $$('[data-filter]', root);
  const views   = $$('[data-view]', root);

  const apply = (filter, view, animate = true) => {
    cards.forEach(c => {
      const tags = (c.getAttribute('data-tags') || '').split(',').map(t => t.trim()).filter(Boolean);
      const match = filter === 'all' || tags.includes(filter);
      c.hidden = !match;
      if (view === 'index') c.classList.add('is-index');
      else c.classList.remove('is-index');
    });
    filters.forEach(b => b.classList.toggle('is-active', b.getAttribute('data-filter') === filter));
    views.forEach(b   => b.classList.toggle('is-active', b.getAttribute('data-view')    === view));
    const url = new URL(window.location.href);
    if (filter === 'all') url.searchParams.delete('filter'); else url.searchParams.set('filter', filter);
    if (view    === 'grid') url.searchParams.delete('view');  else url.searchParams.set('view', view);
    history.replaceState(null, '', url);
  };

  const initial = {
    filter: new URL(window.location.href).searchParams.get('filter') || 'all',
    view:   new URL(window.location.href).searchParams.get('view')   || 'grid'
  };
  apply(initial.filter, initial.view, false);

  const transition = (fn) => {
    if (reduceMotion || !document.startViewTransition) { fn(); return; }
    document.startViewTransition(() => new Promise(r => { fn(); requestAnimationFrame(r); }));
  };

  filters.forEach(b => b.addEventListener('click', () => {
    transition(() => apply(b.getAttribute('data-filter'), $('[data-view].is-active', root)?.getAttribute('data-view') || 'grid'));
  }));
  views.forEach(b => b.addEventListener('click', () => {
    transition(() => apply($('[data-filter].is-active', root)?.getAttribute('data-filter') || 'all', b.getAttribute('data-view')));
  }));
})();

/* ============================================================
   Skill evidence — Popover API + fallback to click-to-toggle.
   "Show these in Work" scrolls to #work and highlights matches.
   ============================================================ */
(function evidence(){
  const chips = $$('[data-evidence]');
  if (!chips.length) return;
  chips.forEach(chip => {
    const popId = `pop-${chip.id || chip.textContent.trim().toLowerCase().replace(/\s+/g, '-')}`;
    let pop = document.getElementById(popId);
    if (!pop){
      // Create on demand from the data
      pop = document.createElement('div');
      pop.id = popId;
      pop.className = 'evidence-pop';
      pop.setAttribute('popover', 'auto');
      const projects = (chip.getAttribute('data-evidence') || '').split('|').filter(Boolean);
      pop.innerHTML = `
        <h4>Used in ${chip.textContent.trim()}</h4>
        <ul>${projects.map(p => {
          const [name, year] = p.split(':');
          return `<li><span>${name}</span><span class="label">${year || ''}</span></li>`;
        }).join('')}</ul>
        <button type="button" class="btn btn--ghost btn--sm" data-trace="${projects.map(p => p.split(':')[0]).join(',')}">Show these in Work</button>
      `;
      document.body.appendChild(pop);
    }
    chip.setAttribute('popovertarget', popId);
    chip.setAttribute('popoveraction', 'toggle');
    if (typeof chip.togglePopover === 'function' && typeof pop.showPopover === 'function'){
      chip.addEventListener('click', (e) => { e.preventDefault(); pop.togglePopover({ source: chip }); });
    }
    pop.addEventListener('click', e => {
      const t = e.target.closest('[data-trace]');
      if (!t) return;
      const targets = t.getAttribute('data-trace').split(',').filter(Boolean);
      // hide popover if open
      if (pop.matches(':popover-open')) pop.hidePopover();
      // scroll to #work
      const work = document.getElementById('work');
      if (work) work.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      // highlight
      targets.forEach(name => {
        const cards = $$(`[data-card-name="${name}"]`);
        cards.forEach(c => {
          c.classList.add('is-traced');
          setTimeout(() => c.classList.remove('is-traced'), 2400);
        });
      });
    });
  });
})();

/* ============================================================
   AIUB Notice Bot pipeline — packet animation + Pause/Replay + roving-tabindex.
   ============================================================ */
(function pipeline(){
  const root = $('[data-pipeline]');
  if (!root) return;
  const steps = $$('.step', root);
  const packet = $('[data-packet]', root);
  const playBtn = $('[data-pipeline-play]', root);
  if (!steps.length || !packet) return;

  let running = true;
  let cycle = 0;
  let phase = -1;
  const stepW = 100 / steps.length;

  const setStep = (i) => {
    steps.forEach((s, idx) => {
      s.classList.toggle('is-active', idx === i);
      s.setAttribute('tabindex', idx === i ? '0' : '-1');
    });
  };

  const animate = (t) => {
    if (!running) return;
    const total = 8000; // 8s per cycle (2 cycles = 16s)
    const phaseT = (t % total) / total; // 0..1
    const two = phaseT * steps.length * 2; // 0..10
    const idx = Math.min(Math.floor(two), steps.length * 2 - 1);
    const within = (two - Math.floor(two));
    const realStep = idx % steps.length;
    setStep(realStep);
    const pct = (realStep + within) * stepW;
    packet.style.left = pct + '%';
    packet.style.width = stepW + '%';
    requestAnimationFrame(animate);
  };
  if (!reduceMotion) requestAnimationFrame(animate);
  else { setStep(0); packet.style.left = '0%'; packet.style.width = stepW + '%'; }

  if (playBtn){
    playBtn.addEventListener('click', () => {
      running = !running;
      playBtn.textContent = running ? 'Pause' : 'Replay';
      if (running){
        if (reduceMotion){ setStep(0); packet.style.left='0%'; packet.style.width=stepW+'%'; }
        else requestAnimationFrame(animate);
      }
    });
  }

  // roving tabindex
  steps.forEach((s, i) => {
    s.tabIndex = i === 0 ? 0 : -1;
    s.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown'){
        e.preventDefault();
        const next = steps[(i + 1) % steps.length];
        next.focus(); next.tabIndex = 0; s.tabIndex = -1;
        next.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp'){
        e.preventDefault();
        const prev = steps[(i - 1 + steps.length) % steps.length];
        prev.focus(); prev.tabIndex = 0; s.tabIndex = -1;
        prev.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    });
  });
})();

/* ============================================================
   Ledger provenance — fetch live counts; if a fetch fails, keep
   the fallback number in HTML and mark "cached".
   ============================================================ */
(async function platformStats(){
  async function setLive(platform, text, label){
    const card = document.querySelector(`.ps-card[data-platform="${platform}"]`);
    if (!card) return;
    const numEl = card.querySelector('.ps-stat-num');
    const labEl = card.querySelector('.ps-stat-label');
    const srcEl = card.querySelector('[data-src]');
    if (!numEl) return;
    numEl.textContent = text;
    if (label && labEl) labEl.textContent = label;
    if (srcEl){ srcEl.textContent = 'live · ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }
  }
  async function markCached(platform){
    const card = document.querySelector(`.ps-card[data-platform="${platform}"]`);
    const srcEl = card && card.querySelector('[data-src]');
    if (srcEl) srcEl.textContent = 'cached';
  }
  async function fetchWithTimeout(url, ms){
    const ctrl = new AbortController();
    const tid = setTimeout(() => ctrl.abort(), ms);
    try { const r = await fetch(url, { signal: ctrl.signal }); clearTimeout(tid); return r; }
    catch (e){ clearTimeout(tid); throw e; }
  }

  // Only run if any ledger card is present
  if (!$('.ps-card[data-platform]')) return;

  // LeetCode
  (async () => {
    try {
      const r = await fetchWithTimeout('https://alfa-leetcode-api.onrender.com/RedApple47/solved', 8000);
      if (!r.ok) return markCached('leetcode');
      const d = await r.json();
      if (typeof d.solvedProblem === 'number') await setLive('leetcode', d.solvedProblem.toLocaleString(), 'solved');
      else markCached('leetcode');
    } catch { markCached('leetcode'); }
  })();

  // Codeforces
  (async () => {
    try {
      const r = await fetchWithTimeout(
        'https://codeforces.com/api/user.status?handle=SIAM001&from=1&count=10000', 15000
      );
      if (!r.ok) return markCached('codeforces');
      const d = await r.json();
      if (d.status !== 'OK') return markCached('codeforces');
      const seen = new Set();
      for (const s of d.result){
        if (s.verdict === 'OK'){
          seen.add(`${s.problem.contestId ?? s.problem.name}_${s.problem.index}`);
        }
      }
      if (seen.size > 0) await setLive('codeforces', seen.size.toLocaleString(), 'solved');
      else markCached('codeforces');
    } catch { markCached('codeforces'); }
  })();

  // HackerRank
  (async () => {
    try {
      const ep = 'https://www.hackerrank.com/rest/hackers/BaBaYaGa_A1/badges';
      const r = await fetchWithTimeout('https://corsproxy.io/?url=' + encodeURIComponent(ep), 9000);
      if (!r.ok) return markCached('hackerrank');
      const d = await r.json();
      if (!d || !Array.isArray(d.models)) return markCached('hackerrank');
      const total = d.models.reduce((s, b) => s + (Number(b.solved) || 0), 0);
      if (total > 0) await setLive('hackerrank', total.toLocaleString(), 'solved');
      else markCached('hackerrank');
    } catch { markCached('hackerrank'); }
  })();
})();

/* ============================================================
   Gallery engine — filmstrip, prev/next, ←/→, scroll-snap swipe.
   Each [data-gallery] has an array of images in data-gallery.
   ============================================================ */
(function galleries(){
  $$('[data-gallery]').forEach(g => {
    const strip = g.querySelector('.strip');
    const prev = g.querySelector('[data-prev]');
    const next = g.querySelector('[data-next]');
    const counter = g.querySelector('[data-counter]');
    const frames = $$('.frame', strip);
    if (!frames.length) return;

    let i = 0;
    const update = () => {
      frames.forEach((f, idx) => f.setAttribute('aria-current', idx === i ? 'true' : 'false'));
      const target = frames[i];
      if (target) target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', inline: 'center', block: 'nearest' });
      if (prev) prev.disabled = i === 0;
      if (next) next.disabled = i === frames.length - 1;
      if (counter) counter.textContent = `${i + 1} / ${frames.length}`;
    };
    if (prev) prev.addEventListener('click', () => { if (i > 0){ i--; update(); } });
    if (next) next.addEventListener('click', () => { if (i < frames.length - 1){ i++; update(); } });
    g.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight'){ if (i < frames.length - 1){ i++; update(); } }
      else if (e.key === 'ArrowLeft'){ if (i > 0){ i--; update(); } }
    });
    // tap on a frame → focus it
    frames.forEach((f, idx) => {
      f.setAttribute('role', 'button');
      f.tabIndex = 0;
      f.addEventListener('click', () => { i = idx; update(); });
    });
    update();
  });
})();

/* ============================================================
   Cross-document View Transitions for card → case-study.
   Falls back to normal navigation when unsupported.
   ============================================================ */
(function crossDoc(){
  $$('[data-card]').forEach(card => {
    card.addEventListener('click', (e) => {
      // Let modifier-clicks behave normally
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      const href = card.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || /^https?:/.test(href)) return;
      if (reduceMotion || !document.startViewTransition) return;
      const id = card.getAttribute('data-vt-name') || `vt-${card.getAttribute('data-card-name') || href.replace(/\W+/g, '-')}`;
      card.style.viewTransitionName = id;
      e.preventDefault();
      const next = document.startViewTransition(() => {
        return new Promise(resolve => {
          window.location.href = href;
          // navigation will start; resolve immediately
          setTimeout(resolve, 80);
        });
      });
      next.finished.finally(() => { card.style.viewTransitionName = ''; });
    });
  });
})();

/* ============================================================
   Reveal on scroll — for any [data-reveal] below the fold.
   ============================================================ */
(function reveals(){
  const els = $$('[data-reveal]');
  if (!els.length || reduceMotion) { els.forEach(e => e.classList.add('is-in')); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting){ e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
  els.forEach(e => io.observe(e));
})();

/* ============================================================
   ⌘K command menu
   ============================================================ */
(function cmdk(){
  const dlg = $('dialog.cmdk');
  if (!dlg) return;

  // Build the menu from data-commands on the page, plus a few baked-in commands
  const nav = $$('#site-nav a[href^="#"]').map(a => ({
    label: a.textContent.trim(),
    href: a.getAttribute('href'),
    group: 'Jump to',
    hint: a.getAttribute('href'),
    ic: '→'
  }));
  const cmds = [
    { label: 'Toggle theme',    group: 'Commands', hint: 'theme',     ic: '☀', run: () => $('[data-theme-toggle]')?.click() },
    { label: 'Copy email',      group: 'Commands', hint: 'copy-email', ic: '✉', run: () => $('[data-copy]')?.click() },
    { label: 'Download CV',     group: 'Commands', hint: 'cv',        ic: '↓', run: () => { const a = $('a[href$="Siam-Hossain-CV.pdf"][download]'); if (a) a.click(); } },
    { label: 'Open Codolio',    group: 'External', hint: 'codolio',   ic: '↗', run: () => window.open('https://codolio.com/siamhossain', '_blank', 'noreferrer') }
  ];
  const items = [...nav, ...cmds];

  const render = (q = '') => {
    const ql = q.toLowerCase();
    const filtered = ql ? items.filter(i => i.label.toLowerCase().includes(ql) || i.hint.toLowerCase().includes(ql)) : items;
    const groups = {};
    filtered.forEach(it => { (groups[it.group] = groups[it.group] || []).push(it); });
    const html = Object.entries(groups).map(([g, arr]) => `
      <div class="group">
        <div class="gh">${g}</div>
        ${arr.map((it, i) => `
          <div class="row" data-i="${items.indexOf(it)}">
            <span class="ic">${it.ic}</span>
            <span class="lbl">${it.label}</span>
            <span class="hint">${it.hint}</span>
          </div>
        `).join('')}
      </div>
    `).join('');
    $('[data-results]', dlg).innerHTML = html || '<div class="group"><div class="gh">No matches</div></div>';
    $$('[data-i]', dlg).forEach(row => row.addEventListener('click', () => activate(+row.dataset.i)));
    rows = $$('[data-i]', dlg);
    active = 0; highlight();
  };

  let rows = [];
  let active = 0;
  const highlight = () => rows.forEach((r, i) => r.classList.toggle('is-active', i === active));

  const activate = (idx) => {
    const it = items[idx];
    if (!it) return;
    close();
    if (it.href) {
      if (it.href.startsWith('#')){ const t = document.querySelector(it.href); if (t) t.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); }
      else window.location.href = it.href;
    } else if (it.run) it.run();
  };

  const open  = () => { dlg.showModal(); $('input', dlg).value = ''; render(''); $('input', dlg).focus(); };
  const close = () => dlg.close();

  $$('[data-cmdk-open]').forEach(b => b.addEventListener('click', open));
  dlg.addEventListener('click', e => { if (e.target === dlg) close(); });
  dlg.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown'){ e.preventDefault(); active = (active + 1) % Math.max(rows.length, 1); highlight(); }
    else if (e.key === 'ArrowUp'){ e.preventDefault(); active = (active - 1 + rows.length) % Math.max(rows.length, 1); highlight(); }
    else if (e.key === 'Enter'){ e.preventDefault(); const row = rows[active]; if (row) activate(+row.dataset.i); }
    else if (e.key === 'Escape'){ close(); }
  });
  $('input', dlg).addEventListener('input', e => render(e.target.value));

  // Cmd/Ctrl+K and '/'
  document.addEventListener('keydown', e => {
    const inField = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName);
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'){
      e.preventDefault(); open();
    } else if (e.key === '/' && !inField && !dlg.open){
      e.preventDefault(); open();
    }
  });

  // mark for results region
  if (!$('[data-results]', dlg)){
    const r = document.createElement('div');
    r.className = 'results'; r.setAttribute('data-results', '');
    dlg.insertBefore(r, $('.foot', dlg));
  }
})();

/* ============================================================
   Intro video block — unchanged from before, kept for compat
   ============================================================ */
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
      }
    }, { once: true });
  }

  const restoreOverlay = () => { video.controls = false; overlay.hidden = false; };
  overlay.addEventListener('click', () => {
    overlay.hidden = true;
    video.controls = true;
    video.focus();
    const p = video.play();
    if (p) p.catch(restoreOverlay);
  });
  const source = video.querySelector('source');
  (source || video).addEventListener('error', restoreOverlay);
  video.addEventListener('ended', () => {
    const hadFocus = document.activeElement === video || video.contains(document.activeElement);
    video.controls = false; video.currentTime = 0; overlay.hidden = false;
    if (hadFocus) overlay.focus();
  });
})();
