import './style.css';
import { initLenis } from './utils/lenis-init.js';
import { initGSAP } from './animations/gsap-init.js';
import { initCursor } from './animations/cursor.js';
import { initWebGLShader } from './three/image-shader.js';
import { initHoverBugs } from './animations/hover-bug.js';
import { initScrollMatrix } from './animations/scroll-matrix.js';
import { initCards } from './animations/cards.js';
import { initMagneticGrids } from './animations/magnetic-grid.js';
import { initVideoScrub } from './animations/video-scrub.js';
import { initPricingTickets } from './animations/pricing-tickets.js';
import { initTerminalTypewriter } from './animations/terminal-typewriter.js';
import { initContactMagnet } from './animations/contact-magnet.js';
import { initContactFinale } from './animations/contact-finale.js';

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function withTimeout(promise, ms) {
  return Promise.race([promise, wait(ms)]);
}

function waitForWindowLoad() {
  if (document.readyState === 'complete') return Promise.resolve();
  return new Promise(resolve => window.addEventListener('load', resolve, { once: true }));
}

async function preloadImages() {
  const images = Array.from(document.images);
  await Promise.all(images.map(image => {
    if (image.complete) return Promise.resolve();
    if (image.decode) return image.decode().catch(() => {});
    return new Promise(resolve => {
      image.addEventListener('load', resolve, { once: true });
      image.addEventListener('error', resolve, { once: true });
    });
  }));
}

async function preloadVideos() {
  const videos = Array.from(document.querySelectorAll('video'));
  await Promise.all(videos.map(video => new Promise(resolve => {
    if (video.readyState >= 1) {
      resolve();
      return;
    }

    const done = () => resolve();
    video.addEventListener('loadedmetadata', done, { once: true });
    video.addEventListener('error', done, { once: true });
    video.load();
    setTimeout(done, 1800);
  })));
}

async function runLoader() {
  const loader = document.querySelector('.loader');
  const counter = document.querySelector('.loader__counter');
  const fill = document.querySelector('.loader__bar-fill');
  const telemetry = document.querySelector('.loader__telemetry');

  if (!loader || !counter || !fill) {
    document.body.classList.remove('loading');
    window.dispatchEvent(new Event('app:loader-complete'));
    return;
  }

  const setProgress = (value, label) => {
    const progress = Math.min(100, Math.max(0, Math.round(value)));
    counter.innerText = `${progress}%`;
    fill.style.width = `${progress}%`;
    if (telemetry && label) telemetry.innerText = label;
  };

  const tasks = [
    { progress: 18, label: 'INICIALIZANDO NÚCLEO VISUAL', run: () => wait(350) },
    { progress: 42, label: 'CARREGANDO FONTES E INTERFACE', run: () => withTimeout(document.fonts?.ready || Promise.resolve(), 1800) },
    { progress: 68, label: 'RENDERIZANDO ATIVOS NA MEMÓRIA', run: () => withTimeout(Promise.all([preloadImages(), preloadVideos()]), 2200) },
    { progress: 88, label: 'AQUECENDO SHADERS E MATRIZ', run: () => wait(450) },
    { progress: 100, label: 'SISTEMA PRONTO', run: () => withTimeout(waitForWindowLoad(), 1200) },
  ];

  setProgress(0, 'SINCRONIZANDO PAINEL ORBITAL');
  const startedAt = performance.now();

  for (const task of tasks) {
    await task.run();
    setProgress(task.progress, task.label);
  }

  const elapsed = performance.now() - startedAt;
  if (elapsed < 1600) await wait(1600 - elapsed);

  loader.classList.add('is-done');
  await wait(900);
  window.dispatchEvent(new Event('app:loader-complete'));
  document.body.classList.remove('loading');
}

async function initApp() {
  // Acessibilidade: respeita quem odeia muita animação
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // initLenis(); // Disabled for Slide Mode Test
  initGSAP();
  initCursor();
  initHoverBugs();
  initScrollMatrix();
  initCards();
  initMagneticGrids();
  initVideoScrub();

  // Pricing tickets (P4) — bind clicks for ticket → pane switching
  document.querySelectorAll('.pricing-section').forEach(section => {
    initPricingTickets(section);
  });

  // Terminal typewriter (P2 Card 1)
  initTerminalTypewriter();

  // Contact cinematic (P6)
  initContactMagnet();
  initContactFinale();

  if (!prefersReducedMotion) {
    initWebGLShader();
  }

  runLoader();
}

document.addEventListener('DOMContentLoaded', initApp);
