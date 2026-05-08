export class HoverBugger {
  constructor(el) {
    this.el = el;
    this.originalText = el.getAttribute('data-text') || el.innerText.trim();
    if (!el.hasAttribute('data-text')) {
      el.setAttribute('data-text', this.originalText);
    }
    
    this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>[]█▓▒░ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';
    this.frameRequest = null;
    this.isHovering = false;
    this.currentLoopId = 0;
    
    // Inicia no modo Ocioso Militar
    this.el.classList.add('military-idle');
    this.startIdle();
    
    // Busca o gatilho (Trigger): O card pai se existir, senão o próprio elemento
    const trigger = el.closest('.bento-card') || el;
    
    trigger.addEventListener('mouseenter', () => {
      this.isHovering = true;
      this.el.classList.remove('military-idle');
      this.el.classList.add('is-bugging-light');
      this.startHoverLoop();
    });
    
    trigger.addEventListener('mouseleave', () => {
      this.isHovering = false;
      this.el.classList.remove('is-bugging-light');
      this.el.classList.add('military-idle');
      this.el.innerHTML = this.originalText; // Garante reset imediato da palavra ao tirar o mouse
      this.startIdle();
    });

    // Registra a instância no elemento para acesso externo (GSAP/Scroll)
    this.el._hoverBugger = this;
  }

  // Sequência de Boot: Executa um ciclo de scan automático ao entrar no view
  async boot() {
    if (this.isHovering) return; // Evita conflito se o usuário já estiver com o mouse em cima
    
    this.isHovering = true;
    this.el.classList.remove('military-idle');
    this.el.classList.add('is-bugging-light');
    
    await this.scanText(false);
    
    this.isHovering = false;
    this.el.classList.remove('is-bugging-light');
    this.el.classList.add('military-idle');
    this.startIdle();
  }

  // Loop Contínuo: Scanner Vai-e-Vem
  async startHoverLoop() {
    cancelAnimationFrame(this.frameRequest);
    let loopId = Date.now();
    this.currentLoopId = loopId;
    
    while(this.isHovering && this.currentLoopId === loopId) {
      // Ida: Scanner varre da Esquerda pra Direita
      await this.scanText(false);
      
      if (!this.isHovering) break;
      
      // Pausa tática (O texto fica estático e legível)
      await new Promise(r => setTimeout(r, 800));
      
      if (!this.isHovering) break;
      
      // Volta: Scanner varre da Direita pra Esquerda
      await this.scanText(true);
      
      if (!this.isHovering) break;
      
      // Pausa tática antes de recomeçar o loop
      await new Promise(r => setTimeout(r, 800));
    }
  }

  scanText(reverse = false) {
    return new Promise(resolve => {
      const length = this.originalText.length;
      let iteration = -4; 
      const target = length + 10;
      
      // Busca o motor de grid do card pai para o merge inteligente
      const parent = this.el.closest('.bento-card__inner');
      const grid = parent ? parent._magneticGrid : null;
      const influenceId = `hoverbug-${Math.random()}`;

      const update = () => {
        if (!this.isHovering) {
          if (grid) grid.removeInfluence(influenceId);
          return resolve();
        }
        
        let output = '';
        const cursorIndex = reverse ? Math.floor(length - iteration) : Math.floor(iteration);
        
        // Coletamos a posição do cursor para o Grid
        let cursorX = -1000;
        let cursorY = -1000;

        for (let i = 0; i < length; i++) {
          if (this.originalText[i] === ' ') {
            output += ' ';
            continue;
          }
          
          // Renderiza o Laser/Cursor
          if (i === cursorIndex) {
            output += `<span class="bug-char-light current-cursor" style="color: var(--bg); background: var(--accent-cyan); box-shadow: 0 0 12px var(--accent-cyan); border-radius: 1px;">█</span>`;
            continue;
          }
          
          let distance = reverse ? (i - cursorIndex) : (cursorIndex - i);
          
          if (distance > 0 && distance < 10) {
             const prob = 1 - (distance / 10);
             if (Math.random() < prob) {
                const char = this.chars[Math.floor(Math.random() * this.chars.length)];
                output += `<span class="bug-char-light">${char}</span>`;
             } else {
                output += this.originalText[i];
             }
          } else if (distance < 0 && distance > -3) {
             const prob = 1 - (Math.abs(distance) / 3);
             if (Math.random() < prob) {
                const char = this.chars[Math.floor(Math.random() * this.chars.length)];
                output += `<span class="bug-char-light">${char}</span>`;
             } else {
                output += this.originalText[i];
             }
          } else {
             output += this.originalText[i];
          }
        }
        
        this.el.innerHTML = output;

        // --- MERGE INTELIGENTE ---
        // Se encontrarmos o cursor no DOM, pegamos a posição dele e injetamos no Grid
        if (grid) {
          const cursorEl = this.el.querySelector('.current-cursor');
          if (cursorEl) {
            const rect = cursorEl.getBoundingClientRect();
            const parentRect = parent.getBoundingClientRect();
            cursorX = (rect.left + rect.width/2) - parentRect.left;
            cursorY = (rect.top + rect.height/2) - parentRect.top;
            grid.setInfluence(influenceId, cursorX, cursorY, 80, 45);
          } else {
            grid.removeInfluence(influenceId);
          }
        }
        
        iteration += 0.15; 
        
        if (iteration < target) {
          this.frameRequest = requestAnimationFrame(update);
        } else {
          this.el.innerHTML = this.originalText;
          if (grid) grid.removeInfluence(influenceId);
          resolve();
        }
      };
      
      update();
    });
  }

  // Modo Espacial/Militar: Pulso lento e glitches aleatórios únicos
  startIdle() {
    cancelAnimationFrame(this.frameRequest);
    const length = this.originalText.length;
    let frameCount = 0;
    
    const idleUpdate = () => {
      if (this.isHovering) return;
      frameCount++;
      
      // A cada ~2 segundos, há uma chance alta de uma letra dar um "curto-circuito" visual
      if (frameCount % 120 === 0 && Math.random() < 0.7) {
         let output = '';
         // Escolhe UMA letra aleatória para falhar
         const bugIndex = Math.floor(Math.random() * length);
         
         for(let i = 0; i < length; i++) {
           if (i === bugIndex && this.originalText[i] !== ' ') {
             const char = this.chars[Math.floor(Math.random() * this.chars.length)];
             // Glitch sutil (metade da opacidade) no modo idle
             output += `<span class="bug-char-light" style="opacity:0.6">${char}</span>`;
           } else {
             output += this.originalText[i];
           }
         }
         this.el.innerHTML = output;
         
         // Restaura a letra rapidamente para parecer um choque elétrico (50ms)
         setTimeout(() => {
           if (!this.isHovering) this.el.innerHTML = this.originalText;
         }, 50);
      }
      
      this.frameRequest = requestAnimationFrame(idleUpdate);
    };
    
    idleUpdate();
  }
}

export function initHoverBugs() {
  const elements = document.querySelectorAll('.hover-bug');
  elements.forEach(el => new HoverBugger(el));
}
