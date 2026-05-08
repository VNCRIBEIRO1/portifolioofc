import { gsap } from 'gsap';

const ROTATE_INTERVAL_MS = 5400;
const instances = new WeakMap();

function applyOffsets(folders, activeIndex) {
  const total = folders.length;
  folders.forEach((folder, i) => {
    const distance = (i - activeIndex + total) % total;
    folder.style.setProperty('--tab-offset', String(distance));
    folder.classList.toggle('folder--active', distance === 0);
  });
}

function setActiveDot(dots, activeIndex) {
  dots.forEach((dot, i) => {
    dot.classList.toggle('is-active', i === activeIndex);
  });
}

export function initFolderStack(root) {
  if (!root || instances.has(root)) return instances.get(root);

  const folders = Array.from(root.querySelectorAll('.folder'));
  const dots = Array.from(root.parentElement?.querySelectorAll('.folders__dot') || []);
  if (!folders.length) return null;

  let activeIndex = 0;
  let timer = null;
  let isPaused = false;

  function setActive(index) {
    activeIndex = ((index % folders.length) + folders.length) % folders.length;
    applyOffsets(folders, activeIndex);
    setActiveDot(dots, activeIndex);
  }

  function tick() {
    if (isPaused) return;
    setActive(activeIndex + 1);
  }

  function start() {
    stop();
    timer = setInterval(tick, ROTATE_INTERVAL_MS);
  }

  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function pause() {
    isPaused = true;
    stop();
  }

  function resume() {
    isPaused = false;
    start();
  }

  // Manual selection (tabs + dots)
  folders.forEach((folder, i) => {
    const tab = folder.querySelector('.folder__tab');
    if (tab) {
      tab.addEventListener('click', () => {
        setActive(i);
        if (!isPaused) start();
      });
    }
  });
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      setActive(i);
      if (!isPaused) start();
    });
  });

  // Hover pauses auto-rotate
  root.addEventListener('mouseenter', () => {
    if (timer) stop();
  });
  root.addEventListener('mouseleave', () => {
    if (!isPaused) start();
  });

  setActive(0);

  const api = { setActive, pause, resume, start, stop, get index() { return activeIndex; } };
  instances.set(root, api);
  return api;
}

export function getFolderStack(root) {
  return root ? instances.get(root) : null;
}

export async function revealFolders(section) {
  const root = section.querySelector('.folders');
  if (!root) return;

  const api = initFolderStack(root) || getFolderStack(root);
  const folders = root.querySelectorAll('.folder');
  const dots = section.querySelectorAll('.folders__dot');

  // Animate parent .folder only — never touch .folder__body opacity (CSS owns it)
  gsap.set(folders, { y: '40vh', opacity: 0 });
  gsap.set(dots, { opacity: 0, y: 10 });

  await new Promise(resolve => {
    gsap.to(folders, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.08,
      ease: 'expo.out',
      onComplete: resolve,
    });
  });

  // Clear inline opacity from GSAP so CSS layering rules govern from here on
  gsap.set(folders, { clearProps: 'opacity,y' });

  gsap.to(dots, { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out' });

  if (api) api.resume();
}

export async function hideFolders(section) {
  const root = section.querySelector('.folders');
  if (!root) return;

  const api = getFolderStack(root);
  if (api) api.pause();

  const folders = root.querySelectorAll('.folder');
  const dots = section.querySelectorAll('.folders__dot');

  await new Promise(resolve => {
    gsap.to([...folders, ...dots], {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: resolve,
    });
  });
}
