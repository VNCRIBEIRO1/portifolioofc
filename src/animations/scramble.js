export class ScrambleText {
  constructor(el) {
    this.el = el;
    // Caracteres usados para o efeito de hacker/matrix
    this.chars = '!<>-_\\\\/[]{}—=+*^?#01X';
    this.update = this.update.bind(this);
  }

  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => this.resolve = resolve);
    this.queue = [];
    
    // Se o texto novo é vazio, significa que estamos apagando a frase.
    const isErasing = newText === '';
    
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      
      // Se estiver apagando, a ordem é de trás pra frente. Senão, frente pra trás.
      const order = isErasing ? (length - 1 - i) : i;
      
      // O delay (start) agora depende da posição da letra na frase. 
      // Isso cria o efeito "Typewriter Hacker".
      const start = Math.floor(order * 1.5); // Controla a velocidade geral da digitação
      const end = start + 15 + Math.floor(Math.random() * 10); // Quantos frames a letra fica embaralhada antes de fixar
      
      this.queue.push({ from, to, start, end });
    }
    
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = '';
    let complete = 0;
    
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        // Aplica um span para podermos estilizar a letra "decodificando" no CSS
        output += `<span class="scramble-char">${char}</span>`;
      } else {
        output += from;
      }
    }
    
    this.el.innerHTML = output;
    
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }

  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

export function initHackerText() {
  const el = document.querySelector('.hero__desc');
  if (!el) return;

  const phrases = [
    "NÃO CONSTRUÍMOS APENAS SITES. PROJETAMOS ATIVOS DIGITAIS DE ALTO IMPACTO.",
    "ENGENHARIA FRONT-END DE ELITE E DESIGN BRUTALISTA PARA MARCAS QUE EXIGEM O MÁXIMO.",
    "IMERSÃO TOTAL EM THREE.JS E GSAP. ONDE A ESTÉTICA ENCONTRA A PERFORMANCE BRUTA.",
    "SISTEMAS ESCALÁVEIS E EXPERIÊNCIAS CINEMATOGRÁFICAS PARA O NOVO PADRÃO WEB."
  ];

  const scrambler = new ScrambleText(el);
  el.innerText = '';

  let isRunning = true;
  let counter = 0;

  const loop = async () => {
    while (isRunning) {
      const phrase = phrases[counter % phrases.length];
      
      // 1. Escreve a frase hackeando
      await scrambler.setText(phrase);
      
      // 2. Fica um tempo parada para leitura (proporcional ao tamanho da frase)
      const readTime = Math.max(3000, phrase.length * 50); 
      await new Promise(r => setTimeout(r, readTime));
      
      // 3. Hackeia a frase de volta pro nada (apaga)
      await scrambler.setText('');
      
      // 4. Pausa dramática apagada
      await new Promise(r => setTimeout(r, 800));
      
      counter++;
    }
  };

  setTimeout(loop, 2000);
}
