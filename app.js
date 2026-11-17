'use strict';
(() => {
  const root = document.documentElement;
  if (new URLSearchParams(location.search).get('embed') === '1') root.classList.add('is-embedded');
  const themeButton = document.querySelector('.theme-button');
  const storedTheme = (() => { try { return localStorage.getItem('jaewoo-theme'); } catch { return null; } })();
  if (storedTheme === 'light' || storedTheme === 'dark') root.dataset.theme = storedTheme;
  const themeLabel = () => themeButton.setAttribute('aria-label', `Switch to ${root.dataset.theme === 'dark' ? 'light' : 'dark'} theme`);
  themeLabel();
  themeButton.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('jaewoo-theme', root.dataset.theme); } catch { /* Theme also works when storage is unavailable. */ }
    themeLabel();
    drawSurface();
  });
  document.querySelector('#year').textContent = new Date().getFullYear();
  document.querySelector('.publication-toolbar').hidden = false;
  const papers = [...document.querySelectorAll('.paper')];
  const search = document.querySelector('#paper-search');
  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  let activeFilter = 'all';
  let topic = '';
  function filterPapers() {
    const query = search.value.trim().toLocaleLowerCase();
    let count = 0;
    papers.forEach(paper => {
      const matches = (activeFilter === 'all' || paper.dataset.status === activeFilter) && (!topic || paper.dataset.topics.split(' ').includes(topic)) && `${paper.textContent} ${paper.dataset.topics}`.toLocaleLowerCase().includes(query);
      paper.hidden = !matches;
      if (matches) count++;
    });
    document.querySelector('.empty-state').hidden = count !== 0;
    document.querySelector('#paper-status').textContent = `Showing ${count} of ${papers.length} papers${topic ? ` in ${topic}` : ''}.`;
    filterButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === activeFilter)));
  }
  filterButtons.forEach(button => button.addEventListener('click', () => { activeFilter = button.dataset.filter; topic = ''; filterPapers(); }));
  search.addEventListener('input', () => { topic = ''; filterPapers(); });
  document.querySelectorAll('[data-topic-link]').forEach(link => link.addEventListener('click', () => {
    activeFilter = 'all'; topic = link.dataset.topicLink; search.value = topic; topic = ''; filterPapers();
  }));
  const copyButton = document.querySelector('.copy-email');
  copyButton.hidden = false;
  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('jaewoojung@dgist.ac.kr');
      copyButton.textContent = 'Email address copied ✓';
      document.querySelector('#copy-status').textContent = 'Email address copied to clipboard.';
      setTimeout(() => { copyButton.textContent = 'Copy email address ⧉'; }, 2500);
    } catch {
      document.querySelector('#copy-status').textContent = 'Copy is unavailable. Select the email address to copy it.';
      copyButton.textContent = 'Select the email address above to copy';
    }
  });
  // A genuine quadratic surface: (x, y, z) = (u, v, (u² − v²) / 2).
  // No external graphics library; the page also works under a GitHub project path.
  const canvas = document.querySelector('#surface');
  const context = canvas.getContext('2d');
  const motionButton = document.querySelector('#motion-toggle');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reducedMotion.matches;
  let angle = -.45;
  let width = 0;
  let height = 0;
  let frame = 0;
  let previousTime = 0;
  let visible = true;
  const lines = [];
  const bound = 1.25;
  for (let i = 0; i <= 28; i++) {
    const fixed = -bound + 2 * bound * i / 28;
    for (let direction = 0; direction < 2; direction++) {
      const points = [];
      for (let j = 0; j <= 70; j++) {
        const changing = -bound + 2 * bound * j / 70;
        const x = direction ? changing : fixed;
        const y = direction ? fixed : changing;
        points.push([x, y, (x*x-y*y)/2]);
      }
      lines.push({ points, direction, major: i % 7 === 0 });
    }
  }
  function project(point) {
    const [x,y,z] = point;
    const xr = x * Math.cos(angle) - y * Math.sin(angle);
    const yr = x * Math.sin(angle) + y * Math.cos(angle);
    const tilt = .57;
    const depth = yr * Math.cos(tilt) - z * Math.sin(tilt);
    const vertical = yr * Math.sin(tilt) + z * Math.cos(tilt);
    const scale = Math.min(width, height) * .235 * 4.5 / (4.5 + depth * .28);
    return [width*.5 + xr*scale, height*.52 - vertical*scale, depth];
  }
  function drawSurface() {
    if (!context || !width) return;
    context.clearRect(0,0,width,height);
    const dark = root.dataset.theme === 'dark';
    const color = dark ? '194,216,155' : '54,96,55';
    const glow = context.createRadialGradient(width*.5,height*.52,10,width*.5,height*.52,width*.43);
    glow.addColorStop(0,dark ? 'rgba(160,190,115,.08)' : 'rgba(88,125,50,.05)');
    glow.addColorStop(1,'rgba(140,170,100,0)');
    context.fillStyle = glow; context.fillRect(0,0,width,height);
    const projected = lines.map(line => ({...line, points:line.points.map(project)}));
    projected.sort((a,b) => b.points[35][2] - a.points[35][2]);
    for (const line of projected) {
      context.beginPath();
      line.points.forEach((p,i) => i ? context.lineTo(p[0],p[1]) : context.moveTo(p[0],p[1]));
      const alpha = line.major ? .9 : line.direction ? .47 : .35;
      context.strokeStyle = `rgba(${color},${alpha})`;
      context.lineWidth = line.major ? 1.05 : .65;
      context.stroke();
    }
    for (const point of [[0,0,0],[-bound,-bound,0],[bound,bound,0]]) {
      const p = project(point); context.beginPath();context.arc(p[0],p[1],2.4,0,Math.PI*2);context.fillStyle=`rgb(${color})`;context.fill();
    }
  }
  function resize() {
    const box = canvas.getBoundingClientRect();
    width = box.width; height = box.height;
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width*ratio); canvas.height = Math.round(height*ratio);
    if (context) context.setTransform(ratio,0,0,ratio,0,0);
    drawSurface();
  }
  function animate(time) {
    frame = 0;
    if (paused || !visible || document.hidden) return;
    if (previousTime) angle += Math.min(time-previousTime,50)*.00007;
    previousTime = time;
    drawSurface();
    frame = requestAnimationFrame(animate);
  }
  function updateMotion() {
    motionButton.setAttribute('aria-pressed',String(paused));
    motionButton.setAttribute('aria-label',paused ? 'Play surface animation' : 'Pause surface animation');
    motionButton.querySelector('.motion-icon').textContent = paused ? '▷' : 'Ⅱ';
    motionButton.querySelector('.motion-label').textContent = paused ? 'Play' : 'Pause';
    cancelAnimationFrame(frame); frame = 0; previousTime = 0;
    if (!paused && visible && !document.hidden) frame = requestAnimationFrame(animate);
  }
  motionButton.addEventListener('click',() => { paused = !paused; updateMotion(); });
  reducedMotion.addEventListener('change',event => { paused = event.matches; updateMotion(); });
  document.addEventListener('visibilitychange',updateMotion);
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => { visible = entries[0].isIntersecting;updateMotion(); }).observe(canvas);
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas); else window.addEventListener('resize',resize);
  resize(); updateMotion();
})();
