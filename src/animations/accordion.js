import { gsap } from 'gsap';

export function initAccordion() {
  const items = document.querySelectorAll('.accordion__item');
  const reveal = document.querySelector('.hover-reveal');
  
  if (!items.length || !reveal) return;

  // Lógica de Expansão
  items.forEach(item => {
    item.addEventListener('click', () => {
      const isActive = item.classList.contains('is-active');
      
      // Fecha todos
      items.forEach(i => {
        i.classList.remove('is-active');
        const icon = i.querySelector('.icon');
        if(icon) icon.innerText = '+';
      });

      // Se não estava ativo, abre
      if (!isActive) {
        item.classList.add('is-active');
        const icon = item.querySelector('.icon');
        if(icon) icon.innerText = '-';
      }
    });

    // Lógica do Hover Reveal Fantasma
    item.addEventListener('mouseenter', () => {
      reveal.classList.add('is-active');
    });

    item.addEventListener('mousemove', (e) => {
      // Faz o reveal seguir o mouse usando GSAP pra ser suave
      gsap.to(reveal, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: "power2.out"
      });
    });

    item.addEventListener('mouseleave', () => {
      reveal.classList.remove('is-active');
    });
  });
}
