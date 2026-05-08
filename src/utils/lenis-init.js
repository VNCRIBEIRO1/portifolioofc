import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initLenis() {
  const lenis = new Lenis({
    lerp: 0.085, // Interpolação suave normal
    wheelMultiplier: 0.5, // Reduz a velocidade de descida pela metade
    smoothTouch: true,
    touchMultiplier: 1.5,
    infinite: false,
    syncTouch: true
  });

  // Sincroniza o Lenis com o GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // Expõe a instância globalmente para podermos aplicar os bloqueios cinemáticos
  window.lenis = lenis;

  return lenis;
}
