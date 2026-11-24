(function(){
  if (document.getElementById('jpa-astro-root')) return;

  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isSaasPage = location.pathname.indexOf('saas-abloesung') !== -1;

  // 1. Luxury Editorial Glass + 3D Stage Overlay Styles
  const css = `
  #jpa-astro-root{position:fixed;inset:0;z-index:120;pointer-events:none;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text','Helvetica Neue',Arial,sans-serif}
  #jpa-astro-root *{box-sizing:border-box}
  #astro3dCanvas{position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;display:block}
  #astroHitbox{position:fixed;left:0;top:0;width:104px;height:112px;margin-left:-52px;margin-top:-56px;pointer-events:auto;cursor:pointer;border-radius:50%;background:transparent;-webkit-tap-highlight-color:transparent;touch-action:manipulation;z-index:122}
  #astroHitbox:focus-visible{outline:2px solid #D4AF6A;outline-offset:4px}
  .astro-bubble{position:fixed;left:0;top:0;z-index:123;pointer-events:auto;width:min(324px,calc(100vw - 28px));background:rgba(255,255,255,.95);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);color:#121316;border:1px solid rgba(158,123,67,.38);border-radius:18px;padding:13px 15px;box-shadow:0 20px 50px rgba(18,19,22,.16),0 0 0 1px rgba(255,255,255,.6) inset;transition:opacity .26s ease,transform .28s cubic-bezier(.22,1,.36,1)}
  .astro-bubble.hidden{opacity:0;transform:scale(.9) translateY(8px);pointer-events:none;visibility:hidden}
  .astro-head-row{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px}
  .astro-badge{font-size:10.5px;font-weight:800;letter-spacing:1.3px;text-transform:uppercase;color:#9E7B43;display:inline-flex;align-items:center;gap:6px}
  .astro-dot{width:7px;height:7px;border-radius:50%;background:#10B981;box-shadow:0 0 8px #10B981}
  .astro-controls{display:inline-flex;align-items:center;gap:4px}
  .astro-icon-btn{background:rgba(18,19,22,.05);border:none;color:#555A64;font-size:13px;cursor:pointer;line-height:1;width:24px;height:24px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;transition:all .16s ease}
  .astro-icon-btn:hover{background:#121316;color:#F7F5F0}
  .astro-msg{font-size:13px;line-height:1.48;color:#272A30;margin-bottom:10px}
  .astro-msg strong{color:#121316}
  .astro-chips{display:flex;flex-wrap:wrap;gap:6px}
  .astro-chip{background:#F7F5F0;color:#121316;border:1px solid rgba(18,19,22,.12);border-radius:999px;padding:5.5px 10px;font-size:11.3px;font-weight:600;cursor:pointer;transition:all .18s ease;text-decoration:none;display:inline-flex;align-items:center;gap:4px}
  .astro-chip:hover{background:#121316;color:#F7F5F0;border-color:#121316;transform:translateY(-1px)}
  .astro-chip.gold{background:linear-gradient(135deg,#D4AF6A,#9E7B43);color:#121316;border-color:transparent;font-weight:700}
  .astro-chip.gold:hover{filter:brightness(1.06);color:#121316}
  .astro-chip.dog{background:linear-gradient(135deg,#FFF6E5,#FCE7BE);border-color:rgba(158,123,67,.4);color:#6B4E16}
  .astro-chip.dog:hover{background:#9E7B43;color:#FFFFFF;border-color:#9E7B43}
  @media (max-width:640px){#astroHitbox{width:84px;height:92px;margin-left:-42px;margin-top:-46px}.astro-bubble{padding:11px 13px}.astro-msg{font-size:12.4px}}
  @media print{#jpa-astro-root{display:none!important}}
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // 2. DOM Overlay
  const root = document.createElement('div');
  root.id = 'jpa-astro-root';
  root.innerHTML = `
    <canvas id="astro3dCanvas" aria-hidden="true"></canvas>
    <div id="astroHitbox" role="button" tabindex="0" aria-label="JPA 3D Astro-Bot anklicken" title="Klick mich an oder lass mich fliegen!"></div>
    <div class="astro-bubble hidden" id="astroBubble" role="dialog" aria-label="JPA 3D Assistent">
      <div class="astro-head-row">
        <span class="astro-badge"><span class="astro-dot"></span> JPA 3D-Bot · Live</span>
        <div class="astro-controls">
          <button type="button" class="astro-icon-btn" id="astroDogBtn" title="Golden Retriever rufen">🐕</button>
          <button type="button" class="astro-icon-btn" id="astroFlyBtn" title="Über den Bildschirm fliegen">✈</button>
          <button type="button" class="astro-icon-btn" id="astroClose" aria-label="Sprechblase schließen">×</button>
        </div>
      </div>
      <div class="astro-msg" id="astroMsg">Hi! 👋 Ich bin dein 3D <strong>JPA-Bot</strong>.</div>
      <div class="astro-chips" id="astroChips"></div>
    </div>
  `;
  document.body.appendChild(root);

  const canvas = document.getElementById('astro3dCanvas');
  const hitbox = document.getElementById('astroHitbox');
  const bubble = document.getElementById('astroBubble');
  const msgEl = document.getElementById('astroMsg');
  const chipsEl = document.getElementById('astroChips');
  const closeBtn = document.getElementById('astroClose');
  const dogBtn = document.getElementById('astroDogBtn');
  const flyBtn = document.getElementById('astroFlyBtn');

  let bubbleOpen = false;
  let tapCount = 0;
  let idleTimer = null;
  let dogEventPlayed = false;
  let lastInteractionTs = Date.now();

  // Shared 3D Controller API (populated once Three.js boots)
  const botAPI = {
    ready: false,
    mood: 'normal',
    moodUntil: 0,
    x: window.innerWidth - 82,
    y: window.innerHeight - 140,
    targetX: window.innerWidth - 82,
    targetY: window.innerHeight - 140,
    vx: 0,
    vy: 0,
    pointerX: window.innerWidth * 0.5,
    pointerY: window.innerHeight * 0.5,
    sequence: null, // 'dog' when Golden Retriever sequence is active
    seqStart: 0,
    setMood: function(m, durationMs){
      this.mood = m || 'normal';
      this.moodUntil = performance.now() + (durationMs || 3600);
    },
    flyTo: function(tx, ty){
      if (this.sequence === 'dog') return;
      const padX = window.innerWidth < 640 ? 54 : 76;
      const padTop = 88;
      const padBot = window.innerWidth < 640 ? 116 : 126;
      this.targetX = Math.max(padX, Math.min(window.innerWidth - padX, tx));
      this.targetY = Math.max(padTop, Math.min(window.innerHeight - padBot, ty));
    },
    flyNearElement: function(el){
      if (!el || this.sequence === 'dog') return;
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      const preferRight = (r.right + 78 < window.innerWidth);
      const tx = preferRight ? (r.right + 44) : Math.max(66, r.left - 44);
      const ty = Math.max(96, Math.min(window.innerHeight - 135, r.top + Math.min(90, r.height * 0.35)));
      this.flyTo(tx, ty);
    },
    startDogSequence: function(){
      if (this.sequence === 'dog') return;
      this.sequence = 'dog';
      this.seqStart = performance.now();
      dogEventPlayed = true;
      say('Warte kurz! Ich flieg mal eben los und hol meinen besten Freund... 🐾', 'wave', defaultChips());
    }
  };

  // 3. Speech Bubble & Smart Chips
  function positionBubble(){
    if (!bubbleOpen) return;
    const bw = bubble.offsetWidth || 310;
    const bh = bubble.offsetHeight || 150;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let bx = botAPI.x - bw - 56;
    if (bx < 14) bx = botAPI.x + 56;
    if (bx + bw > vw - 14) bx = Math.max(14, vw - bw - 14);
    let by = botAPI.y - bh * 0.55;
    if (by < 14) by = 14;
    if (by + bh > vh - 86) by = Math.max(14, vh - bh - 86);
    bubble.style.transform = 'translate3d(' + Math.round(bx) + 'px,' + Math.round(by) + 'px,0)';
  }

  function renderChips(list){
    chipsEl.innerHTML = '';
    list.forEach(function(item){
      if (item.href){
        const a = document.createElement('a');
        a.className = 'astro-chip' + (item.gold ? ' gold' : '') + (item.dog ? ' dog' : '');
        a.href = item.href;
        if (item.external){ a.target = '_blank'; a.rel = 'noopener'; }
        a.textContent = item.label;
        chipsEl.appendChild(a);
      } else {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'astro-chip' + (item.gold ? ' gold' : '') + (item.dog ? ' dog' : '');
        b.textContent = item.label;
        b.addEventListener('click', function(e){
          e.stopPropagation();
          lastInteractionTs = Date.now();
          item.onClick();
        });
        chipsEl.appendChild(b);
      }
    });
  }

  function defaultChips(){
    return [
      { label: '💡 SaaS ablösen', onClick: showSaasPitch },
      { label: '🎯 Größter Hebel', onClick: diagnoseNow },
      { label: '🐕 Golden Retriever', onClick: function(){ botAPI.startDogSequence(); }, dog: true },
      { label: '⚡ Audit / Buchen', href: isSaasPage ? '#buchen' : './saas-abloesung-entwickler.html', gold: true }
    ];
  }

  function say(htmlText, mood, chips){
    bubbleOpen = true;
    bubble.classList.remove('hidden');
    msgEl.innerHTML = htmlText;
    if (mood) botAPI.setMood(mood);
    if (chips) renderChips(chips);
    requestAnimationFrame(positionBubble);
  }

  function showSaasPitch(){
    const targetCard = document.getElementById('rechner') || document.body;
    botAPI.flyNearElement(targetCard);
    say(
      '<strong>Schluss mit teurer SaaS-Miete!</strong> Statt 1.000–4.000 €/Monat in starre Abos zu zahlen, entwickelt Jeeno dein <strong>100 % eigenes System</strong>: 0 € Seat-Gebühren, volles Code-Eigentum &amp; oft in <strong>2–6 Monaten amortisiert</strong>.',
      'point',
      [
        { label: '🧮 SaaS-Ersparnis rechnen', href: './saas-abloesung-entwickler.html#rechner', gold: true },
        { label: '💬 Direkt per WhatsApp', href: 'https://wa.me/491708957669?text=' + encodeURIComponent('Hallo Jeeno, dein kleiner 3D-Bot hat mir das Thema SaaS-Ablösung gezeigt — lass uns kurz über ein eigenes System sprechen.'), external: true },
        { label: '↩ Zurück', onClick: function(){ say('Spiel gern weiter mit den Reglern — ich fliege direkt mit!', 'nod', defaultChips()); } }
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
      botAPI.flyNearElement(document.getElementById('outSave36') || document.getElementById('rechner'));
      say(
        'Deine aktuelle Rechnung: <strong>' + Math.round(save36).toLocaleString('de-DE') + ' € Netto-Ersparnis in 3 Jahren</strong> — dein eigenes System ist schon nach <strong>' + be + ' Monaten</strong> bezahlt!',
        save36 > 20000 ? 'happy' : 'point',
        [
          { label: '🚀 490 € Audit anfragen', href: '#buchen', gold: true },
          { label: '💬 WhatsApp', href: document.getElementById('stickySaasWa')?.href || 'https://wa.me/491708957669', external: true },
          { label: '🐕 Golden Retriever', onClick: function(){ botAPI.startDogSequence(); }, dog: true }
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
      botAPI.flyNearElement(document.getElementById('outRabatt') || document.getElementById('rDisc'));
      say(
        '<strong>Achtung!</strong> ' + disc + ' % Rabatt kosten dich <strong>−' + loss.toLocaleString('de-DE') + ' € Rohertrag jeden Monat</strong>. In der Kabine (+' + upt.toFixed(2).replace('.', ',') + ' UPT) liegen dagegen <strong>+' + gain.toLocaleString('de-DE') + ' € DB I / Jahr</strong>!',
        'shake',
        [
          { label: '💬 Hebel per WhatsApp', href: document.getElementById('btnSmartWa')?.href || 'https://wa.me/491708957669', external: true, gold: true },
          { label: '💡 SaaS-Abos ablösen?', onClick: showSaasPitch }
        ]
      );
    } else {
      botAPI.flyNearElement(document.getElementById('outKabine') || document.getElementById('kUpt'));
      say(
        'Starkes Potenzial: Dein Kabinen-Hebel bringt <strong>+' + gain.toLocaleString('de-DE') + ' € DB I pro Jahr</strong> ohne 1 € extra Miete — und parallel lassen sich teure Software-Abos ablösen!',
        'happy',
        [
          { label: '💬 Ergebnis per WhatsApp', href: document.getElementById('btnSmartWa')?.href || 'https://wa.me/491708957669', external: true, gold: true },
          { label: '💡 SaaS-Kosten-Killer', onClick: showSaasPitch }
        ]
      );
    }
  }

  // 4. Calculator Live-Reactions + Smart Flight to the Active Card
  let reactTimer = null;
  function wireCalcReactions(){
    const ids = isSaasPage
      ? ['seats','perSeat','fixedSaas','buildBudget']
      : ['rRev','rDisc','rMargin','mSqm','mRent','mRev','kBons','kPrice','kUpt'];
    ids.forEach(function(id){
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('input', function(){
        lastInteractionTs = Date.now();
        clearTimeout(reactTimer);
        reactTimer = setTimeout(function(){
          const card = el.closest('.calc-card, .card, section') || el;
          botAPI.flyNearElement(card);
          if (isSaasPage){
            const seats = +(document.getElementById('seats')?.value || 1);
            const per = +(document.getElementById('perSeat')?.value || 0);
            const fix = +(document.getElementById('fixedSaas')?.value || 0);
            const tot36 = (seats * per + fix) * 36;
            if (tot36 >= 45000){
              say('Whoa! <strong>' + Math.round(tot36).toLocaleString('de-DE') + ' € in 3 Jahren</strong> nur für SaaS-Miete! Mit einem eigenen System gehört dir der Code dauerhaft.', 'surprised', defaultChips());
            } else {
              say('Schau auf den Break-Even — nach wenigen Monaten sparst du <strong>jeden Monat bar auf dem Konto</strong>!', 'nod', defaultChips());
            }
          } else {
            if (id === 'rDisc' && (+el.value >= 15)){
              say('Oh nein! <strong>' + el.value + ' % Rabatt</strong> fressen deine Marge auf! Schau mal in den Kabinen-Rechner — dort liegt der echte Gewinn.', 'shake', defaultChips());
            } else if (id === 'mRent' || id === 'mRev'){
              const ratio = ((+(document.getElementById('mRent')?.value||0)) / Math.max(1, +(document.getElementById('mRev')?.value||1))) * 100;
              if (ratio > 12) say('Oha! <strong>' + ratio.toFixed(1) + ' % Mietquote</strong> ist im roten Bereich — höchste Zeit für den Vollpreis-Hebel!', 'surprised', defaultChips());
              else if (ratio <= 8) say('Stark! <strong>' + ratio.toFixed(1) + ' % Mietquote</strong> ist richtig gesund — ich nicke anerkennend!', 'happy', defaultChips());
            } else if (id === 'kUpt'){
              say('Genau so! <strong>+' + Number(el.value).toFixed(2).replace('.',',') + ' Teile pro Bon</strong> fließen fast direkt ins EBITDA!', 'happy', defaultChips());
            }
          }
        }, 520);
      });
    });
  }
  wireCalcReactions();

  // 5. Autonomous Dwell-Time Flight Patrol & Golden Retriever Auto-Trigger
  function flyToRandomSpot(){
    if (botAPI.sequence === 'dog' || prefersReduced) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const spots = [
      { x: vw - 84, y: vh - 145 },
      { x: vw - 92, y: Math.max(125, vh * 0.28) },
      { x: 84, y: Math.max(130, vh * 0.34) },
      { x: 90, y: vh - 145 },
      { x: vw * 0.78, y: Math.max(120, vh * 0.22) }
    ];
    // Pick a spot at least 180px away from current position
    const far = spots.filter(function(s){ return Math.hypot(s.x - botAPI.x, s.y - botAPI.y) > 180; });
    const pick = far[Math.floor(Math.random() * far.length)] || spots[0];
    botAPI.flyTo(pick.x, pick.y);
  }

  function scheduleDwellChoreography(){
    clearInterval(idleTimer);
    if (prefersReduced) return;
    idleTimer = setInterval(function(){
      if (document.hidden || botAPI.sequence === 'dog') return;
      const idleSec = (Date.now() - lastInteractionTs) / 1000;
      if (!dogEventPlayed && idleSec >= 18){
        botAPI.startDogSequence();
        return;
      }
      if (idleSec >= 12){
        flyToRandomSpot();
        const tips = isSaasPage ? [
          { m: 'point', t: 'Wusstest du? Schon ab <strong>600 €/Monat SaaS-Kosten</strong> lohnt sich oft ein eigenes schlankes System!' },
          { m: 'wave', t: 'Ich dreh mal eine Runde! Unten im <strong>490 € Architektur-Audit</strong> siehst du deinen genauen Einspar-Fahrplan.' }
        ] : [
          { m: 'point', t: 'Kleiner Rundflug! Schon die <strong>1-Klick-Szenarien</strong> oben getestet? Alle Regler fahren live mit.' },
          { m: 'wave', t: 'Tipp: Jeeno baut auch <strong>eigene Systeme statt teurer SaaS-Abos</strong> — klick auf „SaaS ablösen“!' },
          { m: 'happy', t: 'Klick auf den kleinen Hund 🐕 oben in meiner Blase — ich hab eine Überraschung für dich!' }
        ];
        const tip = tips[Math.floor(Math.random() * tips.length)];
        if (bubbleOpen) say(tip.t, tip.m, defaultChips());
        else botAPI.setMood(tip.m, 2800);
      }
    }, 17000);
  }

  // 6. User Interactions (Tap/Pet Bot, Fly Button, Dog Button, Close)
  function onBotTap(){
    lastInteractionTs = Date.now();
    if (botAPI.sequence === 'dog'){
      botAPI.setMood('love', 2600);
      return;
    }
    tapCount++;
    if (!bubbleOpen){
      say('Bin wieder da! Soll ich dir deinen stärksten Hebel, die <strong>SaaS-Ablösung</strong> oder meinen <strong>Golden Retriever</strong> zeigen?', 'wave', defaultChips());
      return;
    }
    const reactions = [
      { m: 'love', t: 'Hehe, danke fürs Streicheln! 💙 Wusstest du, dass du Jeeno direkt als <strong>Entwickler für eigene Systeme statt teurer SaaS-Abos</strong> buchen kannst?' },
      { m: 'surprised', t: 'Oha! Schau mal — ich kann überall hinfliegen! ✈ Probier oben die <strong>1-Klick-Szenarien</strong> aus.' },
      { m: 'point', t: 'Mit <strong>1 Klick auf WhatsApp</strong> unten sendest du genau deine berechneten Zahlen direkt an Jeeno.' }
    ];
    const pick = reactions[tapCount % reactions.length];
    if (tapCount % 2 === 0) flyToRandomSpot();
    say(pick.t, pick.m, defaultChips());
  }

  hitbox.addEventListener('click', onBotTap);
  hitbox.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onBotTap(); } });

  closeBtn.addEventListener('click', function(e){
    e.stopPropagation();
    bubbleOpen = false;
    bubble.classList.add('hidden');
  });

  dogBtn.addEventListener('click', function(e){
    e.stopPropagation();
    lastInteractionTs = Date.now();
    botAPI.startDogSequence();
  });

  flyBtn.addEventListener('click', function(e){
    e.stopPropagation();
    lastInteractionTs = Date.now();
    flyToRandomSpot();
    botAPI.setMood('happy', 2600);
  });

  window.addEventListener('pointermove', function(e){
    botAPI.pointerX = e.clientX;
    botAPI.pointerY = e.clientY;
  }, { passive: true });

  // 7. Dynamically Load Three.js & Build Real 3D Astro-Bot + 3D Golden Retriever
  function loadThreeAndBoot(){
    if (window.THREE){
      init3D(window.THREE);
      return;
    }
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js';
    s.async = true;
    s.onload = function(){ if (window.THREE) init3D(window.THREE); };
    s.onerror = function(){
      // Graceful fallback: still show bubble in bottom-right
      botAPI.x = window.innerWidth - 70;
      botAPI.y = window.innerHeight - 130;
      say('Hi! 👋 Ich bin dein <strong>JPA-Bot</strong>. Spiel mit den Reglern — ich zeige dir sofort deinen größten Hebel!', 'wave', defaultChips());
    };
    document.head.appendChild(s);
  }

  function init3D(THREE){
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch (e) {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;

    const scene = new THREE.Scene();

    // Perspective camera calibrated so z=0 maps 1:1 to screen pixels!
    const fov = 36;
    const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 10, 4000);
    function updateCamera(){
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      const dist = (h / 2) / Math.tan((fov * Math.PI / 180) / 2);
      camera.position.set(0, 0, dist);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      // Keep bot inside resized viewport
      botAPI.targetX = Math.max(60, Math.min(w - 60, botAPI.targetX));
      botAPI.targetY = Math.max(90, Math.min(h - 120, botAPI.targetY));
    }
    updateCamera();
    window.addEventListener('resize', updateCamera);

    function screenToWorld(sx, sy){
      return {
        x: sx - window.innerWidth / 2,
        y: (window.innerHeight / 2) - sy
      };
    }

    // Studio Lighting (Warm Luxury Alabaster Key + Cool Cyan Rim + Soft Fill)
    const hemiLight = new THREE.HemisphereLight(0xFFFDF8, 0xCBD5E1, 1.35);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xFFF8EB, 1.55);
    keyLight.position.set(260, 420, 520);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x67E8F9, 0.95);
    rimLight.position.set(-340, 180, -180);
    scene.add(rimLight);

    const goldBounce = new THREE.PointLight(0xD4AF6A, 0.8, 900);
    goldBounce.position.set(0, -260, 260);
    scene.add(goldBounce);

    // Shared Materials
    const matIvory = new THREE.MeshPhysicalMaterial({
      color: 0xFDFCFA,
      roughness: 0.16,
      metalness: 0.04,
      clearcoat: 1.0,
      clearcoatRoughness: 0.12
    });
    const matBrass = new THREE.MeshStandardMaterial({
      color: 0xD4AF6A,
      roughness: 0.24,
      metalness: 0.78
    });
    const matObsidian = new THREE.MeshPhysicalMaterial({
      color: 0x11141C,
      roughness: 0.18,
      metalness: 0.28,
      clearcoat: 0.9
    });
    const matCyanGlow = new THREE.MeshBasicMaterial({
      color: 0x67E8F9,
      transparent: true,
      opacity: 0.9
    });

    // Dynamic High-DPI Canvas Texture for Ultra-Cute Expressive LED Visor Face
    const faceCanvas = document.createElement('canvas');
    faceCanvas.width = 512;
    faceCanvas.height = 256;
    const fctx = faceCanvas.getContext('2d');
    const faceTex = new THREE.CanvasTexture(faceCanvas);
    faceTex.colorSpace = THREE.SRGBColorSpace;

    let lastFaceKey = '';
    function drawFace(mood, blinkAmount, gazeX, gazeY){
      const key = mood + '|' + blinkAmount.toFixed(1) + '|' + gazeX.toFixed(1) + '|' + gazeY.toFixed(1);
      if (key === lastFaceKey) return;
      lastFaceKey = key;

      fctx.clearRect(0, 0, 512, 256);
      // Deep glossy obsidian visor gradient
      const bg = fctx.createLinearGradient(0, 0, 0, 256);
      bg.addColorStop(0, '#171C28');
      bg.addColorStop(1, '#090B10');
      fctx.fillStyle = bg;
      fctx.fillRect(0, 0, 512, 256);

      // Subtle glossy glass reflection streak
      fctx.fillStyle = 'rgba(255,255,255,0.06)';
      fctx.beginPath();
      fctx.ellipse(256, 36, 200, 32, 0, 0, Math.PI * 2);
      fctx.fill();

      const gx = gazeX * 18;
      const gy = gazeY * 12;
      const lx = 178 + gx;
      const rx = 334 + gx;
      const ey = 122 + gy;

      // Cute Rosy Cheeks
      const cheekAlpha = (mood === 'love' || mood === 'happy') ? 0.55 : 0.28;
      fctx.fillStyle = 'rgba(251, 113, 133, ' + cheekAlpha + ')';
      fctx.beginPath();
      fctx.ellipse(122 + gx * 0.5, 162 + gy * 0.5, 26, 13, 0, 0, Math.PI * 2);
      fctx.ellipse(390 + gx * 0.5, 162 + gy * 0.5, 26, 13, 0, 0, Math.PI * 2);
      fctx.fill();

      fctx.save();
      fctx.shadowBlur = 22;

      if (mood === 'love'){
        // Glowing Pink-Gold Heart Eyes!
        fctx.fillStyle = '#FB7185';
        fctx.shadowColor = '#FB7185';
        [lx, rx].forEach(function(cx){
          fctx.save();
          fctx.translate(cx, ey);
          fctx.beginPath();
          fctx.moveTo(0, 24);
          fctx.bezierCurveTo(-36, -6, -32, -38, 0, -14);
          fctx.bezierCurveTo(32, -38, 36, -6, 0, 24);
          fctx.fill();
          fctx.restore();
        });
        // Big happy cat-like smile
        fctx.strokeStyle = '#67E8F9';
        fctx.shadowColor = '#67E8F9';
        fctx.lineWidth = 10;
        fctx.lineCap = 'round';
        fctx.beginPath();
        fctx.arc(256 + gx * 0.6, 168 + gy * 0.6, 24, 0.15 * Math.PI, 0.85 * Math.PI);
        fctx.stroke();
      } else if (mood === 'happy' || mood === 'nod'){
        // Cute Happy ^ ^ Arches
        fctx.strokeStyle = '#67E8F9';
        fctx.shadowColor = '#67E8F9';
        fctx.lineWidth = 16;
        fctx.lineCap = 'round';
        [lx, rx].forEach(function(cx){
          fctx.beginPath();
          fctx.arc(cx, ey + 14, 30, Math.PI * 1.15, Math.PI * 1.85);
          fctx.stroke();
        });
        fctx.lineWidth = 10;
        fctx.beginPath();
        fctx.arc(256 + gx * 0.6, 166 + gy * 0.6, 24, 0.15 * Math.PI, 0.85 * Math.PI);
        fctx.stroke();
      } else if (mood === 'shake'){
        // Worried Coral Eyes + Little Frown
        fctx.fillStyle = '#FCA5A5';
        fctx.shadowColor = '#F87171';
        [lx, rx].forEach(function(cx){
          fctx.beginPath();
          fctx.ellipse(cx, ey + 4, 24, 24, 0, 0, Math.PI * 2);
          fctx.fill();
        });
        fctx.strokeStyle = '#FCA5A5';
        fctx.lineWidth = 11;
        fctx.lineCap = 'round';
        fctx.beginPath();
        fctx.moveTo(lx - 26, ey - 32); fctx.lineTo(lx + 24, ey - 18);
        fctx.moveTo(rx + 26, ey - 32); fctx.lineTo(rx - 24, ey - 18);
        fctx.stroke();
        fctx.beginPath();
        fctx.arc(256 + gx * 0.5, 198 + gy * 0.5, 20, Math.PI * 1.2, Math.PI * 1.8);
        fctx.stroke();
      } else if (mood === 'surprised'){
        // Wide Golden-Amber O O Eyes
        fctx.fillStyle = '#FDE68A';
        fctx.shadowColor = '#FBBF24';
        [lx, rx].forEach(function(cx){
          fctx.beginPath();
          fctx.ellipse(cx, ey, 32, 36, 0, 0, Math.PI * 2);
          fctx.fill();
          fctx.fillStyle = '#FFFFFF';
          fctx.beginPath();
          fctx.arc(cx + 10, ey - 12, 10, 0, Math.PI * 2);
          fctx.fill();
          fctx.fillStyle = '#FDE68A';
        });
        fctx.strokeStyle = '#FDE68A';
        fctx.lineWidth = 9;
        fctx.beginPath();
        fctx.arc(256 + gx * 0.6, 184 + gy * 0.6, 13, 0, Math.PI * 2);
        fctx.stroke();
      } else {
        // Ultra-Cute Glowing Cyan Glossy Eyes with Double Catchlights + Blink
        const ry = Math.max(3, 34 * (1 - blinkAmount));
        fctx.fillStyle = '#67E8F9';
        fctx.shadowColor = '#22D3EE';
        [lx, rx].forEach(function(cx){
          fctx.beginPath();
          fctx.ellipse(cx, ey, 26, ry, 0, 0, Math.PI * 2);
          fctx.fill();
          if (blinkAmount < 0.5){
            fctx.fillStyle = '#FFFFFF';
            fctx.shadowBlur = 0;
            fctx.beginPath();
            fctx.arc(cx + 8, ey - 11, 9, 0, Math.PI * 2);
            fctx.arc(cx - 7, ey + 10, 4, 0, Math.PI * 2);
            fctx.fill();
            fctx.fillStyle = '#67E8F9';
            fctx.shadowBlur = 22;
          }
        });
        // Cute Little Smile
        fctx.strokeStyle = '#67E8F9';
        fctx.lineWidth = 9;
        fctx.lineCap = 'round';
        fctx.beginPath();
        fctx.arc(256 + gx * 0.6, 168 + gy * 0.6, 20, 0.2 * Math.PI, 0.8 * Math.PI);
        fctx.stroke();
      }
      fctx.restore();
      faceTex.needsUpdate = true;
    }
    drawFace('normal', 0, 0, 0);

    // 8. Build Ultra-Cute 3D Astro-Bot Rig
    const botRoot = new THREE.Group();
    const scaleFactor = window.innerWidth < 640 ? 0.78 : 0.94;
    botRoot.scale.setScalar(scaleFactor);
    scene.add(botRoot);

    const botInner = new THREE.Group();
    botRoot.add(botInner);

    // Chibi Rounded Body (pear-shaped cuteness)
    const bodyGeo = new THREE.SphereGeometry(20, 28, 24);
    bodyGeo.scale(1.0, 1.08, 0.88);
    const bodyMesh = new THREE.Mesh(bodyGeo, matIvory);
    bodyMesh.position.set(0, -14, 0);
    botInner.add(bodyMesh);

    // Brass Belt / Collar Accent
    const collarMesh = new THREE.Mesh(new THREE.TorusGeometry(14.5, 2.3, 14, 32), matBrass);
    collarMesh.rotation.x = Math.PI / 2;
    collarMesh.position.set(0, 3, 0);
    botInner.add(collarMesh);

    // Chest Core Badge (Obsidian + Cyan Energy Heart + Brass Ring)
    const chestRing = new THREE.Mesh(new THREE.TorusGeometry(6.8, 1.3, 12, 24), matBrass);
    chestRing.position.set(0, -12, 17.5);
    botInner.add(chestRing);
    const chestCore = new THREE.Mesh(new THREE.CircleGeometry(5.6, 20), matCyanGlow);
    chestCore.position.set(0, -12, 17.8);
    botInner.add(chestCore);

    // Cute Jetpack on the back + glowing thrusters
    const jetpack = new THREE.Group();
    jetpack.position.set(0, -13, -17);
    botInner.add(jetpack);
    const jpBody = new THREE.Mesh(new THREE.BoxGeometry(19, 18, 9), matObsidian);
    jetpack.add(jpBody);
    const thrL = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 4.4, 7, 16), matBrass);
    thrL.position.set(-5.5, -10, 0);
    jetpack.add(thrL);
    const thrR = thrL.clone();
    thrR.position.set(5.5, -10, 0);
    jetpack.add(thrR);
    const flameMat = new THREE.MeshBasicMaterial({ color: 0x67E8F9, transparent: true, opacity: 0.78 });
    const flameL = new THREE.Mesh(new THREE.ConeGeometry(3.6, 15, 14), flameMat);
    flameL.rotation.x = Math.PI;
    flameL.position.set(-5.5, -20, 0);
    jetpack.add(flameL);
    const flameR = flameL.clone();
    flameR.position.set(5.5, -20, 0);
    jetpack.add(flameR);

    // Head Group (Big Adorable Chibi Helmet!)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 21, 0);
    botInner.add(headGroup);

    const helmetGeo = new THREE.SphereGeometry(26, 32, 28);
    helmetGeo.scale(1.12, 0.94, 0.98);
    const helmetMesh = new THREE.Mesh(helmetGeo, matIvory);
    headGroup.add(helmetMesh);

    // Curved Glass Visor Screen with Expressive Canvas Texture
    const visorGeo = new THREE.SphereGeometry(24.6, 32, 24, -Math.PI * 0.34, Math.PI * 0.68, Math.PI * 0.28, Math.PI * 0.44);
    visorGeo.scale(1.1, 0.92, 1.0);
    const visorMat = new THREE.MeshPhysicalMaterial({
      map: faceTex,
      roughness: 0.08,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      emissive: 0xFFFFFF,
      emissiveMap: faceTex,
      emissiveIntensity: 0.48
    });
    const visorMesh = new THREE.Mesh(visorGeo, visorMat);
    visorMesh.rotation.y = -Math.PI / 2;
    visorMesh.position.set(0, -1, 2.2);
    headGroup.add(visorMesh);

    // Cute Brass Ear-Pads
    const earGeo = new THREE.CylinderGeometry(7.2, 7.2, 5.2, 20);
    const earL = new THREE.Mesh(earGeo, matBrass);
    earL.rotation.z = Math.PI / 2;
    earL.position.set(-29.5, 0, 0);
    headGroup.add(earL);
    const earR = earL.clone();
    earR.position.set(29.5, 0, 0);
    headGroup.add(earR);

    // Bouncy Brass Antenna with Glowing Orb
    const antennaGroup = new THREE.Group();
    antennaGroup.position.set(0, 24, 0);
    headGroup.add(antennaGroup);
    const antStem = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.8, 10, 12), matObsidian);
    antStem.position.y = 4;
    antennaGroup.add(antStem);
    const antBulb = new THREE.Mesh(new THREE.SphereGeometry(4.4, 16, 16), matBrass);
    antBulb.position.y = 11;
    antennaGroup.add(antBulb);

    // Articulated Cute Arms
    function buildArm(side){
      const pivot = new THREE.Group();
      pivot.position.set(side * 22, -4, 1);
      const upper = new THREE.Mesh(new THREE.CapsuleGeometry(4.6, 9, 10, 16), matIvory);
      upper.position.set(side * 2, -8, 0);
      pivot.add(upper);
      const hand = new THREE.Mesh(new THREE.SphereGeometry(5.2, 16, 16), matBrass);
      hand.position.set(side * 2.5, -16, 1);
      pivot.add(hand);
      botInner.add(pivot);
      return pivot;
    }
    const armL = buildArm(-1);
    const armR = buildArm(1);

    // Cute Stubby Kicking Feet
    function buildLeg(side){
      const pivot = new THREE.Group();
      pivot.position.set(side * 8.5, -31, 0);
      const foot = new THREE.Mesh(new THREE.CapsuleGeometry(4.8, 5, 10, 14), matIvory);
      foot.position.set(0, -6, 1);
      pivot.add(foot);
      const sole = new THREE.Mesh(new THREE.SphereGeometry(5.1, 14, 14), matBrass);
      sole.scale.set(1, 0.55, 1.25);
      sole.position.set(0, -11, 2.5);
      pivot.add(sole);
      botInner.add(pivot);
      return pivot;
    }
    const legL = buildLeg(-1);
    const legR = buildLeg(1);

    // 9. Build Ultra-Cute 3D Golden Retriever!
    const dogRoot = new THREE.Group();
    dogRoot.visible = false;
    dogRoot.scale.setScalar(scaleFactor * 1.06);
    scene.add(dogRoot);

    const matFur = new THREE.MeshStandardMaterial({ color: 0xE7B366, roughness: 0.72, metalness: 0.02 });
    const matFurLight = new THREE.MeshStandardMaterial({ color: 0xF7DFB3, roughness: 0.78, metalness: 0.01 });
    const matFurEar = new THREE.MeshStandardMaterial({ color: 0xC68A3E, roughness: 0.76, metalness: 0.02 });
    const matNose = new THREE.MeshPhysicalMaterial({ color: 0x1E1B18, roughness: 0.2, clearcoat: 0.9 });
    const matTongue = new THREE.MeshStandardMaterial({ color: 0xFB7185, roughness: 0.45 });
    const matCollarDog = new THREE.MeshStandardMaterial({ color: 0x9E7B43, roughness: 0.35, metalness: 0.45 });

    // Golden Retriever Body (facing +X)
    const dogBody = new THREE.Group();
    dogRoot.add(dogBody);

    const torsoGeo = new THREE.CapsuleGeometry(19, 34, 14, 22);
    torsoGeo.rotateZ(Math.PI / 2);
    const torso = new THREE.Mesh(torsoGeo, matFur);
    torso.position.set(0, 6, 0);
    dogBody.add(torso);

    // Fluffy Cream Chest Mane
    const chestFluff = new THREE.Mesh(new THREE.SphereGeometry(18.5, 20, 18), matFurLight);
    chestFluff.scale.set(0.95, 1.05, 0.92);
    chestFluff.position.set(18, 4, 0);
    dogBody.add(chestFluff);

    // Luxury Brass Dog Collar + Gold Tag
    const dCollar = new THREE.Mesh(new THREE.TorusGeometry(13.5, 2.4, 12, 24), matCollarDog);
    dCollar.rotation.y = Math.PI / 2;
    dCollar.rotation.x = 0.25;
    dCollar.position.set(22, 14, 0);
    dogBody.add(dCollar);
    const dTag = new THREE.Mesh(new THREE.SphereGeometry(3.2, 12, 12), matBrass);
    dTag.position.set(28, 4, 0);
    dogBody.add(dTag);

    // Golden Retriever Head
    const dogHead = new THREE.Group();
    dogHead.position.set(28, 22, 0);
    dogBody.add(dogHead);

    const skull = new THREE.Mesh(new THREE.SphereGeometry(16, 22, 20), matFur);
    skull.scale.set(1.06, 0.98, 0.96);
    dogHead.add(skull);

    // Cute Muzzle + Shiny Dark Nose + Happy Pink Tongue
    const muzzle = new THREE.Mesh(new THREE.SphereGeometry(9.6, 18, 16), matFurLight);
    muzzle.scale.set(1.25, 0.85, 0.88);
    muzzle.position.set(14, -4, 0);
    dogHead.add(muzzle);

    const nose = new THREE.Mesh(new THREE.SphereGeometry(4.0, 14, 14), matNose);
    nose.scale.set(0.9, 0.78, 1.15);
    nose.position.set(24.5, -1.5, 0);
    dogHead.add(nose);

    const tongue = new THREE.Mesh(new THREE.CapsuleGeometry(2.8, 5, 8, 12), matTongue);
    tongue.rotation.z = 0.45;
    tongue.position.set(19, -11, 0);
    dogHead.add(tongue);

    // Glossy Cute Puppy Eyes with White Sparkle
    [-1, 1].forEach(function(side){
      const eye = new THREE.Mesh(new THREE.SphereGeometry(3.0, 14, 14), matNose);
      eye.position.set(11.5, 4.5, side * 8.2);
      dogHead.add(eye);
      const glint = new THREE.Mesh(new THREE.SphereGeometry(1.05, 10, 10), matIvory);
      glint.position.set(13.8, 5.6, side * 8.9);
      dogHead.add(glint);
    });

    // Floppy Golden Ears
    function buildDogEar(side){
      const ep = new THREE.Group();
      ep.position.set(1, 7, side * 13);
      const ear = new THREE.Mesh(new THREE.CapsuleGeometry(5.5, 12, 10, 14), matFurEar);
      ear.scale.set(0.85, 1.0, 0.45);
      ear.position.set(-2, -9, side * 2);
      ear.rotation.z = -0.18;
      ep.add(ear);
      dogHead.add(ep);
      return ep;
    }
    const dogEarL = buildDogEar(-1);
    const dogEarR = buildDogEar(1);

    // Fluffy Wagging Golden Tail
    const dogTail = new THREE.Group();
    dogTail.position.set(-26, 12, 0);
    dogBody.add(dogTail);
    const tailMesh = new THREE.Mesh(new THREE.CapsuleGeometry(4.5, 19, 10, 14), matFurLight);
    tailMesh.position.set(-8, 8, 0);
    tailMesh.rotation.z = 0.75;
    dogTail.add(tailMesh);

    // 4 Articulated Trotting Legs
    function buildDogLeg(x, z){
      const lp = new THREE.Group();
      lp.position.set(x, -6, z);
      const leg = new THREE.Mesh(new THREE.CapsuleGeometry(5.0, 15, 10, 14), matFur);
      leg.position.set(0, -9, 0);
      lp.add(leg);
      const paw = new THREE.Mesh(new THREE.SphereGeometry(5.4, 12, 12), matFurLight);
      paw.scale.set(1.25, 0.65, 0.95);
      paw.position.set(2, -18, 0);
      lp.add(paw);
      dogBody.add(lp);
      return lp;
    }
    const dLegFL = buildDogLeg(16, -9);
    const dLegFR = buildDogLeg(16, 9);
    const dLegBL = buildDogLeg(-16, -9);
    const dLegBR = buildDogLeg(-16, 9);

    // 10. Floating 3D Sparkles & Petting Hearts Pool
    const particles = [];
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, -3);
    heartShape.bezierCurveTo(-5, 2, -4, 7, 0, 3);
    heartShape.bezierCurveTo(4, 7, 5, 2, 0, -3);
    const heartGeo = new THREE.ShapeGeometry(heartShape);
    const sparkGeo = new THREE.SphereGeometry(2.4, 8, 8);

    function spawnParticle(wx, wy, wz, type){
      if (particles.length > 36) return;
      const isHeart = type === 'heart';
      const mat = new THREE.MeshBasicMaterial({
        color: isHeart ? (Math.random() > 0.4 ? 0xFB7185 : 0xD4AF6A) : 0x67E8F9,
        transparent: true,
        opacity: 0.92,
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(isHeart ? heartGeo : sparkGeo, mat);
      mesh.position.set(wx + (Math.random() - 0.5) * 20, wy + (Math.random() - 0.5) * 14, wz + 20);
      if (isHeart) mesh.scale.setScalar(1.35 + Math.random() * 0.6);
      scene.add(mesh);
      particles.push({
        mesh: mesh,
        vx: (Math.random() - 0.5) * 18,
        vy: isHeart ? (34 + Math.random() * 24) : (-28 - Math.random() * 18),
        life: 0,
        maxLife: isHeart ? 1.5 : 0.65
      });
    }

    // 11. Main 60FPS Animation Loop (Flight Physics, Expressions, Golden Retriever Choreography)
    let lastTime = performance.now();
    let nextBlinkAt = performance.now() + 2600;
    let blinkProgress = 0;
    let lastHeartAt = 0;
    let lastJetAt = 0;
    let dogPhaseAnnounced = 0;

    function animate(now){
      requestAnimationFrame(animate);
      if (document.hidden) { lastTime = now; return; }
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      const t = now * 0.001;

      // Reset expired mood
      if (botAPI.mood !== 'normal' && now > botAPI.moodUntil && botAPI.sequence !== 'dog'){
        botAPI.mood = 'normal';
      }

      // Natural Blinking
      if (now > nextBlinkAt){
        blinkProgress += dt * 11;
        if (blinkProgress >= 2){
          blinkProgress = 0;
          nextBlinkAt = now + 2600 + Math.random() * 2400;
        }
      }
      const blinkVal = blinkProgress > 0 ? Math.sin(Math.min(1, blinkProgress * 0.5) * Math.PI) : 0;

      // Cursor Gaze
      const rawGazeX = Math.max(-1, Math.min(1, (botAPI.pointerX - botAPI.x) / 220));
      const rawGazeY = Math.max(-1, Math.min(1, (botAPI.pointerY - botAPI.y) / 220));

      let isFlyingFast = false;

      if (botAPI.sequence === 'dog'){
        // === SIGNATURE GOLDEN RETRIEVER RIDE-IN, PETTING & WALK-OFF SEQUENCE ===
        const e = (now - botAPI.seqStart) / 1000;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const groundY = vh - (vw < 640 ? 104 : 114);
        const stopX = vw * (vw < 640 ? 0.52 : 0.60);

        if (e < 1.35){
          // Phase 1: Astro-Bot zooms off left edge!
          dogRoot.visible = false;
          dogPhaseAnnounced = 1;
          const p = e / 1.35;
          const ease = p * p;
          botAPI.x = botAPI.x + ((-110 - botAPI.x) * Math.min(1, dt * 4.5 + ease * 0.12));
          botAPI.y = botAPI.y + ((groundY - 40 - botAPI.y) * dt * 3);
          botInner.rotation.z = 0.34;
          botInner.rotation.y = -0.7;
          isFlyingFast = true;
        } else if (e < 4.5){
          // Phase 2: Golden Retriever trots onto screen with Astro-Bot riding on his back!
          dogRoot.visible = true;
          const p = Math.min(1, (e - 1.35) / 3.15);
          const smooth = 1 - Math.pow(1 - p, 2.2);
          const dogX = -110 + (stopX + 110) * smooth;
          const wDog = screenToWorld(dogX, groundY);
          const trotBounce = Math.abs(Math.sin(t * 11)) * 5.5;
          dogRoot.position.set(wDog.x, wDog.y + trotBounce, 0);
          dogRoot.rotation.y = 0.16;

          // Trotting legs + happy wagging tail + bouncing ears
          const stride = Math.sin(t * 11) * 0.65;
          dLegFL.rotation.z = stride;
          dLegBR.rotation.z = stride;
          dLegFR.rotation.z = -stride;
          dLegBL.rotation.z = -stride;
          dogTail.rotation.z = Math.sin(t * 14) * 0.32;
          dogTail.rotation.y = Math.cos(t * 14) * 0.4;
          dogEarL.rotation.x = Math.sin(t * 11) * 0.18;
          dogEarR.rotation.x = -Math.sin(t * 11) * 0.18;
          dogHead.rotation.z = Math.sin(t * 5.5) * 0.08;

          // Astro-Bot sits proudly on the Golden Retriever's back!
          botAPI.x = dogX - 4;
          botAPI.y = groundY - 48 - trotBounce;
          botInner.rotation.z = Math.sin(t * 11) * 0.08;
          botInner.rotation.y = 0.25;
          armR.rotation.z = 2.2 + Math.sin(t * 14) * 0.45; // Waving enthusiastically!
          armL.rotation.z = -0.35;
          legL.rotation.x = -0.65;
          legR.rotation.x = -0.65;
          botAPI.mood = 'happy';

          if (dogPhaseAnnounced < 2 && p > 0.25){
            dogPhaseAnnounced = 2;
            say('Tadaa! 🐾 Schau mal, auf wem ich angeritten komme — mein treuer <strong>Golden Retriever</strong>!', 'happy', defaultChips());
          }
        } else if (e < 9.2){
          // Phase 3: Astro-Bot hops off & pets the Golden Retriever (Hearts + Super Wag!)
          dogRoot.visible = true;
          const p = (e - 4.5) / 4.7;
          const wDog = screenToWorld(stopX, groundY);
          dogRoot.position.set(wDog.x, wDog.y, 0);
          dogRoot.rotation.y = 0.22;

          // Dog stops, stands happy, wags tail super fast, nods happily into the pets!
          dLegFL.rotation.z *= 0.85;
          dLegFR.rotation.z *= 0.85;
          dLegBL.rotation.z *= 0.85;
          dLegBR.rotation.z *= 0.85;
          dogTail.rotation.z = Math.sin(t * 22) * 0.42;
          dogTail.rotation.y = Math.cos(t * 22) * 0.55;
          dogHead.rotation.z = -0.1 + Math.sin(t * 7) * 0.12;
          tongue.scale.y = 1.0 + Math.sin(t * 12) * 0.15;

          // Bot hops off to the right of the dog's head & pets him gently!
          const hopP = Math.min(1, p * 4);
          const hopArc = Math.sin(hopP * Math.PI) * 32;
          botAPI.x = stopX + 6 + 56 * hopP;
          botAPI.y = groundY - 46 + 24 * hopP - hopArc;
          botInner.rotation.y = -0.68;
          botInner.rotation.z = 0.08;
          legL.rotation.x = 0;
          legR.rotation.x = 0;

          // Petting arm motion!
          if (hopP >= 0.9){
            armL.rotation.z = -1.35 + Math.sin(t * 9.5) * 0.35;
            armL.rotation.x = -0.5;
            armR.rotation.z = 0.35;
            botAPI.mood = 'love';
            if (now - lastHeartAt > 290){
              lastHeartAt = now;
              spawnParticle(wDog.x + 28, wDog.y + 42, 10, 'heart');
            }
          }

          if (dogPhaseAnnounced < 3 && hopP >= 0.9){
            dogPhaseAnnounced = 3;
            say('Guter Junge! 💛 Genau so treu & stressfrei läuft ein <strong>eigenes System ohne teure SaaS-Abos</strong> — einmal gebaut, gehört es für immer dir!', 'love', [
              { label: '🧮 SaaS-Ersparnis berechnen', href: './saas-abloesung-entwickler.html#rechner', gold: true },
              { label: '💬 Jeeno auf WhatsApp', href: 'https://wa.me/491708957669?text=' + encodeURIComponent('Hallo Jeeno, dein 3D-Bot mit dem Golden Retriever ist genial! Lass uns über meine Zahlen / ein eigenes System sprechen.'), external: true }
            ]);
          }
        } else if (e < 12.6){
          // Phase 4: Golden Retriever trots happily off the right edge while Astro-Bot waves goodbye!
          dogRoot.visible = true;
          const p = (e - 9.2) / 3.4;
          const dogX = stopX + (vw - stopX + 140) * (p * p * 0.55 + p * 0.45);
          const wDog = screenToWorld(dogX, groundY);
          const trotBounce = Math.abs(Math.sin(t * 12)) * 5.5;
          dogRoot.position.set(wDog.x, wDog.y + trotBounce, 0);
          dogRoot.rotation.y = 0.14;
          const stride = Math.sin(t * 12) * 0.68;
          dLegFL.rotation.z = stride;
          dLegBR.rotation.z = stride;
          dLegFR.rotation.z = -stride;
          dLegBL.rotation.z = -stride;
          dogTail.rotation.z = Math.sin(t * 16) * 0.36;

          // Astro-Bot floats up and waves goodbye
          botAPI.y = groundY - 34 - p * 36;
          botInner.rotation.y = 0.35;
          botInner.rotation.z = 0;
          armL.rotation.z = -0.2;
          armL.rotation.x = 0;
          armR.rotation.z = 2.3 + Math.sin(t * 15) * 0.45;
          botAPI.mood = 'happy';

          if (dogPhaseAnnounced < 4){
            dogPhaseAnnounced = 4;
            say('Tschüss kleiner Freund! 👋 So, zurück zu deinen Zahlen — klick mich jederzeit an, wenn ich wieder fliegen soll!', 'wave', defaultChips());
          }
        } else {
          // Sequence complete — return smoothly to assistant patrol
          dogRoot.visible = false;
          botAPI.sequence = null;
          botAPI.targetX = vw - (vw < 640 ? 64 : 86);
          botAPI.targetY = vh - 140;
          botAPI.mood = 'normal';
        }
      } else {
        // === NORMAL FULL-SCREEN FLIGHT PHYSICS ===
        const dx = botAPI.targetX - botAPI.x;
        const dy = botAPI.targetY - botAPI.y;
        const dist = Math.hypot(dx, dy);

        // Smooth critically damped spring flight
        botAPI.vx = (botAPI.vx + dx * 4.2 * dt) * Math.pow(0.08, dt);
        botAPI.vy = (botAPI.vy + dy * 4.2 * dt) * Math.pow(0.08, dt);
        botAPI.x += botAPI.vx * dt * 2.2;
        botAPI.y += botAPI.vy * dt * 2.2;

        isFlyingFast = dist > 28;

        // Cute Banking & Leaning into Flight Direction
        const targetBank = Math.max(-0.36, Math.min(0.36, -botAPI.vx * 0.0022));
        const targetYaw = Math.max(-0.55, Math.min(0.55, rawGazeX * 0.38 + botAPI.vx * 0.0018));
        botInner.rotation.z += (targetBank - botInner.rotation.z) * Math.min(1, dt * 8);
        botInner.rotation.y += (targetYaw - botInner.rotation.y) * Math.min(1, dt * 7);

        // Cute Head Expressions & Limb Poses
        const hoverBob = prefersReduced ? 0 : Math.sin(t * 3.2) * 6.5;
        botInner.position.y = hoverBob;

        headGroup.rotation.x = rawGazeY * 0.16;
        headGroup.rotation.y = rawGazeX * 0.24;
        headGroup.rotation.z = Math.sin(t * 2.1) * 0.04;
        antennaGroup.rotation.z = -botInner.rotation.z * 1.4 + Math.sin(t * 5.2) * 0.12;

        // Reset arms/legs gently before applying mood
        let targetArmRZ = 0.22 + Math.sin(t * 3.2) * 0.08;
        let targetArmLZ = -0.22 - Math.sin(t * 3.2) * 0.08;
        let targetArmLX = 0;

        if (botAPI.mood === 'wave'){
          targetArmRZ = 2.35 + Math.sin(t * 15) * 0.45;
          headGroup.rotation.z = 0.12;
        } else if (botAPI.mood === 'nod' || botAPI.mood === 'happy'){
          headGroup.rotation.x = Math.sin(t * 12) * 0.28;
          targetArmRZ = 1.15;
          targetArmLZ = -1.15;
        } else if (botAPI.mood === 'shake'){
          headGroup.rotation.y = Math.sin(t * 18) * 0.42;
          targetArmRZ = 0.55;
          targetArmLZ = -0.55;
        } else if (botAPI.mood === 'surprised'){
          headGroup.position.y = 23 + Math.sin(t * 10) * 1.5;
          targetArmRZ = 1.85;
          targetArmLZ = -1.85;
        } else if (botAPI.mood === 'point'){
          targetArmLZ = -1.45;
          targetArmLX = -0.45;
        } else if (botAPI.mood === 'love'){
          targetArmRZ = 1.35 + Math.sin(t * 10) * 0.2;
          targetArmLZ = -1.35 - Math.sin(t * 10) * 0.2;
          if (now - lastHeartAt > 420){
            lastHeartAt = now;
            const wp = screenToWorld(botAPI.x, botAPI.y);
            spawnParticle(wp.x, wp.y + 32, 10, 'heart');
          }
        }
        if (botAPI.mood !== 'surprised') headGroup.position.y = 21;

        armR.rotation.z += (targetArmRZ - armR.rotation.z) * Math.min(1, dt * 12);
        armL.rotation.z += (targetArmLZ - armL.rotation.z) * Math.min(1, dt * 12);
        armL.rotation.x += (targetArmLX - armL.rotation.x) * Math.min(1, dt * 12);

        // Cute kicking feet while flying!
        const kickSpeed = isFlyingFast ? 14 : 3.2;
        const kickAmp = isFlyingFast ? 0.42 : 0.12;
        legL.rotation.x = Math.sin(t * kickSpeed) * kickAmp;
        legR.rotation.x = -Math.sin(t * kickSpeed) * kickAmp;
      }

      // Jetpack Thruster Glow & Sparkle Trail when flying
      const flameScale = isFlyingFast ? (1.15 + Math.sin(t * 32) * 0.25) : (0.52 + Math.sin(t * 12) * 0.12);
      flameL.scale.set(1, flameScale, 1);
      flameR.scale.set(1, flameScale, 1);
      flameMat.opacity = isFlyingFast ? 0.92 : 0.48;

      // Sync 3D Bot World Position + Hitbox + Speech Bubble
      const worldBot = screenToWorld(botAPI.x, botAPI.y);
      botRoot.position.set(worldBot.x, worldBot.y, 12);

      if (isFlyingFast && now - lastJetAt > 65){
        lastJetAt = now;
        spawnParticle(worldBot.x, worldBot.y - 34, 4, 'spark');
      }

      hitbox.style.transform = 'translate3d(' + Math.round(botAPI.x) + 'px,' + Math.round(botAPI.y) + 'px,0)';
      if (bubbleOpen) positionBubble();

      // Update Dynamic Face Texture
      drawFace(botAPI.mood, blinkVal, rawGazeX, rawGazeY);

      // Update Particles (Hearts & Jetpack Sparkles)
      for (let i = particles.length - 1; i >= 0; i--){
        const p = particles[i];
        p.life += dt;
        if (p.life >= p.maxLife){
          scene.remove(p.mesh);
          p.mesh.material.dispose();
          particles.splice(i, 1);
          continue;
        }
        p.mesh.position.x += p.vx * dt;
        p.mesh.position.y += p.vy * dt;
        p.mesh.material.opacity = 1 - (p.life / p.maxLife);
      }

      renderer.render(scene, camera);
    }

    botAPI.ready = true;
    requestAnimationFrame(animate);

    // Friendly Entrance Flight + Greeting
    botAPI.x = window.innerWidth + 70;
    botAPI.y = window.innerHeight - 210;
    botAPI.targetX = window.innerWidth - (window.innerWidth < 640 ? 64 : 88);
    botAPI.targetY = window.innerHeight - 140;

    setTimeout(function(){
      if (isSaasPage){
        say('Hi! 👋 Ich bin dein 3D <strong>JPA-Bot</strong>. Dreh an den SaaS-Reglern — ich fliege direkt mit und zeige dir deine 3-Jahres-Ersparnis!', 'wave', defaultChips());
      } else {
        say('Hi! 👋 Ich bin dein 3D <strong>JPA-Bot</strong>! Spiel mit den Reglern — ich fliege zu deinen Hebeln &amp; zeige dir, wie du teure SaaS-Abos ablöst.', 'wave', defaultChips());
      }
      scheduleDwellChoreography();
    }, 850);
  }

  loadThreeAndBoot();
})();
