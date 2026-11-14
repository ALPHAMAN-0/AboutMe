#!/usr/bin/env python3
"""Builds the five case-study pages (pos, automation, ecommerce, ai-dev, websites) on the same design system
as index.html: one shared head, nav and footer, one page body each.

    python3 scripts/build_case_pages.py            # all five
    python3 scripts/build_case_pages.py pos.html   # one

It overwrites those HTML files, so edit the page here (not in the .html) and run it again.
index.html and wpdev.html are written by hand and are not touched."""
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MAIL = "mailto:siam.cse.aiub@gmail.com"
ARROW = '<svg class="m-arrow" viewBox="0 0 12 12" aria-hidden="true"><path class="m-arrow__stem" d="M1 6h8"/><path class="m-arrow__head" d="M4.5 2.5 8 6l-3.5 3.5"/></svg>'

TOKENS = """:root {
  --p-bg: #eef0f3; --p-surface: #e2e5ea; --p-ink: #0b0c0e; --p-muted: #5d6470;
  --p-accent: #1f2de6; --p-accent-ink: #ffffff; --p-action: #1f2de6; --p-action-ink: #ffffff;
  --p-inv-bg: #0b0c0e; --p-inv-surface: #17181a; --p-inv-ink: #eef0f3; --p-inv-muted: #8e8f92;
  --p-inv-accent: #eef0f3; --p-inv-accent-ink: #0b0c0e; --p-inv-action: #eef0f3; --p-inv-action-ink: #0b0c0e;
  --font-display: "Newsreader", Georgia, serif;
  --font-text: "Hanken Grotesk", system-ui, sans-serif;
  --display-weight: 400;
  --display-tracking: -0.018em;
  --display-tracking-xl: -0.025em;
  --ly-scale: 1.06;
}"""

# page CSS shared by the case pages: only what sits inside a visual (screenshots on their grounds, a developing photograph)
SHARED_CSS = """  .shot { display: block; max-width: none; width: 880px; height: auto; border-radius: 12px; border: 1px solid color-mix(in oklab, var(--ink) 12%, transparent); background: #fff; box-shadow: 0 1px 2px rgb(11 12 14 / .06), 0 18px 40px -24px rgb(11 12 14 / .35); }
  .shot--dark { border-color: rgb(255 255 255 / .12); background: #0d1117; }
  .frame--shots, .hero__media.frame--shots { background: var(--p-surface); border: 0; }
  .frame--dark, .hero__media.frame--dark { background: #0d1117; }
  .panel { --ground-bg: var(--p-surface); }
  .develop { margin: 0; border-radius: var(--r-lg); overflow: hidden; height: min(620px, var(--ly-fit, 620px)); }
  .develop > img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: 0 0; }
  @media (max-width: 1023px) { .develop { height: auto; aspect-ratio: 4 / 3; margin-top: var(--s-7); } }
  @media (max-width: 639px) { .shot { width: 620px; } .develop { aspect-ratio: 4 / 5; } }"""


def head(page, title, desc, moments, css, ui=False):
    pre = "".join(f'\n<link rel="modulepreload" href="assets/moments/{m}/moment.js">' for m in moments)
    mo = ""
    if moments:
        mo = ("\n<script>document.documentElement.classList.add('mo-js');setTimeout(()=>document.documentElement.classList.add('mo-safe'),2500)</script>"
              '\n<link rel="modulepreload" href="assets/moments/moments.js">\n<link rel="modulepreload" href="assets/moments/lib.js">' + pre)
    uicss = '\n<link rel="stylesheet" href="assets/ui/base.css">\n<link rel="stylesheet" href="assets/ui/code/fragment.css">' if ui else ""
    url = f"https://alphaman-0.github.io/AboutMe/{page}"
    return f"""<!doctype html>
<html lang="en" data-type="service" data-radius="soft" data-buttons="block" data-motion{page_mode.get(page, '')}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="author" content="Siam Hossain">
<link rel="canonical" href="{url}">
<meta property="og:type" content="article">
<meta property="og:url" content="{url}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="https://alphaman-0.github.io/AboutMe/share.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<meta name="theme-color" content="#eef0f3">
<meta name="site-kind" content="other">
<meta name="page-type" content="service">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400..700&family=Hanken+Grotesk:wght@400..600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/system.css">
<link rel="stylesheet" href="assets/ui/cards.css">
<link rel="stylesheet" href="assets/motion/motion.css">
<link rel="stylesheet" href="assets/backgrounds/backgrounds.css">
<link rel="stylesheet" href="assets/layout/layout.css">
<link rel="stylesheet" href="assets/icons/icon.css">
<style>
{TOKENS}
</style>{uicss}
<script>document.documentElement.classList.add('m-enter');setTimeout(()=>document.documentElement.classList.add('m-enter-done'),700)</script>
<script src="assets/backgrounds/backgrounds.js"></script>{mo}
<!-- page CSS: only inside the visuals -->
<style>
{SHARED_CSS}
{css}
</style>
</head>
"""


NAV = f"""<header class="nav">
  <div class="wrap nav__bar">
    <a class="skip-link" href="#top">Skip to content</a>
    <a class="nav__logo" href="index.html"><span class="mark" data-mark="ring" aria-hidden="true"></span>Siam Hossain</a>
    <nav class="nav__links" aria-label="Main">
      <div class="nav__item">
        <a class="nav__link" href="index.html#clients" aria-current="page">Work <svg class="chev" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5l3 3 3-3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
        <div class="nav__menu">
          <div class="wrap grid">
            <div class="menu-col span-3">
              <p class="t-label">On the home page</p>
              <a href="index.html#clients">Client work<span>A POS and two business tools</span></a>
              <a href="index.html#projects">Personal products<span>Résumé builder and a storefront</span></a>
              <a href="index.html#repos">Repositories<span>Eight of 100 on GitHub</span></a>
            </div>
            <div class="menu-col span-3">
              <p class="t-label">Case studies</p>
              <a href="pos.html">Pharmacy POS<span>Billing, stock and staff logins</span></a>
              <a href="automation.html">Notice and mail bots<span>Python, cron and Telegram</span></a>
              <a href="ai-dev.html">AI tools<span>Résumé scoring and agents</span></a>
            </div>
            <div class="menu-col span-3">
              <p class="t-label">More</p>
              <a href="ecommerce.html">Storefronts<span>MegaBazar and ShoeVista</span></a>
              <a href="websites.html">Business tools<span>Stock audit and invoices</span></a>
              <a href="wpdev.html">Scroll animation<span>52 frames on a canvas</span></a>
            </div>
            <a class="menu-card span-3" href="pos.html">
              <div class="panel"><img class="frame__img" src="images/pos-dashboard-640.png" alt="The Nasema Pharmacy POS dashboard with sales and stock figures" width="640" height="404" loading="lazy"></div>
              <span class="t-card">Pharmacy POS case study</span>
              <span class="t-small muted">How the counter software works</span>
            </a>
          </div>
        </div>
      </div>
      <div class="nav__item"><a class="nav__link" href="index.html#automation">Automation</a></div>
      <div class="nav__item"><a class="nav__link" href="index.html#stack">Stack</a></div>
      <div class="nav__item"><a class="nav__link" href="index.html#about">About</a></div>
    </nav>
    <div class="nav__actions">
      <a class="nav__link" href="Siam-Hossain-CV.pdf" download>Download CV</a>
      <a class="btn btn--primary" href="{MAIL}">Email Siam</a>
    </div>
    <button class="nav__toggle" type="button" aria-expanded="false" aria-label="Menu">
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 5h14M2 13h14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
    </button>
  </div>
</header>
"""


def footer(h2, line):
    return f"""<footer class="footer closing footer--dark ground-inverse g2m" id="contact" aria-labelledby="close-h">
  <div class="wrap">
    <div class="closing__cta close--type">
      <div class="section-head">
        <h2 id="close-h">{h2}</h2>
        <p>{line}</p>
      </div>
      <a class="btn btn--primary btn--xl btn--wide" href="{MAIL}">Email Siam{ARROW}</a>
    </div>
    <div class="closing__links">
      <div class="grid">
        <div class="span-4 stack-4">
          <a class="nav__logo footer__mark" href="index.html"><span class="mark" data-mark="ring" aria-hidden="true"></span>Siam Hossain</a>
          <p class="footer__lede">Full-stack and AI engineer in Dhaka.</p>
        </div>
        <div class="span-2 footer__col"><h3>Work</h3><ul><li><a href="index.html#clients">Client work</a></li><li><a href="index.html#projects">Products</a></li><li><a href="index.html#automation">Automation</a></li><li><a href="index.html#repos">Repositories</a></li></ul></div>
        <div class="span-2 footer__col"><h3>Case studies</h3><ul><li><a href="pos.html">Pharmacy POS</a></li><li><a href="automation.html">Bots</a></li><li><a href="ai-dev.html">AI tools</a></li><li><a href="ecommerce.html">Storefronts</a></li><li><a href="websites.html">Business tools</a></li></ul></div>
        <div class="span-2 footer__col"><h3>Profiles</h3><ul><li><a href="https://github.com/ALPHAMAN-0" target="_blank" rel="noopener">GitHub</a></li><li><a href="https://www.linkedin.com/in/siamhossain4/" target="_blank" rel="noopener">LinkedIn</a></li><li><a href="https://leetcode.com/u/RedApple47/" target="_blank" rel="noopener">LeetCode</a></li><li><a href="https://codeforces.com/profile/SIAM001" target="_blank" rel="noopener">Codeforces</a></li></ul></div>
        <div class="span-2 footer__col"><h3>Contact</h3><ul><li><a href="Siam-Hossain-CV.pdf" download>Download CV</a></li><li><a href="index.html#about">About</a></li><li><a href="https://codolio.com/profile/babaYagaa" target="_blank" rel="noopener">Codolio</a></li></ul></div>
      </div>
      <div class="footer__legal">
        <span>&copy; 2026 Siam Hossain. Product names and logos are trademarks of their owners.</span>
      </div>
    </div>
  </div>
</footer>
"""


SCRIPTS = """
<script type="module" src="assets/system.js"></script>
<script type="module" src="assets/motion/motion.js"></script>
<script type="module" src="assets/layout/layout.js"></script>
</body>
</html>
"""


def hero_split(kicker, h1, lead, second, media, dark=False, width=880, ax=48):
    href, label, ext = second
    target = ' target="_blank" rel="noopener"' if ext else ''
    src, alt, w, h, subject = media
    tone = 'frame--dark' if dark else 'frame--shots'
    shot = 'shot shot--dark' if dark else 'shot'
    return f"""  <section class="hero hero--split" data-enter aria-labelledby="hero-h">
    <div class="wrap"><div class="hero-text grid hero__grid">
      <div class="hero__text span-5">
        <p class="hero__kicker"><span class="dot" aria-hidden="true"></span>{kicker}</p>
        <h1 id="hero-h">{h1}</h1>
        <p class="hero__lead">{lead}</p>
        <div class="btn-row">
          <a class="btn btn--primary" href="{MAIL}">Email Siam{ARROW}</a>
          <a class="btn btn--secondary" href="{href}"{target}>{label}</a>
        </div>
      </div>
      <div class="hero__media {tone} span-6 start-7" data-enter-media>
        <div class="stage stage--fade-br">
          <div class="at-corner" style="--ax: {ax}px; --ay: {ax}px"><img class="{shot}" style="width: {width}px" src="{src}" alt="{alt}" width="{w}" height="{h}" fetchpriority="high" data-source="client" data-subject="{subject}"></div>
        </div>
      </div>
    </div></div>
  </section>
"""


def rows(items):
    out = []
    for name, line, value in items:
        v = f'<span class="rows__value">{value}</span>' if value else ''
        out.append(f'          <li><span class="rows__name">{name}</span><p>{line}</p>{v}</li>')
    return "\n".join(out)


def shot_frame(src, alt, w, h, subject, href=None, label=None, dark=False, width=880, ax=48, extra=''):
    tone = 'frame--dark' if dark else 'frame--shots'
    shot = 'shot shot--dark' if dark else 'shot'
    tag, attrs = ('a', f' href="{href}" aria-label="{label}"' + (' target="_blank" rel="noopener"' if href.startswith('http') else '')) if href else ('div', '')
    zoom = ' m-zoom' if href else ''
    return f"""      <{tag} class="frame{zoom} frame--split {tone} span-6 start-7{extra}"{attrs}>
        <div class="stage stage--fade-br">
          <div class="at-corner" style="--ax: {ax}px; --ay: {ax}px"><img class="{shot}" style="width: {width}px" src="{src}" alt="{alt}" width="{w}" height="{h}" loading="lazy" data-source="client" data-subject="{subject}"></div>
        </div>
      </{tag}>
"""


def card(title, line, src, alt, w, h, subject, width=760, link=None):
    lk = ''
    if link:
        href, label = link
        t = ' target="_blank" rel="noopener"' if href.startswith('http') else ''
        lk = f'\n          <a class="card__link" href="{href}"{t}>{label}</a>'
    nolift = '' if link else ' m-nolift'
    return f"""        <article class="card card--row{nolift} span-6">
          <h3>{title}</h3>
          <p>{line}</p>{lk}
          <div class="panel">
            <div class="stage stage--fade-br">
              <div class="at-corner" style="--ax: 32px; --ay: 32px"><img class="shot" style="width: {width}px" src="{src}" alt="{alt}" width="{w}" height="{h}" loading="lazy" data-source="client" data-subject="{subject}"></div>
            </div>
          </div>
        </article>"""


page_mode = {"websites.html": ' data-page-mode="short"'}

PAGES = {}

# ------------------------------------------------------------------ pos.html
PAGES["pos.html"] = dict(
    title="Pharmacy POS for Nasema Pharmacy: a case study by Siam Hossain",
    desc="How the Nasema Pharmacy point-of-sale system works: billing, stock by batch and expiry, invoices, reports and staff logins, built on Node.js and MongoDB.",
    moments=["pinned-chapters"],
    css="""  #records .panel { --p-h: 340px; }
  /* phone: the two cards fill their two screens, each screenshot cut by its panel's foot */
  @media (max-width: 639px) {
    #records .panel { --p-h: 540px; }
    #records .shot { width: 900px !important; }
    #records .at-corner { --ax-sm: -250px; }
    #flow.section { min-height: calc(2 * 100vh); min-height: calc(2 * 100lvh); }
    #flow .mo-pc__visual > img { aspect-ratio: 3 / 2 !important; max-height: none !important; object-position: 0 0; }
  }""",
    body=hero_split(
        "Client project · in daily use at the counter",
        "Pharmacy POS for Nasema Pharmacy",
        "Billing, stock, prescriptions, invoices and reports in one web app, with a login for each kind of staff. I built it on Node.js and MongoDB for a pharmacy counter in Bangladesh.",
        ("#flow", "See how a sale works", False),
        ("parmacyShop/02-dashboard.png", "The POS dashboard: today’s sales, stock alerts and recent invoices", 1380, 872, "Nasema Pharmacy POS dashboard"),
    ) + """
  <section class="section" id="flow" style="--h: 2" data-moment="pinned-chapters" aria-labelledby="flow-h">
    <div class="wrap mo-pc__grid">
      <div class="mo-pc__text">
        <h2 id="flow-h">How a sale moves through the POS</h2>
        <ol class="mo-pc__steps">
          <li class="mo-pc__step">
            <h3>The sale at the counter</h3>
            <p>Search by brand, generic name or barcode, build the cart, then take cash, bKash, Nagad or card.</p>
            <figure class="mo-pc__visual"><img src="parmacyShop/sized/03-pos-900.png" srcset="parmacyShop/sized/03-pos-640.png 640w, parmacyShop/sized/03-pos-900.png 900w" sizes="(max-width: 639px) 342px, 628px" alt="The sell screen: medicines with price and stock, the cart, and four ways to pay" width="900" height="569" loading="lazy" data-source="client" data-subject="POS sell screen"></figure>
          </li>
          <li class="mo-pc__step">
            <h3>Stock by batch and expiry</h3>
            <p>Every batch carries its expiry date. Stock near it turns amber, stock past it turns red.</p>
            <figure class="mo-pc__visual"><img src="parmacyShop/sized/05-inventory-900.png" srcset="parmacyShop/sized/05-inventory-640.png 640w, parmacyShop/sized/05-inventory-900.png 900w" sizes="(max-width: 639px) 342px, 628px" alt="The inventory list by batch, with expiry dates marked in amber and red" width="900" height="569" loading="lazy" data-source="client" data-subject="POS inventory"></figure>
          </li>
          <li class="mo-pc__step">
            <h3>An invoice for every sale</h3>
            <p>Each sale gets a numbered invoice with its payment method, and a refund stays on the record.</p>
            <figure class="mo-pc__visual"><img src="parmacyShop/sized/07-invoices-900.png" srcset="parmacyShop/sized/07-invoices-640.png 640w, parmacyShop/sized/07-invoices-900.png 900w" sizes="(max-width: 639px) 342px, 628px" alt="The invoice list with numbers, dates, payment methods and totals" width="900" height="569" loading="lazy" data-source="client" data-subject="POS invoices"></figure>
          </li>
          <li class="mo-pc__step">
            <h3>Reports by date</h3>
            <p>Sales, expiry, stock value and regulatory reports for any range of days.</p>
            <figure class="mo-pc__visual"><img src="parmacyShop/sized/09-reports-900.png" srcset="parmacyShop/sized/09-reports-640.png 640w, parmacyShop/sized/09-reports-900.png 900w" sizes="(max-width: 639px) 342px, 628px" alt="The sales report: revenue, orders, average basket, sales by category and best sellers" width="900" height="569" loading="lazy" data-source="client" data-subject="POS reports"></figure>
          </li>
        </ol>
      </div>
      <div class="mo-pc__visuals frame"></div>
    </div>
  </section>

  <section class="section" id="records" aria-labelledby="records-h" style="--h: 1; --hm: 2">
    <div class="wrap">
      <div class="section-head">
        <h2 id="records-h">Medicine records and printed receipts</h2>
      </div>
      <div class="grid">
""" + card("A record for every medicine", "Brand, generic name, strength, pack size, rack, cost and sale price, a low-stock level and an Rx flag.",
           "parmacyShop/12-medicine-edit.png", "The edit form for one medicine, with its prices, low-stock level and prescription flag", 1380, 872, "POS medicine record") + "\n" + card(
           "A receipt with the licence number", "Receipts print the pharmacy’s drug licence number, the items, the payment method and the owner’s footer line.",
           "parmacyShop/13-invoice.png", "One invoice on screen beside its printed receipt", 1380, 872, "POS receipt") + """
      </div>
    </div>
  </section>

  <section class="section g2m" id="build" aria-labelledby="build-h">
    <div class="wrap grid grid--top">
      <div class="span-5 stack-5">
        <div class="section-head">
          <h2 id="build-h">What runs underneath the POS</h2>
          <p>The owner sets the expiry alert window, the tax rate and the receipt footer from a settings page.</p>
        </div>
        <ul class="rows">
""" + rows([
        ("Node.js and MongoDB", "The API and the data behind billing, stock, invoices and reports", "Backend"),
        ("Staff logins", "Separate logins for admin, pharmacist, support and inventory staff", "Roles"),
        ("Audit log", "A page that records every change, for regulatory checks", "Log"),
    ]) + """
        </ul>
        <p><a class="link" href="index.html#clients">See all my client work</a></p>
      </div>
""" + shot_frame("parmacyShop/11-settings.png", "The settings page: pharmacy profile, currency, tax, expiry alert window and receipt footer", 1380, 872, "POS settings", width=1060, ax=56) + """    </div>
  </section>
""",
    close=("Email me about a system like this", "I build and deploy business software for shops and clinics, from the database to the counter."),
    category="pharmacy point-of-sale software: sale, stock, batch, expiry, invoice, receipt, reports, medicine records",
)

# ------------------------------------------------------------------ automation.html
CRON = """<div class="ui ui-panel ui-code" data-ui="code">
                  <div class="ui-code__tabs">
                    <span class="ui-code__tab is-on"><i class="ui-code__lang">YML</i>check-notices.yml</span>
                    <span class="ui-spacer"></span>
                    <span class="ui-chip ui-chip--plain ui-code__chip" data-code-chip>cron</span>
                  </div>
                  <pre class="ui-code__pre"><code><span class="ui-code__ln" data-n="6"><span class="k">on</span>:</span>
<span class="ui-code__ln" data-n="7">  <span class="k">schedule</span>:</span>
<span class="ui-code__ln is-mark" data-n="8">    - <span class="k">cron</span>: '0 3 * * *'  <span class="c"># 09:00 Dhaka</span></span>
<span class="ui-code__ln" data-n="9">    - <span class="k">cron</span>: '0 7 * * *'  <span class="c"># 13:00 Dhaka</span></span>
<span class="ui-code__ln" data-n="10">    - <span class="k">cron</span>: '0 11 * * *' <span class="c"># 17:00 Dhaka</span></span>
<span class="ui-code__ln" data-n="11">    - <span class="k">cron</span>: '0 15 * * *' <span class="c"># 21:00 Dhaka</span></span></code></pre>
                  <div class="ui-code__hint" data-code-hint><span class="ui-dot"></span><span data-code-text>GitHub cron runs in UTC: each Dhaka time is written 6 hours earlier.</span></div>
                </div>"""
CONC = """<div class="ui ui-panel ui-code" data-ui="code">
                  <div class="ui-code__tabs">
                    <span class="ui-code__tab is-on"><i class="ui-code__lang">YML</i>check-notices.yml</span>
                    <span class="ui-spacer"></span>
                    <span class="ui-chip ui-chip--plain ui-code__chip" data-code-chip>1 run</span>
                  </div>
                  <pre class="ui-code__pre"><code><span class="ui-code__ln" data-n="26"><span class="k">permissions</span>:</span>
<span class="ui-code__ln" data-n="27">  <span class="k">contents</span>: write</span>
<span class="ui-code__ln" data-n="28">  <span class="k">models</span>: read</span>
<span class="ui-code__ln" data-n="29"></span>
<span class="ui-code__ln" data-n="30"><span class="c"># Never let two runs overlap</span></span>
<span class="ui-code__ln" data-n="31"><span class="k">concurrency</span>:</span>
<span class="ui-code__ln" data-n="32">  <span class="k">group</span>: ${{ github.workflow }}</span>
<span class="ui-code__ln is-mark" data-n="33">  <span class="k">cancel-in-progress</span>: false</span></code></pre>
                  <div class="ui-code__hint" data-code-hint><span class="ui-dot"></span><span data-code-text>A second run waits in line behind the first.</span></div>
                </div>"""


def code_card(title, line, frag):
    return f"""        <article class="card card--row card--open m-nolift span-6">
          <h3>{title}</h3>
          <p>{line}</p>
          <div class="panel">
            <div class="stage stage--fade-b">
              <div class="at-rise fit" style="--fit-max: 520px; --ax: max(24px, 50% - 260px); --ay: 40px">
                {frag}
              </div>
            </div>
          </div>
        </article>"""


PAGES["automation.html"] = dict(
    title="AIUB Notice Bot and Email Trucker: two Telegram bots by Siam Hossain",
    desc="Two Telegram bots that run on GitHub Actions for $0 a month: AIUB Notice Bot sorts and sums up new university notices, Email Trucker sends a digest of new Gmail.",
    moments=["picture-develops"],
    ui=True,
    css="""  #schedule .panel { --p-h: 330px; }
  #schedule .ui-code__ln { white-space: pre-wrap; }
  #faq .ic-row-tools { display: flex; gap: var(--s-3); }
  /* tablet: the cards stand side by side, their editor panes run down the section */
  @media (min-width: 640px) and (max-width: 1023px) {
    #schedule .grid { flex: 1 1 auto; grid-template-rows: minmax(0, 1fr); }
    #schedule .card { display: flex; flex-direction: column; }
    #schedule .card > .panel { flex: 1 1 auto; height: auto; }
    #schedule .ui-code { min-height: 560px; display: flex; flex-direction: column; }
    #schedule .ui-code__pre { flex: 1 1 auto; }
  }
  /* phone: each two-screen section fills both screens */
  @media (max-width: 639px) {
    #schedule .ui-code__ln { padding-left: 40px; }
    #notice-bot .develop { aspect-ratio: auto; height: auto; min-height: 420px; align-self: stretch; margin-top: 0; }
    #schedule .grid { flex: 1 1 auto; grid-template-rows: auto minmax(0, 1fr); }
    #schedule .card:last-child { display: flex; flex-direction: column; }
    #schedule .card:last-child > .panel { flex: 1 1 auto; height: auto; }
    #schedule .card:last-child .stage > .at-rise { bottom: 24px; }
    #schedule .card:last-child .ui-code { height: 100%; display: flex; flex-direction: column; }
    #schedule .card:last-child .ui-code__pre { flex: 1 1 auto; }
    #faq .faq { display: flex; flex-direction: column; justify-content: space-between; align-self: stretch; }
  }""",
    body=hero_split(
        "2 bots · $0 a month · no server",
        "Two Telegram bots on GitHub Actions",
        "AIUB Notice Bot posts each new university notice, sorted and summed up in one line. Email Trucker sends a digest of new Gmail. Both run on a schedule, with no server or database.",
        ("#notice-bot", "See the notice bot", False),
        ("images/notice-bot-readme.png", "The bot’s README with an example Telegram message for an exam seat plan notice", 900, 760, "AIUB Notice Bot README"),
        dark=True, width=900, ax=48,
    ) + """
  <section class="section g2m" id="notice-bot" aria-labelledby="notice-bot-h">
    <div class="wrap grid grid--top">
      <div class="span-5 stack-5">
        <div class="section-head">
          <h2 id="notice-bot-h">AIUB Notice Bot, 4 steps a run</h2>
          <p>Each run takes seconds on a fresh GitHub runner.</p>
        </div>
        <ul class="rows">
""" + rows([
        ("Scrape", "Reads the notices list on AIUB’s site with BeautifulSoup", "scraper.py"),
        ("Skip what was seen", "Checks each notice against seen.json, so nothing is sent twice", "seen.json"),
        ("Classify", "GitHub Models picks 1 of 8 categories and writes a one-line summary", "classifier.py"),
        ("Notify and save", "Sends one Telegram message per notice, then commits its state", "notifier.py"),
    ]) + """
        </ul>
        <p><a class="link" href="https://github.com/ALPHAMAN-0/AIUB_NOTICE_BOARD" target="_blank" rel="noopener">Read the code on GitHub</a></p>
      </div>
      <figure class="develop frame--dark span-6 start-7" data-moment="picture-develops"><img src="images/notice-bot-runs.png" alt="GitHub Actions history for the notice bot: 592 scheduled runs, each passed, most in under 20 seconds" width="1080" height="620" loading="lazy" data-source="client" data-subject="AIUB Notice Bot runs"></figure>
    </div>
  </section>

  <section class="section ground-surface" id="schedule" aria-labelledby="schedule-h" style="--h: 1; --hm: 2">
    <div class="wrap">
      <div class="section-head">
        <h2 id="schedule-h">4 scheduled runs a day, never 2 at once</h2>
      </div>
      <div class="grid">
""" + code_card("Runs at 09:00, 13:00, 17:00 and 21:00", "The workflow’s cron lines, with the Dhaka time beside each one.", CRON) + "\n" + code_card(
        "Queues runs behind one in progress", "A concurrency group stops two runs from racing on the saved state.", CONC) + """
      </div>
    </div>
  </section>

  <section class="section g2m" id="faq" aria-labelledby="faq-h">
    <div class="wrap grid grid--top">
      <div class="span-5 stack-5">
        <div class="section-head">
          <h2 id="faq-h">Questions about the bots</h2>
          <p>What happens when a site changes, a run fails or the inbox is busy.</p>
        </div>
        <div class="ic-row-tools" aria-label="Built with Python, GitHub Actions, Gmail and Telegram" role="img"><span class="ic-tile ic-tile--40"><img class="ic ic-40" src="assets/icons/python.svg" alt="" width="40" height="40" loading="lazy"></span><span class="ic-tile ic-tile--40"><img class="ic ic-40" src="assets/icons/github-actions.svg" alt="" width="40" height="40" loading="lazy"></span><span class="ic-tile ic-tile--40"><img class="ic ic-40 ic-land" src="assets/icons/gmail.svg" alt="" width="40" height="32" loading="lazy"></span><span class="ic-tile ic-tile--40"><img class="ic ic-40" src="assets/icons/telegram.svg" alt="" width="40" height="40" loading="lazy"></span></div>
        <p><a class="link" href="index.html#automation">See the bots on the home page</a></p>
      </div>
      <div class="faq span-6 start-7">
        <div class="faq__item"><h3>What if AIUB changes its notices page?</h3><p>If a scrape finds no notices, the run stops with an error and keeps the old state, so a new layout cannot wipe the history.</p></div>
        <div class="faq__item"><h3>What if fifty old notices look new?</h3><p>A flood guard sees the burst and records them quietly instead of sending fifty messages.</p></div>
        <div class="faq__item"><h3>Why does each run commit to GitHub?</h3><p>The commit saves seen.json and a heartbeat file. The heartbeat keeps GitHub from turning the schedule off after 60 days.</p></div>
        <div class="faq__item"><h3>Does Email Trucker mark mail as read?</h3><p>No. It opens the inbox read-only over IMAP and checks at 17 minutes past each hour, away from the busy top of the hour.</p></div>
        <div class="faq__item"><h3>What do the bots cost to run?</h3><p>Nothing. Actions minutes are free on a public repository, and about 20 model calls a day fit the free tier of 150.</p></div>
      </div>
    </div>
  </section>
""",
    close=("Email me about automating a job", "Scheduled scrapers, bots and pipelines that run on their own and tell you when they fail."),
    category="automation bots: Telegram, GitHub Actions, notices, scheduled runs, Gmail, questions",
)

# ------------------------------------------------------------------ ecommerce.html
PAGES["ecommerce.html"] = dict(
    title="MegaBazar storefront in Next.js: a case study by Siam Hossain",
    desc="MegaBazar, an online store Siam Hossain built alone in Next.js: category and product pages, search, a cart and a checkout with a test payment screen.",
    moments=["picture-develops"],
    css="""  #pages .panel { --p-h: 300px; }
  @media (max-width: 639px) { #pages .panel { --p-h: 200px; } }""",
    body=hero_split(
        "Personal build · Next.js",
        "MegaBazar, a storefront built in Next.js",
        "Category pages, product pages, search, a cart and a checkout with a test payment screen. I built it alone in my second year at AIUB.",
        ("#pages", "See the store pages", False),
        ("MegaBazar/01-homepage-top.png", "The MegaBazar home page: search bar, category menu and a sale banner", 1440, 900, "MegaBazar home page"),
        width=1180,
    ) + """
  <section class="section g2" id="pages" aria-labelledby="pages-h">
    <div class="wrap">
      <div class="group">
        <div class="section-head">
          <h2 id="pages-h">Four pages of the store</h2>
        </div>
        <div class="grid">
""" + card("Browse a category", "A grid of products for one category, with filters down the side.", "MegaBazar/03-category-electronics.png", "The electronics category page with filters and a grid of products", 1440, 1600, "MegaBazar category page") + "\n" + card(
        "Read a product page", "Photos, price, stock and the add-to-cart button for one product.", "MegaBazar/04-product-detail.png", "A product page with photos, price and the add-to-cart button", 1440, 1500, "MegaBazar product page") + """
        </div>
      </div>
      <div class="grid">
""" + card("Fill the cart", "Change quantities and see the total before you check out.", "MegaBazar/07-cart.png", "The cart with item quantities and the order total", 1440, 1100, "MegaBazar cart") + "\n" + card(
        "Check out", "A shipping address, then cash on delivery, bKash or card.", "MegaBazar/08-checkout.png", "The checkout page with address, delivery options and payment", 1440, 1100, "MegaBazar checkout") + """
      </div>
    </div>
  </section>

  <section class="section" id="lessons" aria-labelledby="lessons-h">
    <div class="wrap grid grid--top">
      <div class="span-5 stack-5">
        <div class="section-head">
          <h2 id="lessons-h">What the store taught me</h2>
          <p>Three notes from building MegaBazar, and the shoe store that came before it.</p>
        </div>
        <ul class="rows">
""" + rows([
        ("Server actions", "For most of this store’s write paths they beat API routes", ""),
        ("Cart state", "It belongs in the URL until checkout", ""),
        ("A test payment screen", "It taught me more about checkout than a real one would have", ""),
        ('<a class="link" href="https://github.com/ALPHAMAN-0/ShoeVista" target="_blank" rel="noopener">ShoeVista</a>', "An earlier multi-vendor shoe store with vendor dashboards", "2023"),
    ]) + """
        </ul>
      </div>
      <figure class="develop span-6 start-7" data-moment="picture-develops"><img src="MegaBazar/06-search.png" alt="Search results on MegaBazar for a query, with filters and product cards" width="1440" height="1400" loading="lazy" data-source="client" data-subject="MegaBazar search"></figure>
    </div>
  </section>
""",
    close=("Email me about an online store", "Catalogues, carts and checkouts, built and deployed end to end."),
    category="online store: storefront, category, product, search, cart, checkout",
)

# ------------------------------------------------------------------ ai-dev.html
PAGES["ai-dev.html"] = dict(
    title="AI résumé builder and AI harness projects by Siam Hossain",
    desc="An AI résumé builder that scores a résumé from 0 to 100 against a job, plus AI harness and LLM projects on GitHub: Sleep Loop, a Claude Code workflow and Gridwise.",
    moments=["word-highlight"],
    css="",
    body=hero_split(
        "Live demo · runs in the browser",
        "AI résumé builder with an ATS score",
        "Scores a résumé from 0 to 100 against a job description, lists the keywords it is missing and drafts a summary with Claude. React, TypeScript and Zustand, with no backend.",
        ("https://alphaman-0.github.io/AI_Resume_Builder/", "Open the live demo", True),
        ("images/ai-resume-builder-preview.png", "The résumé builder: a form, the résumé preview and an ATS score of 98 out of 100", 1440, 900, "AI résumé builder"),
        width=1000,
    ) + """
  <section class="section g2m" id="score" aria-labelledby="score-h">
    <div class="wrap grid grid--top">
      <div class="span-5 stack-5">
        <div class="section-head">
          <h2 id="score-h">How the ATS score adds up to 100</h2>
          <p>A heuristic, as the app itself says: it does not promise that every ATS will parse a résumé the same way.</p>
        </div>
        <ul class="rows">
""" + rows([
        ("Section coverage", "Experience, education, skills and projects are all there", "20"),
        ("Action verbs", "Bullet points start with what you did", "20"),
        ("Quantified results", "Numbers in the bullets, not only duties", "20"),
        ("Contact and keywords", "Contact details, and the job’s keywords found in the text", "15 + 15"),
        ("Format and length", "A length and layout an ATS can read", "10"),
    ]) + """
        </ul>
      </div>
""" + shot_frame("images/ai-resume-score.png", "Part of the résumé preview beside the score panel: 98 out of 100, grade A, with points for each part", 580, 900, "AI résumé builder score",
                 href="https://alphaman-0.github.io/AI_Resume_Builder/", label="Open the résumé builder demo", width=580, ax=24) + """    </div>
  </section>

  <section class="section statement" id="statement" data-moment="word-highlight" aria-label="How I use models">
    <div class="wrap">
      <p class="t-label">How I use models</p>
      <p class="mo-wh__text">I treat a model’s output <strong>as a draft</strong>: Sleep Loop waits for a person to approve before it merges, and Gridwise checks an LLM’s plan against hard limits before a solver runs it.</p>
    </div>
  </section>

  <section class="section g2m" id="agents" aria-labelledby="agents-h">
    <div class="wrap grid grid--top">
      <div class="span-5 stack-5">
        <div class="section-head">
          <h2 id="agents-h">AI harness and LLM projects on GitHub</h2>
          <p>The harness is the part around the model: its loop, tools, memory, checks and the gate a person signs off.</p>
        </div>
        <ul class="rows">
""" + rows([
        ('<a class="link" href="https://github.com/ALPHAMAN-0/Sleep_Loop" target="_blank" rel="noopener">Sleep Loop</a>', "Repairs code overnight with maker and checker agents, memory across failures and a human approval gate", "Python"),
        ('<a class="link" href="https://github.com/ALPHAMAN-0/Gridwise_LLM_Energy_Optimizer" target="_blank" rel="noopener">Gridwise</a>', "Turns an operator’s notes into checked rules, then plans the cheapest day of campus energy", "Python"),
        ('<a class="link" href="https://github.com/ALPHAMAN-0/6_claude_code_Slash" target="_blank" rel="noopener">Claude Code workflow</a>', "A slash command sends a subagent to research, then a skill formats what it found", "Markdown"),
    ]) + """
        </ul>
      </div>
""" + shot_frame("images/sleep-loop-readme.png", "Sleep Loop’s README with its architecture: docs, the loop, memory, target and fleet", 900, 820, "Sleep Loop README",
                 href="https://github.com/ALPHAMAN-0/Sleep_Loop", label="Open Sleep Loop on GitHub", dark=True, width=900, ax=40) + """    </div>
  </section>
""",
    close=("Email me about an AI feature", "LLM features with checks around them: agents, retrieval and model calls that fail safely."),
    category="AI tools: résumé builder, ATS score, agents, AI harness, LLM, models, projects",
)

# ------------------------------------------------------------------ websites.html (the short page: no screenshots, the tools are private)
PAGES["websites.html"] = dict(
    title="Stock audit app and invoice generator: private tools by Siam Hossain",
    desc="Two free web tools Siam Hossain built for local business owners: a stock audit app that writes to Google Sheets, and an invoice generator for several businesses.",
    moments=["word-highlight"],
    css="",
    body=f"""  <section class="hero hero--statement ground-brand" data-enter aria-labelledby="hero-h">
    <div class="wrap"><div class="hero-text hero__in">
      <div>
        <h1 id="hero-h">Stock audit and invoice tools for local businesses</h1>
        <p class="hero__lead">Two free web tools for friends who run shops. Both are live and hold real prices, stock and invoices, so they sit behind a login.</p>
        <div class="btn-row"><a class="btn btn--primary" href="{MAIL}">Email Siam{ARROW}</a><a class="btn btn--secondary" href="#tools">See how they work</a></div>
      </div>
      <dl class="hero__facts">
        <div><dt>Tools</dt><dd>2, both live</dd></div>
        <div><dt>Cost to the owners</dt><dd>Free</dd></div>
        <div><dt>Hosting</dt><dd>Vercel</dd></div>
        <div><dt>Access</dt><dd>Behind a login</dd></div>
      </dl>
    </div></div>
  </section>

  <section class="section statement" id="statement" data-moment="word-highlight" aria-label="Why there is no public link">
    <div class="wrap">
      <p class="t-label">Why there is no public link</p>
      <p class="mo-wh__text">These tools edit a shop’s <strong>real prices and stock</strong>, so this page explains how they work instead of linking to them. Each owner keeps the only login.</p>
    </div>
  </section>

  <section class="section" id="tools" aria-labelledby="tools-h" style="--h: 1; --hm: 2">
    <div class="wrap">
      <div class="section-head">
        <h2 id="tools-h">How the 2 tools work</h2>
        <p>Each one fits a habit the owner already had, so there was nothing new to learn.</p>
      </div>
      <div class="grid grid--top">
        <div class="span-6 stack-4">
          <h3 class="t-card">Stock audit app</h3>
          <p>A friend needed fast stock counts in his shop without paying for inventory software. He already kept everything in a Google Sheet.</p>
          <ul class="rows">
{rows([("Search", "Find a product as you type", ""), ("Price and count", "Set both for each item on the shelf", ""), ("Google Sheets", "Every change writes straight to the owner’s sheet", "Storage")])}
          </ul>
        </div>
        <div class="span-6 start-7 stack-4">
          <h3 class="t-card">Invoice generator</h3>
          <p>Another friend runs several businesses and paid for a separate invoicing tool for each one.</p>
          <ul class="rows">
{rows([("One account", "Invoices for all of his businesses in one place", ""), ("Dashboard", "Create, view and track each invoice", ""), ("No subscription", "Free, with no limit per business", "Free")])}
          </ul>
        </div>
      </div>
    </div>
  </section>
""",
    close=("Email me about a tool for your shop", "Small web tools that fit how a business already works."),
    category="business tools: stock audit app, invoice generator, shop, invoices",
)


def build(name, p):
    html = head(name, p["title"], p["desc"], p["moments"], p["css"], ui=p.get("ui", False))
    html += f"<body>\n<!-- type: service (case study). hero split (statement on the short page), palette cool-grey-cobalt, type newsreader, nav nav-mega, close close-type, footer footer-dark, buttons block, mark ring; moments: {', '.join(p['moments'])} -->\n"
    html += NAV + '\n<main id="top">\n' + p["body"] + "</main>\n\n" + footer(*p["close"]) + SCRIPTS
    with open(os.path.join(ROOT, name), "w") as f:
        f.write(html)
    print("wrote", name)


if __name__ == "__main__":
    import sys
    want = sys.argv[1:] or list(PAGES)
    for n in want:
        build(n, PAGES[n])
