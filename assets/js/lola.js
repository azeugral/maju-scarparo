/* Lola Lourdes — a cachorrinha da Maju, em pixel, andando na borda do rodapé.
   Caminhada em 4 tempos (patas alternadas), rabo abanando, cochilo; com clique/toque dá um pulinho e solta um coração.
   Desenhos gerados por scratchpad/lola/lola2.py (contorno automático). Só roda com o rodapé visível. */
(() => {
  const track = document.querySelector('[data-lola]');
  if (!track) return;

  const PX = 2; // tamanho de cada pixel do desenho na tela
  const PAL = {"K": "#2b1a14", "W": "#fbf8f2", "S": "#d6c8b6", "B": "#b06830", "D": "#7a401c", "P": "#ec9c94", "E": "#1c100c", "G": "#ffffff", "N": "#463430", "R": "#c84036"};
  const FRAMES = {
    walk1: [
      '..........................',
      '...........KKK......KK....',
      '..........KWWWK....KDDK...',
      '.K........KWPWKKKKKDBBK...',
      'KWK.......KWPPWWWWDDBK....',
      'KWK........KWWDDDBBWWK....',
      '.KWK.......KWDDDEEBWWWK...',
      '.KWK.......KWDDBEGWWWWNK..',
      '.KWKK......KWWDBBWWWWWK...',
      '..KWWK......KWWWWWWWWK....',
      '..KWWKKKKKKKKKWWWWWKK.....',
      '...KWWWWWWWRWKKKKKK.......',
      '..KWWWWWWWWWRWK...........',
      '..KWWWWWWWWWRRK...........',
      '..KWWWWWWWWWWRK...........',
      '...KSWWWWWWWSKK...........',
      '....KSWWKKKSSWWK..........',
      '....KSWWK.KSSWWK..........',
      '....KWWSKKSSKKWWK.........',
      '...KWWSSKKSSK.KWWK........',
      '....KKKK..KK...KK.........',
    ],
    walk2: [
      '...........KKK......KK....',
      '..........KWWWK....KDDK...',
      'K.........KWPWKKKKKDBBK...',
      'WK........KWPPWWWWDDBK....',
      'WK.........KWWDDDBBWWK....',
      'KWK........KWDDDEEBWWWK...',
      'KWK........KWDDBEGWWWWNK..',
      '.KWK.......KWWDBBWWWWWK...',
      '.KWWK.......KWWWWWWWWK....',
      '..KWWKKKKKKKKKWWWWWKK.....',
      '...KWWWWWWWRWKKKKKK.......',
      '..KWWWWWWWWWRWK...........',
      '..KWWWWWWWWWRRK...........',
      '..KWWWWWWWWWWRK...........',
      '...KSWWWWWWWSK............',
      '....KKKKKKKKKKK...........',
      '....KSSWWK.KSWWK..........',
      '....KSSWWK.KSSWWK.........',
      '....KSSKWWKKSSWWK.........',
      '....KSSKKK.KSSKK..........',
      '.....KK.....KK............',
    ],
    walk3: [
      '..........................',
      '...........KKK......KK....',
      '..........KWWWK....KDDK...',
      '.K........KWPWKKKKKDBBK...',
      'KWK.......KWPPWWWWDDBK....',
      'KWK........KWWDDDBBWWK....',
      '.KWK.......KWDDDEEBWWWK...',
      '.KWK.......KWDDBEGWWWWNK..',
      '.KWKK......KWWDBBWWWWWK...',
      '..KWWK......KWWWWWWWWK....',
      '..KWWKKKKKKKKKWWWWWKK.....',
      '...KWWWWWWWRWKKKKKK.......',
      '..KWWWWWWWWWRWK...........',
      '..KWWWWWWWWWRRK...........',
      '..KWWWWWWWWWWRK...........',
      '...KSWWWWWWWSKK...........',
      '...KSSWWKKKSSWWK..........',
      '...KSSKWWK.KSWWK..........',
      '..KSSKKWWK.KWWK...........',
      '..KSSK.KWWKWWSSK..........',
      '...KK...KK.KKKK...........',
    ],
    walk4: [
      '...........KKK......KK....',
      '..........KWWWK....KDDK...',
      'K.........KWPWKKKKKDBBK...',
      'WK........KWPPWWWWDDBK....',
      'WK.........KWWDDDBBWWK....',
      'KWK........KWDDDEEBWWWK...',
      'KWK........KWDDBEGWWWWNK..',
      '.KWK.......KWWDBBWWWWWK...',
      '.KWWK.......KWWWWWWWWK....',
      '..KWWKKKKKKKKKWWWWWKK.....',
      '...KWWWWWWWRWKKKKKK.......',
      '..KWWWWWWWWWRWK...........',
      '..KWWWWWWWWWRRK...........',
      '..KWWWWWWWWWWRK...........',
      '...KSWWWWWWWSK............',
      '....KKKKKKKKKKK...........',
      '...KSSWWK.KSSWWK..........',
      '....KSWWK.KSSWWK..........',
      '....KSWWK..KSWWK..........',
      '.....KWWK...KWWK..........',
      '......KK.....KK...........',
    ],
    wag1: [
      '..........................',
      '...........KKK......KK....',
      '..........KWWWK....KDDK...',
      '.K........KWPWKKKKKDBBK...',
      'KWK.......KWPPWWWWDDBK....',
      'KWK........KWWDDDBBWWK....',
      '.KWK.......KWDDDEEBWWWK...',
      '.KWK.......KWDDBEGWWWWNK..',
      '.KWKK......KWWDBBWWWWWK...',
      '..KWWK......KWWWWWWWWK....',
      '..KWWKKKKKKKKKWWWWWKK.....',
      '...KWWWWWWWRWKKKKKK.......',
      '..KWWWWWWWWWRWK...........',
      '..KWWWWWWWWWRRK...........',
      '..KWWWWWWWWWWRK...........',
      '...KSWWWWWWWSKK...........',
      '...KSSWWKKKSSWWK..........',
      '...KSSWWK.KSSWWK..........',
      '...KSSWWK.KSSWWK..........',
      '...KSSWWK.KSSWWK..........',
      '....KKKK...KKKK...........',
    ],
    wag2: [
      '..........................',
      '...........KKK......KK....',
      '..........KWWWK....KDDK...',
      'K.........KWPWKKKKKDBBK...',
      'WK........KWPPWWWWDDBK....',
      'WK.........KWWDDDBBWWK....',
      'KWK........KWDDDEEBWWWK...',
      'KWK........KWDDBEGWWWWNK..',
      '.KWK.......KWWDBBWWWWWK...',
      '.KWWK.......KWWWWWWWWK....',
      '..KWWKKKKKKKKKWWWWWKK.....',
      '...KWWWWWWWRWKKKKKK.......',
      '..KWWWWWWWWWRWK...........',
      '..KWWWWWWWWWRRK...........',
      '..KWWWWWWWWWWRK...........',
      '...KSWWWWWWWSKK...........',
      '...KSSWWKKKSSWWK..........',
      '...KSSWWK.KSSWWK..........',
      '...KSSWWK.KSSWWK..........',
      '...KSSWWK.KSSWWK..........',
      '....KKKK...KKKK...........',
    ],
    wag3: [
      '..........................',
      '...........KKK......KK....',
      '..........KWWWK....KDDK...',
      '..........KWPWKKKKKDBBK...',
      '..........KWPPWWWWDDBK....',
      'K..........KWWDDDBBWWK....',
      'WK.........KWDDDEEBWWWK...',
      'WK.........KWDDBEGWWWWNK..',
      'WK.........KWWDBBWWWWWK...',
      'KWKK........KWWWWWWWWK....',
      'KWWWKKKKKKKKKKWWWWWKK.....',
      '.KKWWWWWWWWRWKKKKKK.......',
      '..KWWWWWWWWWRWK...........',
      '..KWWWWWWWWWRRK...........',
      '..KWWWWWWWWWWRK...........',
      '...KSWWWWWWWSKK...........',
      '...KSSWWKKKSSWWK..........',
      '...KSSWWK.KSSWWK..........',
      '...KSSWWK.KSSWWK..........',
      '...KSSWWK.KSSWWK..........',
      '....KKKK...KKKK...........',
    ],
    sleep: [
      '..........................',
      '..........................',
      '..........................',
      '..........................',
      '..........................',
      '..........................',
      '..........................',
      '..........................',
      '..........................',
      '...........KKK......KK....',
      '..........KWWWK....KDDK...',
      '..........KWPWKKKKKDBBK...',
      '..........KWPPWWWWDDBK....',
      '...........KWWDDDBBWWK....',
      '...........KWDDDBBBWWWK...',
      '....KKKKKKKKWDDBEEWWWWNK..',
      '..KKWWWWWWWWWWDBBWWWWWK...',
      '.KWWWWWWWWWWWWWWWWWWWK....',
      'KWKWWWWWWWWWRWWWWWWKK.....',
      'KWWWWWWWWWWWWRKWWWWK......',
      '.KKKKKKKKKKKKK.KKKK.......',
    ],
  };
  PAL.H = '#c9675a'; // coração
  const HEART = ['.KK.KK.', 'KHHKHHK', 'KHHHHHK', '.KHHHK.', '..KHK..', '...K...'];
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
  const WALK = ['walk1', 'walk2', 'walk3', 'walk4'];
  const WAG = ['wag1', 'wag2', 'wag3', 'wag2'];

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

  let x = 0, dir = 1, state = 'idle', until = 0, frameT = 0, fi = 0;
  let hop = 0, excited = 0; // pulinho e rabo acelerado depois do carinho
  let running = false, raf = 0, last = 0, zTimer = 0, petCount = 0;

  function maxX() { return Math.max(0, track.clientWidth - W); }

  function setState(s, now) {
    state = s; fi = 0;
    if (s === 'walk') { until = now + rand(4000, 9000); if (Math.random() < 0.35) dir *= -1; }
    if (s === 'idle') until = now + rand(1800, 4200);
    if (s === 'sleep') until = now + rand(7000, 12000);
  }

  function nextState(now) {
    if (state === 'walk') setState(Math.random() < 0.2 ? 'sleep' : 'idle', now);
    else setState('walk', now);
  }

  function draw() {
    const key = state === 'walk' ? WALK[fi % 4] : state === 'sleep' ? 'sleep' : WAG[fi % 4];
    vctx.clearRect(0, 0, W, H);
    vctx.drawImage(sprites[dir > 0 ? key : key + '_l'], 0, 0);
    const lift = hop ? Math.sin(hop * Math.PI) * 10 : 0;
    dog.style.transform = `translate3d(${Math.round(x)}px, ${-Math.round(lift)}px, 0)`;
  }

  function puff(rows, cls) {
    const c = paint(rows, false);
    c.className = 'lola__fx ' + cls;
    c.style.left = Math.round(x + (dir > 0 ? W - 16 : 6)) + 'px';
    track.appendChild(c);
    c.addEventListener('animationend', () => c.remove(), { once: true });
  }

  function tick(now) {
    const dt = Math.min((now - (last || now)) / 1000, 0.05);
    last = now;
    if (!until) setState('idle', now);

    if (state === 'walk') {
      x += dir * 18 * dt; // passo lento
      if (x <= 0) { x = 0; dir = 1; }
      if (x >= maxX()) { x = maxX(); dir = -1; }
    }
    if (state === 'sleep' && now > zTimer) { puff(ZED, 'lola__fx--z'); zTimer = now + 1600; }

    // ritmo: patas a cada 150ms; rabo 140ms (60ms logo depois de um carinho)
    const step = state === 'walk' ? 150 : state === 'idle' ? (now < excited ? 60 : 140) : Infinity;
    if (now - frameT > step) { fi++; frameT = now; }

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
    setState('idle', now);
    until = now + 2600;
    excited = now + 1600;
    if (!reduce) hop = 0.001;
    else { fi++; draw(); }
    puff(HEART, 'lola__fx--heart');
    if (petCount === 1 || petCount % 7 === 0) {
      const tag = document.createElement('span');
      tag.className = 'lola__tag';
      tag.textContent = petCount === 1 ? 'Lola' : 'Lola ♥';
      tag.style.left = Math.round(x + W / 2) + 'px';
      track.appendChild(tag);
      tag.addEventListener('animationend', () => tag.remove(), { once: true });
    }
  });

  // posição inicial (também é o visual com movimento reduzido)
  x = Math.round(maxX() * 0.72);
  dir = -1;
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
