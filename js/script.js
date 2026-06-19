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
