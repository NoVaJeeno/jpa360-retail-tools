/* JPA 360° Sovereign Retail-Rechner Floating Widget (Shadow-DOM isolated, 0 CSS bleed, 0 Cookies) */
(function () {
  if (window.__JPA360_WIDGET_MOUNTED__) return;
  window.__JPA360_WIDGET_MOUNTED__ = true;

  var scriptEl = document.currentScript;
  var pos = (scriptEl && scriptEl.getAttribute('data-position')) || 'left';
  var sideRule = pos === 'right' ? 'right:20px;' : 'left:20px;';
  var srcTag = encodeURIComponent((scriptEl && scriptEl.getAttribute('data-src')) || 'hauptdomain_widget');
  var targetUrl = 'https://rechner.jp-aring-advisory.de/?src=' + srcTag;

  var host = document.createElement('div');
  host.id = 'jpa360-rechner-widget-host';
  host.style.cssText = 'position:fixed;bottom:20px;' + sideRule + 'z-index:2147483000;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text",Inter,Arial,sans-serif;';
  document.body.appendChild(host);

  var shadow = host.attachShadow({ mode: 'open' });
  shadow.innerHTML = [
    '<style>',
    ':host{all:initial;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text",Inter,Arial,sans-serif}',
    '.pill{display:inline-flex;align-items:center;gap:9px;padding:10px 15px;border-radius:999px;background:#121316;color:#F7F5F0;border:1px solid rgba(212,168,83,.55);box-shadow:0 10px 28px rgba(12,14,18,.28);cursor:pointer;font-size:12.5px;font-weight:700;letter-spacing:.2px;transition:transform .18s ease,box-shadow .18s ease}',
    '.pill:hover{transform:translateY(-2px);box-shadow:0 14px 34px rgba(12,14,18,.36)}',
    '.dot{width:8px;height:8px;border-radius:999px;background:#d4a853;box-shadow:0 0 0 3px rgba(212,168,83,.25);flex:0 0 auto}',
    '.badge{font-size:10px;padding:2px 6px;border-radius:999px;background:rgba(212,168,83,.18);color:#e6c78b;font-weight:700}',
    '.panel{display:none;width:316px;max-width:calc(100vw - 32px);background:#ffffff;color:#121316;border-radius:18px;border:1px solid rgba(18,19,22,.14);box-shadow:0 22px 54px rgba(12,14,18,.28);padding:18px;margin-bottom:10px;box-sizing:border-box}',
    '.panel.open{display:block;animation:jpaFade .18s ease}',
    '@keyframes jpaFade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}',
    '.head{display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:10px}',
    '.kicker{font-size:10px;letter-spacing:1.6px;text-transform:uppercase;color:#9a7228;font-weight:700}',
    '.title{font-size:15px;font-weight:800;line-height:1.25;margin-top:2px;color:#121316}',
    '.close{border:none;background:#f1f5f9;color:#121316;width:26px;height:26px;border-radius:999px;font-size:16px;line-height:1;cursor:pointer;flex:0 0 auto}',
    '.lbl{display:flex;justify-content:space-between;font-size:12px;font-weight:600;color:#454A54;margin:10px 0 4px}',
    'input[type=range]{width:100%;accent-color:#9E7B43;cursor:pointer;margin:0}',
    '.res{margin-top:12px;padding:11px 12px;border-radius:12px;background:#F7F5F0;border:1px solid rgba(18,19,22,.08);display:flex;justify-content:space-between;align-items:center;gap:8px}',
    '.res-lbl{font-size:11.5px;color:#454A54;font-weight:600;line-height:1.3}',
    '.res-val{font-size:18px;font-weight:800;color:#9B1C2E;white-space:nowrap}',
    '.cta{display:block;text-align:center;margin-top:12px;padding:11px 14px;border-radius:10px;background:#121316;color:#F7F5F0;text-decoration:none;font-size:12.5px;font-weight:700;transition:background .18s}',
    '.cta:hover{background:#23262E}',
    '.foot{margin-top:8px;font-size:10.5px;color:#6E737E;text-align:center}',
    '@media (max-width:480px){.pill{padding:9px 12px;font-size:12px}.badge{display:none}}',
    '</style>',
    '<div class="panel" id="panel" role="dialog" aria-label="JPA 360° Margen-Schnellrechner">',
    '  <div class="head">',
    '    <div><div class="kicker">JPA 360° · 60-Sek.-Check</div><div class="title">Was kostet dich dein Rabatt?</div></div>',
    '    <button type="button" class="close" id="closeBtn" aria-label="Schließen">×</button>',
    '  </div>',
    '  <div class="lbl"><span>Monatsumsatz</span><strong id="vRev">45.000 €</strong></div>',
    '  <input type="range" id="rRev" min="10000" max="250000" step="5000" value="45000" />',
    '  <div class="lbl"><span>Durchschn. Rabatt</span><strong id="vDisc">15 %</strong></div>',
    '  <input type="range" id="rDisc" min="0" max="40" step="1" value="15" />',
    '  <div class="res"><span class="res-lbl">Verlorener Rohertrag<br/>pro Monat (DB I)</span><span class="res-val" id="vLoss">−6.750 €</span></div>',
    '  <a class="cta" href="' + targetUrl + '" target="_blank" rel="noopener">Komplette PDF-Auswertung (0 €) →</a>',
    '  <div class="foot">3 Live-Rechner (DB I · Mietquote · Kabinen-UPT) · 0 Cookies</div>',
    '</div>',
    '<button type="button" class="pill" id="toggleBtn" aria-expanded="false">',
    '  <span class="dot"></span><span>Margen-Check</span><span class="badge">0 €</span>',
    '</button>'
  ].join('');

  var panel = shadow.getElementById('panel');
  var toggleBtn = shadow.getElementById('toggleBtn');
  var closeBtn = shadow.getElementById('closeBtn');
  var rRev = shadow.getElementById('rRev');
  var rDisc = shadow.getElementById('rDisc');
  var vRev = shadow.getElementById('vRev');
  var vDisc = shadow.getElementById('vDisc');
  var vLoss = shadow.getElementById('vLoss');

  function fmt(n) { return Math.round(n).toLocaleString('de-DE') + ' €'; }
  function upd() {
    var rev = Number(rRev.value) || 0;
    var disc = Number(rDisc.value) || 0;
    vRev.textContent = fmt(rev);
    vDisc.textContent = disc + ' %';
    vLoss.textContent = '−' + fmt(rev * (disc / 100));
  }
  rRev.addEventListener('input', upd);
  rDisc.addEventListener('input', upd);
  upd();

  function setOpen(state) {
    if (state) { panel.classList.add('open'); toggleBtn.setAttribute('aria-expanded', 'true'); }
    else { panel.classList.remove('open'); toggleBtn.setAttribute('aria-expanded', 'false'); }
  }
  toggleBtn.addEventListener('click', function () { setOpen(!panel.classList.contains('open')); });
  closeBtn.addEventListener('click', function () { setOpen(false); });

  // Cookiefreie B2B-Unternehmenserkennung (DSGVO Art. 6 Abs. 1 lit. f · 0 Cookies · keine IP-Speicherung)
  try {
    fetch('https://jpa360-cloud-linux.vercel.app/api/b2b-visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({ page_url: window.location.href, referrer: document.referrer || '' })
    }).catch(function () {});
  } catch (_e) {}
})();
