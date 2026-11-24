(function(){
  if (document.getElementById('jpa-astro-root')) return;

  // 1. Luxury Editorial + Cute Astro-Bot Styles
  const css = `
  #jpa-astro-root{position:fixed;right:22px;bottom:92px;z-index:120;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text','Helvetica Neue',Arial,sans-serif;display:flex;flex-direction:column;align-items:flex-end;gap:10px;pointer-events:none}
  #jpa-astro-root *{box-sizing:border-box}
  .astro-bubble{pointer-events:auto;width:min(320px,calc(100vw - 36px));background:rgba(255,255,255,.96);backdrop-filter:blur(16px);color:#121316;border:1px solid rgba(158,123,67,.36);border-radius:18px 18px 4px 18px;padding:14px 16px;box-shadow:0 18px 46px rgba(18,19,22,.16);transform-origin:bottom right;transition:opacity .28s ease,transform .32s cubic-bezier(.22,1,.36,1)}
  .astro-bubble.hidden{opacity:0;transform:scale(.88) translateY(10px);pointer-events:none;display:none}
  .astro-head-row{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px}
  .astro-badge{font-size:10.5px;font-weight:800;letter-spacing:1.4px;text-transform:uppercase;color:#9E7B43;display:inline-flex;align-items:center;gap:6px}
  .astro-dot{width:7px;height:7px;border-radius:50%;background:#10B981;box-shadow:0 0 8px #10B981}
  .astro-close{background:none;border:none;color:#6E737E;font-size:16px;cursor:pointer;line-height:1;padding:2px 4px}
  .astro-close:hover{color:#121316}
  .astro-msg{font-size:13.2px;line-height:1.48;color:#272A30;margin-bottom:10px}
  .astro-msg strong{color:#121316}
  .astro-chips{display:flex;flex-wrap:wrap;gap:6px}
  .astro-chip{background:#F7F5F0;color:#121316;border:1px solid rgba(18,19,22,.12);border-radius:999px;padding:6px 10px;font-size:11.5px;font-weight:600;cursor:pointer;transition:all .18s ease;text-decoration:none;display:inline-flex;align-items:center;gap:4px}
  .astro-chip:hover{background:#121316;color:#F7F5F0;border-color:#121316;transform:translateY(-1px)}
  .astro-chip.gold{background:linear-gradient(135deg,#B89252,#9E7B43);color:#121316;border-color:transparent;font-weight:700}
  .astro-chip.gold:hover{filter:brightness(1.06);color:#121316}
  .astro-stage{pointer-events:auto;position:relative;width:82px;height:94px;cursor:pointer;user-select:none;-webkit-tap-highlight-color:transparent;filter:drop-shadow(0 12px 22px rgba(18,19,22,.22))}
  .astro-stage:active{transform:scale(.95)}
  .astro-float{animation:astroFloat 3.1s ease-in-out infinite}
  @keyframes astroFloat{0%,100%{transform:translateY(0px)}50%{transform:translateY(-7px)}}
  .astro-shadow{animation:astroShadow 3.1s ease-in-out infinite;transform-origin:center}
  @keyframes astroShadow{0%,100%{transform:scaleX(1);opacity:.26}50%{transform:scaleX(.78);opacity:.14}}
  .astro-head-group{transform-origin:50px 40px;transition:transform .25s ease}
  .astro-arm-r{transform-origin:75px 62px;transition:transform .22s ease}
  .astro-arm-l{transform-origin:25px 62px;transition:transform .22s ease}
  .astro-eye{transition:all .16s ease;transform-origin:center}
  .astro-blink .astro-eye-shape{transform:scaleY(0.08)}
  .astro-wave .astro-arm-r{animation:astroWave .42s ease-in-out 4}
  @keyframes astroWave{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-58deg) translate(3px,-6px)}}
  .astro-nod .astro-head-group{animation:astroNod .36s ease-in-out 3}
  @keyframes astroNod{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(4px) rotate(4deg)}}
  .astro-shake .astro-head-group{animation:astroShake .28s ease-in-out 4}
  @keyframes astroShake{0%,100%{transform:translateX(0) rotate(0deg)}25%{transform:translateX(-4px) rotate(-7deg)}75%{transform:translateX(4px) rotate(7deg)}}
  .astro-surprised .astro-head-group{transform:translateY(-3px) rotate(-8deg) scale(1.04)}
  .astro-point .astro-arm-l{transform:rotate(48deg) translate(-5px,-4px)}
  .astro-hop{animation:astroHop .45s cubic-bezier(.22,1,.36,1)}
  @keyframes astroHop{0%{transform:translateY(0)}45%{transform:translateY(-14px) scale(1.06)}100%{transform:translateY(0)}}
  @media (max-width:640px){#jpa-astro-root{right:12px;bottom:84px}.astro-stage{width:70px;height:80px}}
  @media print{#jpa-astro-root{display:none!important}}
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // 2. Cute Astro-Bot SVG (Obsidian + Warm Ivory + Brass Gold + Glowing Cyan Visor)
  const root = document.createElement('div');
  root.id = 'jpa-astro-root';
  root.innerHTML = `
    <div class="astro-bubble" id="astroBubble" role="dialog" aria-label="JPA Mini-Assistent">
      <div class="astro-head-row">
        <span class="astro-badge"><span class="astro-dot"></span> JPA-Bot · Live-Assistent</span>
        <button type="button" class="astro-close" id="astroClose" aria-label="Sprechblase schließen">×</button>
      </div>
      <div class="astro-msg" id="astroMsg">Hallo! Ich bin dein kleiner <strong>JPA-Bot</strong>. Dreh oben an den Reglern — ich zeige dir sofort deinen größten Hebel!</div>
      <div class="astro-chips" id="astroChips"></div>
    </div>
    <div class="astro-stage" id="astroStage" title="Klick mich an!">
      <svg id="astroSvg" viewBox="0 0 100 112" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="abBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#FFFFFF"/>
            <stop offset="100%" stop-color="#E6E1D6"/>
          </linearGradient>
          <linearGradient id="abVisor" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#1A1D24"/>
            <stop offset="100%" stop-color="#0B0D12"/>
          </linearGradient>
          <linearGradient id="abBrass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#D4AF6A"/>
            <stop offset="100%" stop-color="#9E7B43"/>
          </linearGradient>
          <radialGradient id="abJet" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#67E8F9" stop-opacity="0.85"/>
            <stop offset="100%" stop-color="#67E8F9" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <!-- Boden-Schatten -->
        <ellipse class="astro-shadow" cx="50" cy="105" rx="22" ry="4.5" fill="#121316"/>
        <g class="astro-float" id="astroRig">
          <!-- Sanfter Jet-Glow -->
          <ellipse cx="50" cy="92" rx="13" ry="6" fill="url(#abJet)"/>
          <!-- Linkes Ärmchen (mit kleinem Finger zum Zeigen!) -->
          <g class="astro-arm-l" id="astroArmL">
            <rect x="14" y="58" width="12" height="22" rx="6" fill="url(#abBody)" stroke="#121316" stroke-width="2"/>
            <circle cx="17" cy="80" r="3.6" fill="url(#abBrass)"/>
            <rect x="12" y="77" width="7" height="3.2" rx="1.6" fill="#121316" opacity="0.85"/>
          </g>
          <!-- Rechtes Ärmchen (zum Winken!) -->
          <g class="astro-arm-r" id="astroArmR">
            <rect x="74" y="58" width="12" height="22" rx="6" fill="url(#abBody)" stroke="#121316" stroke-width="2"/>
            <circle cx="80" cy="80" r="3.8" fill="url(#abBrass)"/>
          </g>
          <!-- Körper -->
          <rect x="27" y="55" width="46" height="34" rx="16" fill="url(#abBody)" stroke="#121316" stroke-width="2.2"/>
          <!-- Brust-Emblem (Brass Kern) -->
          <rect x="38" y="65" width="24" height="12" rx="6" fill="#121316"/>
          <circle cx="45" cy="71" r="2.6" fill="#67E8F9"/>
          <rect x="51" y="69.5" width="7" height="3" rx="1.5" fill="url(#abBrass)"/>
          <!-- Kopf-Gruppe -->
          <g class="astro-head-group" id="astroHead">
            <!-- Antenne -->
            <line x1="50" y1="14" x2="50" y2="7" stroke="#121316" stroke-width="2.4" stroke-linecap="round"/>
            <circle cx="50" cy="5.5" r="4" fill="url(#abBrass)" stroke="#121316" stroke-width="1.5"/>
            <!-- Ohren-Pads -->
            <rect x="17" y="28" width="7" height="16" rx="3.5" fill="url(#abBrass)" stroke="#121316" stroke-width="1.6"/>
            <rect x="76" y="28" width="7" height="16" rx="3.5" fill="url(#abBrass)" stroke="#121316" stroke-width="1.6"/>
            <!-- Kopf-Helm -->
            <rect x="22" y="14" width="56" height="42" rx="18" fill="url(#abBody)" stroke="#121316" stroke-width="2.2"/>
            <!-- Visor -->
            <rect x="28" y="21" width="44" height="27" rx="12" fill="url(#abVisor)"/>
            <!-- Augen (dynamisch per JS steuerbar!) -->
            <g id="astroEyes">
              <g class="astro-eye-shape" id="eyeL" style="transform-origin:40px 34px">
                <ellipse cx="40" cy="34" rx="4.4" ry="5.4" fill="#67E8F9"/>
                <circle cx="41.4" cy="32" r="1.5" fill="#FFFFFF"/>
              </g>
              <g class="astro-eye-shape" id="eyeR" style="transform-origin:60px 34px">
                <ellipse cx="60" cy="34" rx="4.4" ry="5.4" fill="#67E8F9"/>
                <circle cx="61.4" cy="32" r="1.5" fill="#FFFFFF"/>
              </g>
            </g>
            <!-- Kleines süßes Lächeln / Mund -->
            <path id="astroMouth" d="M 46 42 Q 50 45 54 42" stroke="#67E8F9" stroke-width="1.8" stroke-linecap="round" fill="none" opacity="0.9"/>
          </g>
        </g>
      </svg>
    </div>
  `;
  document.body.appendChild(root);

  const stage = document.getElementById('astroStage');
  const svg = document.getElementById('astroSvg');
  const bubble = document.getElementById('astroBubble');
  const msgEl = document.getElementById('astroMsg');
  const chipsEl = document.getElementById('astroChips');
  const closeBtn = document.getElementById('astroClose');
  const eyesG = document.getElementById('astroEyes');
  const eyeL = document.getElementById('eyeL');
  const eyeR = document.getElementById('eyeR');
  const mouth = document.getElementById('astroMouth');

  const isSaasPage = location.pathname.indexOf('saas-abloesung') !== -1;
  let animTimer = null;
  let bubbleOpen = true;

  function setMood(mood){
    svg.classList.remove('astro-wave','astro-nod','astro-shake','astro-surprised','astro-point');
    void svg.offsetWidth;
    if (mood === 'happy' || mood === 'nod'){
      eyeL.innerHTML = '<path d="M35 35 Q40 29 45 35" stroke="#67E8F9" stroke-width="3" stroke-linecap="round" fill="none"/>';
      eyeR.innerHTML = '<path d="M55 35 Q60 29 65 35" stroke="#67E8F9" stroke-width="3" stroke-linecap="round" fill="none"/>';
      mouth.setAttribute('d','M 45 41 Q 50 46 55 41');
      mouth.setAttribute('stroke','#67E8F9');
      svg.classList.add('astro-nod');
    } else if (mood === 'shake'){
      eyeL.innerHTML = '<ellipse cx="40" cy="34" rx="4.5" ry="4.5" fill="#FCA5A5"/><line x1="35" y1="28" x2="44" y2="30" stroke="#FCA5A5" stroke-width="2" stroke-linecap="round"/>';
      eyeR.innerHTML = '<ellipse cx="60" cy="34" rx="4.5" ry="4.5" fill="#FCA5A5"/><line x1="65" y1="28" x2="56" y2="30" stroke="#FCA5A5" stroke-width="2" stroke-linecap="round"/>';
      mouth.setAttribute('d','M 46 44 Q 50 40 54 44');
      mouth.setAttribute('stroke','#FCA5A5');
      svg.classList.add('astro-shake');
    } else if (mood === 'surprised'){
      eyeL.innerHTML = '<circle cx="40" cy="34" r="6" fill="#FDE68A"/><circle cx="41.5" cy="32" r="2" fill="#FFFFFF"/>';
      eyeR.innerHTML = '<circle cx="60" cy="34" r="6" fill="#FDE68A"/><circle cx="61.5" cy="32" r="2" fill="#FFFFFF"/>';
      mouth.setAttribute('d','M 48 43 A 2.2 2.2 0 1 0 52.4 43 A 2.2 2.2 0 1 0 48 43');
      mouth.setAttribute('stroke','#FDE68A');
      svg.classList.add('astro-surprised');
    } else if (mood === 'point'){
      eyeL.innerHTML = '<ellipse cx="38" cy="34" rx="4.4" ry="5.4" fill="#67E8F9"/><circle cx="39" cy="32" r="1.5" fill="#FFFFFF"/>';
      eyeR.innerHTML = '<ellipse cx="58" cy="34" rx="4.4" ry="5.4" fill="#67E8F9"/><circle cx="59" cy="32" r="1.5" fill="#FFFFFF"/>';
      mouth.setAttribute('d','M 46 42 Q 50 45 54 42');
      mouth.setAttribute('stroke','#67E8F9');
      svg.classList.add('astro-point');
    } else {
      eyeL.innerHTML = '<ellipse cx="40" cy="34" rx="4.4" ry="5.4" fill="#67E8F9"/><circle cx="41.4" cy="32" r="1.5" fill="#FFFFFF"/>';
      eyeR.innerHTML = '<ellipse cx="60" cy="34" rx="4.4" ry="5.4" fill="#67E8F9"/><circle cx="61.4" cy="32" r="1.5" fill="#FFFFFF"/>';
      mouth.setAttribute('d','M 46 42 Q 50 45 54 42');
      mouth.setAttribute('stroke','#67E8F9');
      if (mood === 'wave') svg.classList.add('astro-wave');
    }
    clearTimeout(animTimer);
    animTimer = setTimeout(function(){
      svg.classList.remove('astro-wave','astro-nod','astro-shake','astro-surprised','astro-point');
      eyeL.innerHTML = '<ellipse cx="40" cy="34" rx="4.4" ry="5.4" fill="#67E8F9"/><circle cx="41.4" cy="32" r="1.5" fill="#FFFFFF"/>';
      eyeR.innerHTML = '<ellipse cx="60" cy="34" rx="4.4" ry="5.4" fill="#67E8F9"/><circle cx="61.4" cy="32" r="1.5" fill="#FFFFFF"/>';
      mouth.setAttribute('d','M 46 42 Q 50 45 54 42');
      mouth.setAttribute('stroke','#67E8F9');
    }, 3400);
  }

  function say(htmlText, mood, chips){
    bubbleOpen = true;
    bubble.classList.remove('hidden');
    msgEl.innerHTML = htmlText;
    if (mood) setMood(mood);
    if (chips) renderChips(chips);
  }

  function renderChips(list){
    chipsEl.innerHTML = '';
    list.forEach(function(item){
      if (item.href){
        const a = document.createElement('a');
        a.className = 'astro-chip' + (item.gold ? ' gold' : '');
        a.href = item.href;
        if (item.external){ a.target = '_blank'; a.rel = 'noopener'; }
        a.textContent = item.label;
        chipsEl.appendChild(a);
      } else {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'astro-chip' + (item.gold ? ' gold' : '');
        b.textContent = item.label;
        b.addEventListener('click', item.onClick);
        chipsEl.appendChild(b);
      }
    });
  }

  function defaultChips(){
    return [
      { label: '💡 Eigene Systeme statt SaaS', onClick: showSaasPitch },
      { label: '🎯 Mein größter Hebel', onClick: diagnoseNow },
      { label: '⚡ Entwickler / Audit', href: isSaasPage ? '#buchen' : './saas-abloesung-entwickler.html', gold: true }
    ];
  }

  function showSaasPitch(){
    say(
      '<strong>Schluss mit teurer SaaS-Miete!</strong> Statt 1.000–4.000 €/Monat in starre CRM-, BI- oder KI-Abos zu zahlen, entwickelt Jeeno ein <strong>100 % eigenes System</strong>: 0 € laufende Seat-Gebühren, volles Code-Eigentum &amp; DSGVO-konform — oft in <strong>2–6 Monaten amortisiert</strong>.',
      'point',
      [
        { label: '🧮 SaaS-Ersparnis berechnen', href: './saas-abloesung-entwickler.html#rechner', gold: true },
        { label: '💬 Direkt per WhatsApp', href: 'https://wa.me/491708957669?text=' + encodeURIComponent('Hallo Jeeno, dein kleiner Bot hat mir das Thema SaaS-Ablösung gezeigt — lass uns kurz über ein eigenes System sprechen.'), external: true },
        { label: '↩ Zurück', onClick: function(){ say('Schau dir gerne die Regler an — ich rechne live mit!', 'nod', defaultChips()); } }
      ]
    );
  }

  function diagnoseNow(){
    if (isSaasPage){
      const seats = +(document.getElementById('seats')?.value || 8);
      const perSeat = +(document.getElementById('perSeat')?.value || 145);
      const fixed = +(document.getElementById('fixedSaas')?.value || 350);
      const build = +(document.getElementById('buildBudget')?.value || 2900);
      const m = seats * perSeat + fixed;
      const save36 = Math.max(0, m * 36 - build);
      const be = m > 0 ? (build / m).toFixed(1).replace('.', ',') : '–';
      say(
        'Deine aktuelle Rechnung: <strong>' + Math.round(save36).toLocaleString('de-DE') + ' € Netto-Ersparnis in 3 Jahren</strong> — dein eigenes System ist schon nach <strong>' + be + ' Monaten</strong> bezahlt!',
        save36 > 20000 ? 'nod' : 'point',
        [
          { label: '🚀 490 € Audit anfragen', href: '#buchen', gold: true },
          { label: '💬 WhatsApp', href: document.getElementById('stickySaasWa')?.href || 'https://wa.me/491708957669', external: true }
        ]
      );
      return;
    }
    const rev = +(document.getElementById('rRev')?.value || 45000);
    const disc = +(document.getElementById('rDisc')?.value || 10);
    const m = +(document.getElementById('rMargin')?.value || 50);
    const bons = +(document.getElementById('kBons')?.value || 140);
    const price = +(document.getElementById('kPrice')?.value || 85);
    const upt = +(document.getElementById('kUpt')?.value || 0.2);
    const loss = Math.round(rev * (disc / 100));
    const gain = Math.round(bons * upt * price * 50 * (m / 100));
    if (disc >= 15){
      say(
        '<strong>Achtung!</strong> ' + disc + ' % Rabatt kosten dich <strong>−' + loss.toLocaleString('de-DE') + ' € Rohertrag jeden Monat</strong>. In der Kabine (+' + upt.toFixed(2).replace('.', ',') + ' UPT) liegen dagegen <strong>+' + gain.toLocaleString('de-DE') + ' € DB I / Jahr</strong>!',
        'shake',
        [
          { label: '💬 Hebel per WhatsApp prüfen', href: document.getElementById('btnSmartWa')?.href || 'https://wa.me/491708957669', external: true, gold: true },
          { label: '💡 Auch SaaS-Abos sparen?', onClick: showSaasPitch }
        ]
      );
    } else {
      say(
        'Starkes Potenzial: Dein Kabinen-Hebel bringt <strong>+' + gain.toLocaleString('de-DE') + ' € DB I pro Jahr</strong> ohne 1 € extra Miete — und parallel lassen sich teure Software-Abos ablösen!',
        'nod',
        [
          { label: '💬 Ergebnis per WhatsApp', href: document.getElementById('btnSmartWa')?.href || 'https://wa.me/491708957669', external: true, gold: true },
          { label: '💡 SaaS-Kosten-Killer', onClick: showSaasPitch }
        ]
      );
    }
  }

  // 3. Automatisches natürliches Blinzeln alle 3.2–5.2 Sekunden
  function scheduleBlink(){
    setTimeout(function(){
      svg.classList.add('astro-blink');
      setTimeout(function(){
        svg.classList.remove('astro-blink');
        scheduleBlink();
      }, 140);
    }, 3200 + Math.random() * 2000);
  }
  scheduleBlink();

  // 4. Augen folgen dezent dem Mauszeiger (Tamagotchi-Lebendigkeit)
  window.addEventListener('pointermove', function(e){
    const r = stage.getBoundingClientRect();
    const dx = Math.max(-2.6, Math.min(2.6, (e.clientX - (r.left + r.width / 2)) / 95));
    const dy = Math.max(-2.0, Math.min(2.0, (e.clientY - (r.top + r.height / 2)) / 95));
    eyesG.setAttribute('transform', 'translate(' + dx.toFixed(1) + ',' + dy.toFixed(1) + ')');
  }, {passive: true});

  // 5. Live-Reaktion auf Rechner-Regler (Debounced, damit er nie nervt)
  let reactTimer = null;
  function wireCalcReactions(){
    const ids = isSaasPage
      ? ['seats','perSeat','fixedSaas','buildBudget']
      : ['rRev','rDisc','rMargin','mSqm','mRent','mRev','kBons','kPrice','kUpt'];
    ids.forEach(function(id){
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('input', function(){
        clearTimeout(reactTimer);
        reactTimer = setTimeout(function(){
          if (isSaasPage){
            const seats = +(document.getElementById('seats')?.value || 1);
            const per = +(document.getElementById('perSeat')?.value || 0);
            const fix = +(document.getElementById('fixedSaas')?.value || 0);
            const tot36 = (seats * per + fix) * 36;
            if (tot36 >= 45000){
              say('Whoa! <strong>' + Math.round(tot36).toLocaleString('de-DE') + ' € in 3 Jahren</strong> nur für SaaS-Miete! Mit einem eigenen System gehört dir der Code dauerhaft.', 'surprised', defaultChips());
            } else {
              say('Sieh dir den Break-Even an — nach wenigen Monaten sparst du <strong>jeden Monat bar auf dem Konto</strong>!', 'nod', defaultChips());
            }
          } else {
            if (id === 'rDisc' && (+el.value >= 15)){
              say('Oh nein! <strong>' + el.value + ' % Rabatt</strong> fressen deine Marge auf! Schau mal rechts in den Kabinen-Rechner.', 'shake', defaultChips());
            } else if (id === 'mRent' || id === 'mRev'){
              const ratio = ((+(document.getElementById('mRent')?.value||0)) / Math.max(1, +(document.getElementById('mRev')?.value||1))) * 100;
              if (ratio > 12) say('Oha! <strong>' + ratio.toFixed(1) + ' % Mietquote</strong> ist im roten Bereich — höchste Zeit für den Vollpreis-Hebel!', 'surprised', defaultChips());
              else if (ratio <= 8) say('Stark! <strong>' + ratio.toFixed(1) + ' % Mietquote</strong> ist richtig gesund.', 'nod', defaultChips());
            } else if (id === 'kUpt'){
              say('Genau so! <strong>+' + Number(el.value).toFixed(2).replace('.',',') + ' Teile pro Bon</strong> fließen fast direkt ins EBITDA!', 'nod', defaultChips());
            }
          }
        }, 550);
      });
    });
  }
  wireCalcReactions();

  // 6. Tamagotchi-Interaktion beim Antippen/Streicheln des Bots
  let tapCount = 0;
  stage.addEventListener('click', function(){
    stage.classList.remove('astro-hop');
    void stage.offsetWidth;
    stage.classList.add('astro-hop');
    tapCount++;
    if (!bubbleOpen){
      say('Bin wieder da! Soll ich dir deinen stärksten Hebel oder die <strong>SaaS-Ablösung</strong> zeigen?', 'wave', defaultChips());
      return;
    }
    const reactions = [
      { m: 'happy', t: 'Hehe, danke! Wusstest du, dass du Jeeno auch direkt als <strong>Entwickler für eigene Systeme statt teurer SaaS-Abos</strong> buchen kannst?' },
      { m: 'surprised', t: 'Oha! Schon die <strong>1-Klick-Szenarien</strong> oben ausprobiert? Die Regler bewegen sich ganz von allein!' },
      { m: 'point', t: 'Tipp: Mit <strong>1 Klick auf WhatsApp</strong> unten sendest du genau deine berechneten Zahlen direkt an Jeeno.' }
    ];
    const pick = reactions[tapCount % reactions.length];
    say(pick.t, pick.m, defaultChips());
  });

  closeBtn.addEventListener('click', function(e){
    e.stopPropagation();
    bubbleOpen = false;
    bubble.classList.add('hidden');
  });

  // 7. Begrüßung beim Start (freundliches Winken!)
  renderChips(defaultChips());
  setTimeout(function(){
    if (isSaasPage){
      say('Hi! 👋 Ich zeige dir live, wie viel Geld du in 3 Jahren sparst, wenn du <strong>teure SaaS-Abos durch dein eigenes System</strong> ersetzt.', 'wave', defaultChips());
    } else {
      say('Hi! 👋 Ich bin dein <strong>JPA-Bot</strong>. Spiel kurz mit den Reglern — ich zeige dir sofort dein Gewinn-Potenzial &amp; wie du teure SaaS-Abos ablöst!', 'wave', defaultChips());
    }
  }, 900);
})();
