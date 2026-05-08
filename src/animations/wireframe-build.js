import { gsap } from 'gsap';
import { decodeMatrixReveals, eraseMatrixReveals } from './arsenal-sequence.js';

const ITEM_STAGGER = 0.18;

function buildItemTimeline(item, baseDelay) {
  const tl = gsap.timeline({ delay: baseDelay });
  const branch = item.querySelector('.portfolio__branch');
  const content = item.querySelector('.portfolio__item-content');

  if (branch) tl.to(branch, { scaleX: 1, duration: 0.35, ease: 'power2.out' }, 0);
  if (content) {
    tl.to(content, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, 0.15);
  }
  return tl;
}

function setPreview(section, item) {
  const preview = section.querySelector('[data-portfolio-preview]');
  if (!preview || !item) return;
  const img = preview.querySelector('[data-preview-image]');
  const tag = preview.querySelector('[data-preview-tag]');
  const meta = preview.querySelector('[data-preview-meta]');
  const src = item.getAttribute('data-image');
  const tagText = item.getAttribute('data-tag') || '';
  const metaText = item.getAttribute('data-meta') || '';

  if (img && src && img.getAttribute('src') !== src) {
    preview.classList.add('is-loading');
    const next = new Image();
    next.onload = () => {
      img.src = src;
      requestAnimationFrame(() => preview.classList.remove('is-loading'));
    };
    next.src = src;
  }
  if (tag) tag.textContent = `[ ${tagText} ]`;
  if (meta) meta.textContent = metaText;
}

function bindPreviewHandlers(section) {
  if (section._previewBound) return;
  const items = Array.from(section.querySelectorAll('.portfolio__item'));
  items.forEach(item => {
    item.addEventListener('mouseenter', () => {
      items.forEach(it => it.classList.remove('is-active'));
      item.classList.add('is-active');
      setPreview(section, item);
    });
  });
  section._previewBound = true;
}

export function resetWireframeContent(section) {
  if (!section) return;
  const spine = section.querySelector('.portfolio__spine');
  if (spine) gsap.set(spine, { scaleY: 0 });
  section.querySelectorAll('.portfolio__branch').forEach(el => gsap.set(el, { scaleX: 0 }));
  section.querySelectorAll('.portfolio__item-content').forEach(el => gsap.set(el, { opacity: 0, x: -20 }));
  const frame = section.querySelector('.portfolio__preview-frame');
  if (frame) gsap.set(frame, { clipPath: 'inset(0 100% 0 0)' });
}

export async function revealWireframeContent(section) {
  resetWireframeContent(section);
  bindPreviewHandlers(section);

  const header = section.querySelector('.portfolio__header');
  if (header) await decodeMatrixReveals(header);

  const items = Array.from(section.querySelectorAll('.portfolio__item'));
  if (!items.length) return;

  const spine = section.querySelector('.portfolio__spine');
  if (spine) {
    await new Promise(resolve => {
      gsap.to(spine, { scaleY: 1, duration: 0.6, ease: 'expo.out', onComplete: resolve });
    });
  }

  // initial active item drives preview
  const firstActive = items.find(i => i.classList.contains('is-active')) || items[0];
  if (firstActive) {
    items.forEach(it => it.classList.remove('is-active'));
    firstActive.classList.add('is-active');
    setPreview(section, firstActive);
  }

  // preview frame expands left-to-right while items reveal
  const frame = section.querySelector('.portfolio__preview-frame');
  if (frame) {
    gsap.to(frame, { clipPath: 'inset(0 0% 0 0)', duration: 0.9, ease: 'expo.out' });
  }

  await new Promise(resolve => {
    let completed = 0;
    items.forEach((item, i) => {
      const tl = buildItemTimeline(item, i * ITEM_STAGGER);
      tl.eventCallback('onComplete', () => {
        completed += 1;
        if (completed === items.length) resolve();
      });
    });
  });
}

export async function hideWireframeContent(section) {
  if (!section) return;

  await eraseMatrixReveals(section);

  const targets = section.querySelectorAll('.portfolio__item-content, .portfolio__branch');
  await new Promise(resolve => {
    gsap.to(targets, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      stagger: 0.02,
      onComplete: resolve,
    });
  });

  const frame = section.querySelector('.portfolio__preview-frame');
  if (frame) gsap.to(frame, { clipPath: 'inset(0 100% 0 0)', duration: 0.4, ease: 'power2.in' });

  const spine = section.querySelector('.portfolio__spine');
  if (spine) {
    await new Promise(resolve => {
      gsap.to(spine, { scaleY: 0, transformOrigin: 'bottom', duration: 0.4, ease: 'power2.in', onComplete: resolve });
    });
  }
}
