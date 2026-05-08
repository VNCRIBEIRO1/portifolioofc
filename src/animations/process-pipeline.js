import { gsap } from 'gsap';
import { decodeMatrixReveals, eraseMatrixReveals } from './arsenal-sequence.js';

export function resetProcessPipeline(section) {
  const steps = section.querySelectorAll('.process-step');
  const arrows = section.querySelectorAll('.process-step__arrow path');
  gsap.set(steps, { opacity: 0, y: 30 });
  gsap.set(section.querySelectorAll('.process-step__arrow'), { opacity: 0 });
  gsap.set(arrows, { strokeDashoffset: 60 });
}

export async function revealProcessPipeline(section) {
  resetProcessPipeline(section);

  const header = section.querySelector('.section-header');
  if (header) await decodeMatrixReveals(header);

  const steps = Array.from(section.querySelectorAll('.process-step'));
  const arrows = Array.from(section.querySelectorAll('.process-step__arrow'));

  for (let i = 0; i < steps.length; i++) {
    await new Promise(resolve => {
      gsap.to(steps[i], {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power3.out',
        onComplete: resolve,
      });
    });

    if (arrows[i]) {
      gsap.set(arrows[i], { opacity: 1 });
      gsap.to(arrows[i].querySelector('path'), {
        strokeDashoffset: 0,
        duration: 0.35,
        ease: 'power2.out',
      });
    }
  }
}

export async function hideProcessPipeline(section) {
  await eraseMatrixReveals(section);
  const targets = section.querySelectorAll('.process-step, .process-step__arrow');
  await new Promise(resolve => {
    gsap.to(targets, {
      opacity: 0,
      y: 20,
      duration: 0.35,
      stagger: 0.04,
      ease: 'power2.in',
      onComplete: resolve,
    });
  });
}
