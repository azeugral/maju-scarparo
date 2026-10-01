/* Folhas de ervas caindo — camada fixa, sem cliques, opacidade baixa.
   Desliga com prefers-reduced-motion e Save-Data; pausa com a aba oculta. */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = navigator.connection && navigator.connection.saveData;
  if (reduce.matches || saveData) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'leaves';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const TONES = ['#4C5B48', '#6E7F69', '#8A9A7B', '#A3AE94'];
  const TAU = Math.PI * 2;
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[(Math.random() * arr.length) | 0];

  // Formas desenhadas uma vez em canvas fora da tela (sprites)
  function leafPath(c, len, wid) {
    c.beginPath();
    c.moveTo(0, -len / 2);
    c.bezierCurveTo(wid, -len / 4, wid * 0.8, len / 4, 0, len / 2);
    c.bezierCurveTo(-wid * 0.8, len / 4, -wid, -len / 4, 0, -len / 2);
    c.closePath();
  }
  function midrib(c, len, color) {
    c.strokeStyle = color; c.lineWidth = Math.max(0.6, len / 40);
    c.beginPath(); c.moveTo(0, -len / 2 + 1); c.lineTo(0, len / 2 + len * 0.12); c.stroke();
  }

  const drawers = {
    // folha de sálvia: alongada e macia
    salvia(c, s, tone) {
      leafPath(c, s, s * 0.34); c.fillStyle = tone; c.fill();
      midrib(c, s, 'rgba(244,239,230,.55)');
    },
    // eucalipto: folha redonda
    eucalipto(c, s, tone) {
      c.beginPath(); c.ellipse(0, 0, s * 0.38, s * 0.42, 0, 0, TAU);
      c.fillStyle = tone; c.fill();
      c.strokeStyle = 'rgba(244,239,230,.45)'; c.lineWidth = Math.max(0.6, s / 40);
      c.beginPath(); c.moveTo(0, -s * 0.36); c.lineTo(0, s * 0.55); c.stroke();
    },
    // raminho: caule com folhinhas alternadas (alecrim / lavanda)
    ramo(c, s, tone) {
      c.strokeStyle = tone; c.lineWidth = Math.max(0.8, s / 34); c.lineCap = 'round';
      c.beginPath(); c.moveTo(0, s / 2); c.quadraticCurveTo(s * 0.06, 0, 0, -s / 2); c.stroke();
      const n = 5;
      for (let i = 0; i < n; i++) {
        const t = -s / 2 + (i + 0.6) * (s / (n + 0.4));
        const side = i % 2 ? 1 : -1;
        c.save(); c.translate(0, t); c.rotate(side * 0.75); c.translate(0, -s * 0.12);
        leafPath(c, s * 0.3, s * 0.1);
        c.fillStyle = tone; c.fill(); c.restore();
      }
      c.save(); c.translate(0, -s / 2); leafPath(c, s * 0.26, s * 0.09); c.fillStyle = tone; c.fill(); c.restore();
    },
  };
  const KINDS = ['salvia', 'salvia', 'eucalipto', 'ramo', 'ramo'];

  const spriteCache = new Map();
  function sprite(kind, size, tone, dpr) {
    const key = kind + size + tone + dpr;
    if (spriteCache.has(key)) return spriteCache.get(key);
    const pad = size * 0.8;
    const box = Math.ceil((size + pad) * dpr);
    const off = document.createElement('canvas');
    off.width = off.height = box;
    const c = off.getContext('2d');
    c.scale(dpr, dpr); c.translate((size + pad) / 2, (size + pad) / 2);
    drawers[kind](c, size, tone);
    spriteCache.set(key, off);
    return off;
  }

  let W = 0, H = 0, dpr = 1, leaves = [];

  function make(initial) {
    const kind = pick(KINDS);
    const size = Math.round(kind === 'ramo' ? rand(38, 58) : rand(18, 32));
    return {
      kind, size, tone: pick(TONES),
      x: rand(-20, W + 20),
      y: initial ? rand(-H, H) : rand(-80, -30),
      vy: rand(14, 30),                 // px/s: queda lenta
      sway: rand(18, 46), swayF: rand(0.25, 0.55), phase: rand(0, TAU),
      rot: rand(0, TAU), vr: rand(-0.5, 0.5),
      flipF: rand(0.4, 0.9),            // "virada" da folha (escala X)
      alpha: rand(0.55, 0.9),
    };
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    const target = Math.round(Math.min(18, Math.max(8, (W * H) / 60000)));
    while (leaves.length < target) leaves.push(make(true));
    leaves.length = target;
  }

  let last = 0, raf = 0, t = 0;
  function frame(now) {
    const dt = Math.min((now - (last || now)) / 1000, 0.05);
    last = now; t += dt;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const l of leaves) {
      l.y += l.vy * dt;
      l.rot += l.vr * dt;
      const sx = l.x + Math.sin(t * l.swayF + l.phase) * l.sway;
      if (l.y > H + 60) Object.assign(l, make(false));

      const img = sprite(l.kind, l.size, l.tone, dpr);
      const flip = Math.cos(t * l.flipF + l.phase);
      ctx.globalAlpha = l.alpha;
      ctx.setTransform(dpr, 0, 0, dpr, sx * dpr, l.y * dpr);
      ctx.rotate(l.rot + Math.sin(t * l.swayF + l.phase) * 0.5);
      ctx.scale(0.35 + 0.65 * Math.abs(flip), 1);
      const s = img.width / dpr;
      ctx.drawImage(img, -s / 2, -s / 2, s, s);
    }
    raf = requestAnimationFrame(frame);
  }

  function start() { if (!raf) { last = 0; raf = requestAnimationFrame(frame); } }
  function stop() { cancelAnimationFrame(raf); raf = 0; }

  resize();
  let rT;
  window.addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(resize, 150); });
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  reduce.addEventListener?.('change', (e) => { if (e.matches) { stop(); canvas.remove(); } });
  start();
})();
