import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export class ScrollMatrixReveal {
  constructor(el) {
    this.el = el;
    this.el._matrixReveal = this; // Expõe a instância para disparos externos
    this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>[]█▓▒░ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';
    this.timeoutIds = [];

    this.setText(el.getAttribute('data-text') || el.innerText, true);
    this.initScroll();
  }

  setText(text, hidden = true) {
    this.clearTimers();
    this.originalText = (text || '').trim();
    this.originalChars = [];

    let html = '';
    for(let i=0; i < this.originalText.length; i++) {
       const char = this.originalText[i];
       if (char === ' ') {
         html += ' ';
       } else {
         this.originalChars.push(char);
         html += `<span class="scroll-char" style="opacity: ${hidden ? 0 : 1};">${char}</span>`;
       }
    }
    
    this.el.innerHTML = html;
    this.spans = this.el.querySelectorAll('.scroll-char');
  }

  initScroll() {
    // Em slide mode, as revelações são orquestradas pelo controlador de slides.
    if (this.el.closest('[data-slide]')) return;

    ScrollTrigger.create({
      trigger: this.el,
      start: "top 90%", // Dispara quando o elemento atinge 90% da tela (entrando no view)
      onEnter: () => {
        // Delay removido para resposta instantânea ao scroll
        this.decode();
      },
      once: true // Renderiza a decodificação apenas uma vez por elemento
    });
  }

  clearTimers() {
     this.timeoutIds.forEach(timeoutId => clearTimeout(timeoutId));
     this.timeoutIds = [];
  }

  setTimer(callback, delay) {
     const timeoutId = setTimeout(() => {
        this.timeoutIds = this.timeoutIds.filter(id => id !== timeoutId);
        callback();
     }, delay);
     this.timeoutIds.push(timeoutId);
  }

  reset() {
     if (!this.spans) return;
     this.clearTimers();
     this.spans.forEach((span, index) => {
        span.style.opacity = '0';
        span.classList.remove('bug-char-light');
        span.innerText = this.originalChars[index] || '';
     });
  }

  decode() {
     if (!this.spans) return Promise.resolve();
     this.clearTimers();

     return new Promise(resolve => {
      if (!this.spans.length) {
         resolve();
         return;
      }

      let completed = 0;

      this.spans.forEach((span, index) => {
        const origChar = this.originalChars[index] || span.innerText;
         
        // Define a quantidade de ciclos que a letra vai ficar embaralhada antes de se firmar
        const maxIters = 10 + Math.floor(Math.random() * 10);
        let iterations = 0;
        
        const scramble = () => {
           if (iterations === 0) {
              span.style.opacity = '1';
              span.classList.add('bug-char-light'); // Acende com Ciano Neon / Monospace
           }
           
            if (iterations < maxIters) {
               span.innerText = this.chars[Math.floor(Math.random() * this.chars.length)];
               iterations++;
               this.setTimer(scramble, 30); // 30ms por ciclo de embaralhamento
            } else {
               span.classList.remove('bug-char-light');
               span.innerText = origChar;
               completed++;
               if (completed === this.spans.length) resolve();
            }
        };
         
        // Cascata da esquerda para a direita (typewriter wave)
        this.setTimer(scramble, index * 15);
      });
     });
  }

  erase() {
     if (!this.spans) return Promise.resolve();
     this.clearTimers();

     return new Promise(resolve => {
      if (!this.spans.length) {
         resolve();
         return;
      }

      let completed = 0;
      const total = this.spans.length;

      this.spans.forEach((span, index) => {
        const origChar = this.originalChars[index] || span.innerText;
        const maxIters = 8 + Math.floor(Math.random() * 8);
        let iterations = 0;

        const scramble = () => {
           if (iterations === 0) {
              span.style.opacity = '1';
              span.classList.add('bug-char-light');
           }

           if (iterations < maxIters) {
              span.innerText = this.chars[Math.floor(Math.random() * this.chars.length)];
              iterations++;
              this.setTimer(scramble, 24);
           } else {
              span.classList.remove('bug-char-light');
              span.innerText = origChar;
              span.style.opacity = '0';
              completed++;
              if (completed === total) resolve();
           }
        };

        this.setTimer(scramble, (total - index - 1) * 12);
      });
     });
  }
}

export function initScrollMatrix() {
  gsap.registerPlugin(ScrollTrigger);
  const elements = document.querySelectorAll('.matrix-reveal');
  elements.forEach(el => new ScrollMatrixReveal(el));
}
