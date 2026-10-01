/* Lola Lourdes — a cachorrinha da Maju, em pixel, andando na borda do rodapé.
   Quadros: assets/img/lola-walk.png (8 quadros 62×62, gerados no SpriteCook a partir da referência
   e reduzidos a 1/3). Anda, para respirando; com clique/toque dá um pulinho e solta um coração.
   Só roda com o rodapé visível. Com movimento reduzido fica parada (mas ainda responde). */
(() => {
  const track = document.querySelector('[data-lola]');
  if (!track) return;

  const FW = 62, FH = 62, FRAMES = 8, FPS = 9;
  const SPEED = 15; // px/s
  const PX = 2;     // pixel dos efeitos (coração)
  const FX_PAL = { K: '#2b1a14', H: '#c9675a' };
  const HEART = ['.KK.KK.', 'KHHKHHK', 'KHHHHHK', '.KHHHK.', '..KHK..', '...K...'];

  const sheet = new Image();
  sheet.src = 'assets/img/lola-walk.png';

  // DOM
  const dog = document.createElement('button');
  dog.type = 'button';
  dog.className = 'lola__dog';
  dog.setAttribute('aria-label', 'Lola Lourdes, a cachorrinha da Maju. Clique para fazer carinho.');
  dog.title = 'Lola Lourdes';
  const view = document.createElement('canvas');
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  view.width = FW * dpr; view.height = FH * dpr;
  view.style.width = FW + 'px'; view.style.height = FH + 'px';
  dog.appendChild(view);
  track.appendChild(dog);
  const vctx = view.getContext('2d');
  vctx.imageSmoothingEnabled = false;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rand = (a, b) => a + Math.random() * (b - a);

  let x = 0, dir = -1, state = 'idle', until = 0, fi = 0, frameT = 0, t = 0;
  let hop = 0, running = false, raf = 0, last = 0, petCount = 0;

  const maxX = () => Math.max(0, track.clientWidth - FW);

  function setState(s, now) {
    state = s;
    if (s === 'walk') { until = now + rand(4000, 9000); if (Math.random() < 0.35) dir *= -1; }
    else until = now + rand(2000, 4500);
  }

  function draw() {
    if (!sheet.complete || !sheet.naturalWidth) return;
    const f = state === 'walk' ? fi % FRAMES : 0;
    vctx.setTransform(1, 0, 0, 1, 0, 0);
    vctx.clearRect(0, 0, view.width, view.height);
    // o desenho original olha para a direita; espelha para andar à esquerda
    if (dir < 0) vctx.setTransform(-1, 0, 0, 1, view.width, 0);
    vctx.drawImage(sheet, f * FW, 0, FW, FH, 0, 0, view.width, view.height);
    const lift = hop ? Math.sin(hop * Math.PI) * 12 : 0;
    const breathe = state === 'idle' && !hop && !reduce ? (Math.sin(t * 3) > 0.6 ? 1 : 0) : 0;
    dog.style.transform = `translate3d(${Math.round(x)}px, ${-Math.round(lift) + breathe}px, 0)`;
  }

  function paintFx(rows) {
    const c = document.createElement('canvas');
    c.width = rows[0].length * PX; c.height = rows.length * PX;
    const g = c.getContext('2d');
    rows.forEach((row, y) => [...row].forEach((ch, xx) => {
      if (ch === '.') return;
      g.fillStyle = FX_PAL[ch]; g.fillRect(xx * PX, y * PX, PX, PX);
    }));
    return c;
  }

  function puff() {
    const c = paintFx(HEART);
    c.className = 'lola__fx lola__fx--heart';
    c.style.left = Math.round(x + (dir > 0 ? FW - 22 : 8)) + 'px';
    track.appendChild(c);
    c.addEventListener('animationend', () => c.remove(), { once: true });
  }

  function tick(now) {
    const dt = Math.min((now - (last || now)) / 1000, 0.05);
    last = now; t += dt;
    if (!until) setState('idle', now);

    if (state === 'walk') {
      x += dir * SPEED * dt;
      if (x <= 0) { x = 0; dir = 1; }
      if (x >= maxX()) { x = maxX(); dir = -1; }
      if (now - frameT > 1000 / FPS) { fi++; frameT = now; }
    }
    if (hop) { hop += dt / 0.4; if (hop >= 1) hop = 0; }
    if (now > until && !hop) setState(state === 'walk' ? 'idle' : 'walk', now);

    draw();
    raf = requestAnimationFrame(tick);
  }

  function start() { if (!running && !reduce) { running = true; last = 0; raf = requestAnimationFrame(tick); } }
  function stop() { running = false; cancelAnimationFrame(raf); }

  dog.addEventListener('click', () => {
    const now = performance.now();
    petCount++;
    setState('idle', now);
    until = now + 2400;
    if (!reduce) hop = 0.001;
    puff();
    if (petCount === 1 || petCount % 7 === 0) {
      const tag = document.createElement('span');
      tag.className = 'lola__tag';
      tag.textContent = petCount === 1 ? 'Lola' : 'Lola ♥';
      tag.style.left = Math.round(x + FW / 2) + 'px';
      track.appendChild(tag);
      tag.addEventListener('animationend', () => tag.remove(), { once: true });
    }
    draw();
  });

  // posição inicial (também é o visual com movimento reduzido)
  x = Math.round(maxX() * 0.72);
  sheet.addEventListener('load', draw);
  draw();

  let inView = false;
  const setView = (v) => { inView = v; v ? start() : stop(); };
  // reserva: confere a posição na rolagem (alguns navegadores atrasam o observer)
  const checkView = () => {
    const r = track.getBoundingClientRect();
    const v = r.bottom > -100 && r.top < window.innerHeight + 100;
    if (v !== inView) setView(v);
  };
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => setView(e.isIntersecting), { rootMargin: '100px 0px' }).observe(track);
  }
  window.addEventListener('scroll', checkView, { passive: true });
  checkView();
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : inView && start()));
  window.addEventListener('resize', () => { x = Math.min(x, maxX()); draw(); });
})();
