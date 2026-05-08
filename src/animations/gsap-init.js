import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { exitHeroTitle, resetHeroTitle, initHeroBug } from './hero-bug.js';
import {
  decodeMatrixReveals,
  eraseMatrixReveals,
  hideArsenalContent,
  resetArsenalContent,
  revealArsenalContent,
} from './arsenal-sequence.js';
import { revealWireframeContent, hideWireframeContent, resetWireframeContent } from './wireframe-build.js';
import { revealPricingTickets, hidePricingTickets } from './pricing-tickets.js';
import { revealProcessPipeline, hideProcessPipeline, resetProcessPipeline } from './process-pipeline.js';
import { revealContactCinema, hideContactCinema } from './contact-magnet.js';
import { revealContactFinale, hideContactFinale } from './contact-finale.js';

const HERO_INITIAL_TEXT = 'NÃO CONSTRUÍMOS APENAS SITES.';
const HERO_FINAL_TEXT = 'PROJETAMOS ATIVOS DIGITAIS IMERSIVOS DE ALTA PERFORMANCE PARA MARCAS QUE NÃO ACEITAM O PADRÃO';

function wait(ms) {
  return ms > 0 ? new Promise(resolve => setTimeout(resolve, ms)) : Promise.resolve();
}

export function initGSAP() {
  gsap.registerPlugin(ScrollTrigger);

  // --- SLIDE MODE CONTROLLER ---
  const slides = document.querySelectorAll('[data-slide]');
  const nextBtn = document.getElementById('next-btn');
  const prevBtn = document.getElementById('prev-btn');
  const slideCounter = document.getElementById('slide-nav');
  const currentNum = document.getElementById('nav-current');
  const totalNum = document.getElementById('nav-total');

  let currentIndex = 0;
  let isAnimating = false;
  const isAutoplay = false;

  function showSlideNav() {
    if (nextBtn) nextBtn.classList.add('is-ready');
    if (prevBtn) prevBtn.classList.add('is-ready');
    if (slideCounter) slideCounter.classList.add('is-ready');
  }
  function hideSlideNav() {
    if (nextBtn) nextBtn.classList.remove('is-ready');
    if (prevBtn) prevBtn.classList.remove('is-ready');
    if (slideCounter) slideCounter.classList.remove('is-ready');
  }

  if (totalNum) totalNum.innerText = String(slides.length).padStart(2, '0');

  const continueBtn = document.getElementById('continue-to-arsenal');
  window.addEventListener('app:loader-complete', async () => {
    if (slides[0]) {
      await revealSlideContent(slides[0]);
      showSlideNav();
    }
  }, { once: true });

  function updateNavUI() {
    if (currentNum) currentNum.innerText = String(currentIndex + 1).padStart(2, '0');
    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) nextBtn.disabled = currentIndex === slides.length - 1;
  }

  async function transitionTo(index) {
    if (isAnimating || index === currentIndex || index < 0 || index >= slides.length) {
      return;
    }

    isAnimating = true;
    hideSlideNav();

    const currentSection = slides[currentIndex];
    const nextSection = slides[index];

    try {
      await cleanupSlideContent(currentSection);
      await wait(220);
      prepareSlideContent(nextSection);

      currentSection.classList.remove('active');
      nextSection.classList.add('active');

      gsap.set(currentSection, {
        opacity: 0,
        pointerEvents: 'none',
        scale: 1,
        filter: 'none',
        clearProps: 'clipPath',
      });
      gsap.set(nextSection, {
        opacity: 1,
        pointerEvents: 'auto',
        scale: 1,
        filter: 'none',
        clearProps: 'clipPath',
      });

      currentIndex = index;
      updateNavUI();

      await revealSlideContent(nextSection);
    } finally {
      isAnimating = false;
      updateNavUI();
      showSlideNav();
    }
  }

  function prepareSlideContent(section) {
    const type = section.getAttribute('data-slide');
    if (type === '1') resetArsenalContent(section, gsap);
    if (type === '2') resetWireframeContent(section);
    if (type === '3') {
      // Limpa estilos inline e força repaint dos tickets/panes
      section.querySelectorAll('.ticket, .pricing-pane').forEach(el => {
        gsap.set(el, { clearProps: 'all' });
      });
    }
    if (type === '4') resetProcessPipeline(section);
  }

  async function revealSlideContent(section) {
    const type = section.getAttribute('data-slide');

    if (type === '0') {
      await revealHeroContent(section);
      return;
    }

    const buggers = section.querySelectorAll('.hover-bug');
    buggers.forEach(el => {
      if (el._hoverBugger) el._hoverBugger.boot();
    });

    if (type === '1') {
      await revealArsenalContent(section, gsap);
      return;
    }

    if (type === '2') {
      await revealWireframeContent(section);
      return;
    }

    if (type === '3') {
      await revealPricingTickets(section);
      return;
    }

    if (type === '4') {
      await revealProcessPipeline(section);
      return;
    }

    if (type === '5') {
      await revealContactCinema(section);
      revealContactFinale(section);
      return;
    }

    await decodeMatrixReveals(section);
  }

  async function cleanupSlideContent(section) {
    const type = section.getAttribute('data-slide');

    if (type === '0') return hideHeroContent(section);
    if (type === '1') return hideArsenalContent(section, gsap);
    if (type === '2') return hideWireframeContent(section);
    if (type === '3') return hidePricingTickets(section);
    if (type === '4') return hideProcessPipeline(section);
    if (type === '5') {
      hideContactFinale(section);
      return hideContactCinema(section);
    }

    await eraseMatrixReveals(section);
  }

  async function revealHeroContent(section) {
    resetHeroTitle();

    const copy = section.querySelector('.hero__copy');
    const actions = section.querySelector('.hero__actions');
    const text = section.querySelector('#hero-dynamic-text');

    if (copy) gsap.set(copy, { opacity: 1, y: 0, filter: 'none' });
    if (actions) gsap.set(actions, { opacity: 0, pointerEvents: 'none', y: 0 });

    initHeroBug({ initialDelay: 250 });

    if (text?._matrixReveal) {
      text._matrixReveal.setText(HERO_INITIAL_TEXT, true);
      text.setAttribute('data-text', HERO_INITIAL_TEXT);
      await text._matrixReveal.decode();
      await wait(650);
      await text._matrixReveal.erase();
      text._matrixReveal.setText(HERO_FINAL_TEXT, true);
      text.setAttribute('data-text', HERO_FINAL_TEXT);
      await text._matrixReveal.decode();
    } else if (text) {
      text.innerText = HERO_FINAL_TEXT;
    }

    if (actions) {
      gsap.to(actions, {
        opacity: 1,
        pointerEvents: 'auto',
        duration: 0.8,
        ease: 'power2.out',
      });
    }
  }

  async function hideHeroContent(section) {
    const exitTargets = section.querySelectorAll('.hero__actions');
    if (exitTargets.length) {
      gsap.to(exitTargets, {
        opacity: 0,
        duration: 0.35,
        stagger: 0.05,
        ease: 'power2.in',
      });
    }

    await Promise.all([
      exitHeroTitle(),
      eraseMatrixReveals(section),
    ]);

    const copy = section.querySelector('.hero__copy');
    if (copy) gsap.set(copy, { opacity: 0 });
  }

  // Bind Controls
  if (nextBtn) nextBtn.addEventListener('click', () => transitionTo(currentIndex + 1));
  if (prevBtn) prevBtn.addEventListener('click', () => transitionTo(currentIndex - 1));
  if (continueBtn) continueBtn.addEventListener('click', () => transitionTo(1));

  // Keyboard Navigation
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') transitionTo(currentIndex + 1);
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') transitionTo(currentIndex - 1);
  });

  // Initialize first section
  if (slides.length) {
    slides[0].classList.add('active');
    gsap.set(slides[0], { opacity: 1, pointerEvents: "auto", scale: 1, filter: "none" });
    updateNavUI();
  }

  // --- GLOBAL EFFECTS ---
  const marquees = document.querySelectorAll('.marquee');
  marquees.forEach(marquee => {
    const speed = parseFloat(marquee.getAttribute('data-speed')) || 1;
    const inner = marquee.querySelector('.marquee__inner');
    inner.innerHTML += inner.innerHTML;
    gsap.to(inner, { xPercent: -50, ease: "none", duration: 15 / Math.abs(speed), repeat: -1 });
  });

  ScrollTrigger.refresh();
}
