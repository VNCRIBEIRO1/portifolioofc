export class HeroBugger {
  constructor(el, alwaysBugStyle = false) {
    this.el = el;
    this.originalText = el.getAttribute('data-text').trim();
    this.alwaysBugStyle = alwaysBugStyle;
    // Caracteres Autênticos Matrix: Katakana + DOS Blocks + Tech Symbols
    this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>[]█▓▒░ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';
    this.frameRequest = null;
    this.bugRequest = null;
    this.frame = 0;
  }

  getCleanText() {
    if (!this.alwaysBugStyle) return this.originalText;
    return this.originalText.split('').map(c => c === ' ' ? ' ' : `<span class="bug-char">${c}</span>`).join('');
  }

  async formText(isErasing = false) {
    return new Promise(resolve => {
      const length = this.originalText.length;
      this.queue = [];
      
      for (let i = 0; i < length; i++) {
        const from = isErasing ? this.originalText[i] : '';
        const to = isErasing ? '' : this.originalText[i];
        
        // Se apaga, vai de trás pra frente. Senão, de frente pra trás
        const order = isErasing ? (length - 1 - i) : i;
        const start = Math.floor(order * 2); 
        const end = start + 15 + Math.floor(Math.random() * 15);
        this.queue.push({ from, to, start, end, char: '' });
      }

      cancelAnimationFrame(this.frameRequest);
      this.frame = 0;

      const update = () => {
        let output = '';
        let complete = 0;
        
        for (let i = 0; i < length; i++) {
          let { from, to, start, end, char } = this.queue[i];
          
          if (this.frame >= end) {
            complete++;
            if (this.alwaysBugStyle && to !== '') output += `<span class="bug-char">${to}</span>`;
            else output += to;
          } else if (this.frame >= start) {
            if (!char || Math.random() < 0.28) {
              char = this.chars[Math.floor(Math.random() * this.chars.length)];
              this.queue[i].char = char;
            }
            output += `<span class="bug-char">${char}</span>`;
          } else {
            if (this.alwaysBugStyle && from !== '') output += `<span class="bug-char">${from}</span>`;
            else output += from;
          }
        }
        
        this.el.innerHTML = output;
        
        if (complete === length) {
          resolve();
        } else {
          this.frameRequest = requestAnimationFrame(update);
          this.frame++;
        }
      };
      
      update();
    });
  }

  startBugLoop() {
    const length = this.originalText.length;
    let bugTimer = 0;
    
    const bugUpdate = () => {
      // Chance menor (5%) de rolar um bug no frame atual
      if (Math.random() < 0.05) {
        this.el.classList.add('is-bugging');
        
        let output = '';
        const numBugs = Math.floor(Math.random() * 3) + 1;
        const bugIndices = new Set();
        for (let i = 0; i < numBugs; i++) bugIndices.add(Math.floor(Math.random() * length));

        for (let i = 0; i < length; i++) {
          if (bugIndices.has(i) && this.originalText[i] !== ' ') {
            const char = this.chars[Math.floor(Math.random() * this.chars.length)];
            output += `<span class="bug-char">${char}</span>`;
          } else {
            if (this.alwaysBugStyle && this.originalText[i] !== ' ') {
              output += `<span class="bug-char">${this.originalText[i]}</span>`;
            } else {
              output += this.originalText[i];
            }
          }
        }
        this.el.innerHTML = output;
        bugTimer = 5; // Mantém o bug por uns 5 frames
      } else {
        if (bugTimer > 0) {
           bugTimer--;
        } else {
           this.el.classList.remove('is-bugging');
           const expected = this.getCleanText();
           if (this.el.innerHTML !== expected) {
             this.el.innerHTML = expected;
           }
        }
      }
      this.bugRequest = requestAnimationFrame(bugUpdate);
    };
    
    bugUpdate();
  }

  stopBugLoop() {
    cancelAnimationFrame(this.bugRequest);
    this.el.classList.remove('is-bugging');
    this.el.innerHTML = this.getCleanText();
  }

  // Novo loop para a palavra STUDIO: Mutação Infinita
  startScrambleLoop() {
    const length = this.originalText.length;
    let frameCount = 0;
    
    const permUpdate = () => {
      frameCount++;
      // Atualiza a cada 15 frames para ser lento e visível
      if (frameCount % 15 === 0) {
        let output = '';
        for (let i = 0; i < length; i++) {
          if (this.originalText[i] === ' ') {
            output += ' ';
            continue;
          }
          const char = this.chars[Math.floor(Math.random() * this.chars.length)];
          output += `<span class="bug-char">${char}</span>`;
        }
        this.el.innerHTML = output;
      }
      this.bugRequest = requestAnimationFrame(permUpdate);
    };
    
    permUpdate();
  }

  stopScrambleLoop() {
    cancelAnimationFrame(this.bugRequest);
    this.el.innerHTML = this.getCleanText();
  }

  // Novo loop de "Respiro" que alterna entre Legível e Colapso
  async startBreathingLoop() {
    this.isBreathing = true;
    while(this.isBreathing) {
      // 1. Fica 3s legível (com o glitch de 5%)
      this.startBugLoop();
      await new Promise(r => setTimeout(r, 3000));
      this.stopBugLoop();
      
      if (!this.isBreathing) break;
      
      // 2. Entra em colapso total (símbolos) por 2s
      this.startScrambleLoop();
      await new Promise(r => setTimeout(r, 2000));
      this.stopScrambleLoop();
      
      if (!this.isBreathing) break;
      
      // 3. Se reconstrói organicamente do caos
      this.el.innerHTML = '';
      await this.formText(false);
    }
  }

  stopBreathingLoop() {
    this.isBreathing = false;
    this.stopBugLoop();
    this.stopScrambleLoop();
  }

  async erase() {
    this.stopBreathingLoop();
    await this.formText(true);
  }
}

let activeBuggers = [];
let loopActive = true;

export async function exitHeroTitle() {
  loopActive = false;
  const promises = activeBuggers.map(b => b.erase());
  await Promise.all(promises);
}

export function resetHeroTitle() {
  loopActive = true;
  // This will be picked up when initHeroBug is called again or if the loop is still alive
}

export async function initHeroBug(options = {}) {
  const { initialDelay = 300 } = options;
  const lines = document.querySelectorAll('.hero__title-line');
  if (!lines.length) return;

  lines.forEach(line => {
    if (!line.hasAttribute('data-text')) {
      if (line.classList.contains('outline')) line.setAttribute('data-text', 'STUDIO');
      else line.setAttribute('data-text', 'PIXELCODE');
    }
    line.innerHTML = ''; 
  });

  await new Promise(r => setTimeout(r, initialDelay));

  // Instancia com alwaysBugStyle = true para a linha STUDIO
  activeBuggers = Array.from(lines).map((line, index) => {
    return new HeroBugger(line, index === 1);
  });
  
  const buggers = activeBuggers;

  while(true) {
    // 1. Forma o texto Sequencialmente (PIXELCODE depois STUDIO)
    await buggers[0].formText(false);
    if(buggers[1]) await buggers[1].formText(false);
    
    // 2. Fica 10s: PIXELCODE com bugs 5%, STUDIO com ciclo de Colapso/Recuperação
    buggers[0].startBugLoop();
    if(buggers[1]) buggers[1].startBreathingLoop();
    
    await new Promise(r => setTimeout(r, 10000));
    
    buggers[0].stopBugLoop();
    if(buggers[1]) buggers[1].stopBreathingLoop(); // Trava a respiração para apagar
    
    if (!loopActive) break; // Check if we should exit the loop
    
    // 3. Desfaz o texto Simultaneamente para que nenhuma palavra fique sozinha
    const erasePromises = [buggers[0].formText(true)];
    if(buggers[1]) erasePromises.push(buggers[1].formText(true));
    await Promise.all(erasePromises);
    
    // 4. Pausa antes de recomeçar
    await new Promise(r => setTimeout(r, 1000));
  }
}
