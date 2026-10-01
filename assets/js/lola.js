/* Lola Lourdes — a cachorrinha da Maju, em pixel, andando na borda do rodapé.
   Anda, para abanando o rabo, cochila; com clique/toque dá um pulinho e solta um coração.
   Só roda quando o rodapé está na tela. Com movimento reduzido fica parada (mas ainda responde). */
(() => {
  const track = document.querySelector('[data-lola]');
  if (!track) return;

  const PX = 2; // tamanho de cada pixel do desenho na tela
  const PAL = {
    K: '#3a3530', W: '#faf7f1', S: '#e2d9ca', B: '#a06034', b: '#7a4626',
    E: '#221e1c', N: '#342622', P: '#e2a096', R: '#c9675a',
  };
  const HEAD = [
    '............K...K.....',
    '...........KbK.KPK....',
    '...........KbbKKPWK...',
    '...........KBBBBWWWK..',
  ];
  const BODY_LOW = [
    '..KWBBWWWWWWWWWWWWK...',
    '..KBBBWWWWWWWWWWWSK...',
    '..KWBWWWWWWWWWWWSSK...',
    '...KWKKKWKKKWKKKWK....',
    '...KWK.KWK.KWK.KWK....',
  ];
  const TAIL_UP = [
    '.K........KBBEBBWWWWK.',
    'KWK.......KWBBBWWWWWNK',
    'KWK..KKKKKKWWWWWWWWK..',
    '.KWKKWWWWWWWWWWWWWK...',
    '..KWWWWWWWWWWWWWWWK...',
  ];
  const TAIL_SIDE = [
    '..........KBBEBBWWWWK.',
    '..........KWBBBWWWWWNK',
    'KKK..KKKKKKWWWWWWWWK..',
    'KWWKKWWWWWWWWWWWWWK...',
    '.KKWWWWWWWWWWWWWWWK...',
  ];
  const FRAMES = {
    walk1: [...HEAD, ...TAIL_UP, ...BODY_LOW, '...KWK.KWK.KWK.KWK....', '...KKK.KKK.KKK.KKK....'],
    walk2: [...HEAD, ...TAIL_UP, ...BODY_LOW, '...KKK.KWK.KKK.KWK....', '.......KKK.....KKK....'],
    idle:  [...HEAD, ...TAIL_SIDE, ...BODY_LOW, '...KWK.KWK.KWK.KWK....', '...KKK.KKK.KKK.KKK....'],
    sleep: [
      '......................', '......................', '......................', '......................',
      ...HEAD,
      '..........KBKKBBWWWWK.',
      '..........KWBBBWWWWWNK',
      'KKK..KKKKKKWWWWWWWWK..',
      'KWWKKWWWWWWWWWWWWWK...',
      '.KKWWWWWWWWWWWWWWWK...',
      '..KWBBWWWWWWWWWWWWK...',
      '..KBBBWWWWWWWWWWWSK...',
      '..KKKKKKKKKKKKKKKWWWK.',
    ],
  };
  const HEART = ['.KK.KK.', 'KRRKRRK', 'KRRRRRK', '.KRRRK.', '..KRK..', '...K...'];
  const ZED = ['KKK', '..K', '.K.', 'K..', 'KKK'];

  function paint(rows, flip) {
    const h = rows.length, w = rows[0].length;
    const c = document.createElement('canvas');
    c.width = w * PX; c.height = h * PX;
    const g = c.getContext('2d');
    rows.forEach((row, y) => {
      [...row].forEach((ch, x) => {
        if (ch === '.') return;
        g.fillStyle = PAL[ch];
        g.fillRect((flip ? w - 1 - x : x) * PX, y * PX, PX, PX);
      });
    });
    return c;
  }
  const sprites = {};
  for (const [k, rows] of Object.entries(FRAMES)) {
    sprites[k] = paint(rows, false);
    sprites[k + '_l'] = paint(rows, true);
  }
  const W = sprites.walk1.width, H = sprites.walk1.height;

  // DOM
  const dog = document.createElement('button');
  dog.type = 'button';
  dog.className = 'lola__dog';
  dog.setAttribute('aria-label', 'Lola Lourdes, a cachorrinha da Maju. Clique para fazer carinho.');
  dog.title = 'Lola Lourdes';
  const view = document.createElement('canvas');
  view.width = W; view.height = H;
  view.style.width = W + 'px'; view.style.height = H + 'px';
  dog.appendChild(view);
  track.appendChild(dog);
  const vctx = view.getContext('2d');

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rand = (a, b) => a + Math.random() * (b - a);

  let x = 0, dir = 1, state = 'idle', until = 0, frameT = 0, frameA = false;
  let hop = 0; // 0..1 enquanto pula
  let running = false, raf = 0, last = 0, zTimer = 0, petCount = 0;

  function maxX() { return Math.max(0, track.clientWidth - W); }

  function setState(s, now) {
    state = s;
    if (s === 'walk') { until = now + rand(4000, 9000); if (Math.random() < 0.35) dir *= -1; }
    if (s === 'idle') until = now + rand(1800, 4200);
    if (s === 'sleep') until = now + rand(7000, 12000);
  }

  function nextState(now) {
    if (state === 'walk') setState(Math.random() < 0.18 ? 'sleep' : 'idle', now);
    else setState('walk', now);
  }

  function draw() {
    let key = 'idle';
    if (state === 'walk') key = frameA ? 'walk2' : 'walk1';
    else if (state === 'sleep') key = 'sleep';
    else key = frameA ? 'idle' : 'walk1';      // abanando o rabo
    vctx.clearRect(0, 0, W, H);
    vctx.drawImage(sprites[dir > 0 ? key : key + '_l'], 0, 0);
    const lift = hop ? Math.sin(hop * Math.PI) * 10 : 0;
    dog.style.transform = `translate3d(${Math.round(x)}px, ${-Math.round(lift)}px, 0)`;
  }

  function puff(rows, cls) {
    const c = paint(rows, false);
    c.className = 'lola__fx ' + cls;
    c.style.left = Math.round(x + (dir > 0 ? W - 14 : 4)) + 'px';
    track.appendChild(c);
    c.addEventListener('animationend', () => c.remove(), { once: true });
  }

  function tick(now) {
    const dt = Math.min((now - (last || now)) / 1000, 0.05);
    last = now;
    if (!until) setState('idle', now);

    if (state === 'walk') {
      x += dir * 16 * dt; // passo lento
      if (x <= 0) { x = 0; dir = 1; }
      if (x >= maxX()) { x = maxX(); dir = -1; }
    }
    if (state === 'sleep' && now > zTimer) { puff(ZED, 'lola__fx--z'); zTimer = now + 1600; }

    const step = state === 'walk' ? 200 : state === 'idle' ? 260 : 99999;
    if (now - frameT > step) { frameA = !frameA; frameT = now; }

    if (hop) { hop += dt / 0.38; if (hop >= 1) hop = 0; }
    if (now > until && !hop) nextState(now);

    draw();
    raf = requestAnimationFrame(tick);
  }

  function start() { if (!running && !reduce) { running = true; last = 0; raf = requestAnimationFrame(tick); } }
  function stop() { running = false; cancelAnimationFrame(raf); }

  dog.addEventListener('click', () => {
    const now = performance.now();
    petCount++;
    if (state === 'sleep') setState('idle', now);
    if (!reduce) hop = 0.001;
    else { frameA = !frameA; draw(); }
    puff(HEART, 'lola__fx--heart');
    if (petCount === 1 || petCount % 7 === 0) {
      const tag = document.createElement('span');
      tag.className = 'lola__tag';
      tag.textContent = petCount === 1 ? 'Lola' : 'Lola ♥';
      tag.style.left = Math.round(x + W / 2) + 'px';
      track.appendChild(tag);
      tag.addEventListener('animationend', () => tag.remove(), { once: true });
    }
    if (state === 'walk') setState('idle', now);
  });

  // posição inicial e estado parado (também é o visual com movimento reduzido)
  x = Math.round(maxX() * 0.72);
  dir = -1;
  draw();

  let inView = false;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => { inView = e.isIntersecting; inView ? start() : stop(); }).observe(track);
  }
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : inView && start()));
  window.addEventListener('resize', () => { x = Math.min(x, maxX()); draw(); });
})();
