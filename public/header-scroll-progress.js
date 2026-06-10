(() => {
  if (window.__uvHeaderScrollProgressBound) return;
  window.__uvHeaderScrollProgressBound = true;

  const root = document.documentElement;
  let frame = 0;

  const clamp = (value) => Math.min(Math.max(value, 0), 1);

  const update = () => {
    frame = 0;

    const scroll_top = window.scrollY || root.scrollTop || document.body.scrollTop || 0;
    const scroll_height = Math.max(root.scrollHeight, document.body.scrollHeight);
    const max_scroll = Math.max(scroll_height - window.innerHeight, 0);
    const progress = max_scroll > 0 ? clamp(scroll_top / max_scroll) : 0;

    root.style.setProperty('--uv-scroll-progress', progress.toFixed(5));
  };

  const schedule = () => {
    if (frame) return;
    frame = window.requestAnimationFrame(update);
  };

  update();
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('load', schedule);
})();
