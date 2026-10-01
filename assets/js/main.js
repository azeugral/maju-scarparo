/* Maria Julia Scarparo — LRGZ · sem dependências */
(() => {
  const root = document.documentElement;
  root.classList.add('js');

  // Reveal on scroll
  const items = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add('is-in'));
  }

  // Header: fio ao rolar
  const header = document.querySelector('[data-header]');
  const onScroll = () => header && header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Barra "Agendar" no celular: aparece depois do hero, some no CTA final
  const dock = document.querySelector('[data-dock]');
  const hero = document.querySelector('.hero');
  const cta = document.querySelector('.cta');
  if (dock && hero && cta && 'IntersectionObserver' in window) {
    let pastHero = false, atCta = false;
    const sync = () => dock.classList.toggle('is-on', pastHero && !atCta);
    new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting; sync(); }).observe(hero);
    new IntersectionObserver(([e]) => { atCta = e.isIntersecting; sync(); }).observe(cta);
  }

  // Ano no rodapé
  const y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();
})();
