export class MagneticGridCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    
    // Configuração do Grid
    this.gridSize = 15; // Tamanho do quadrado (15x15 pixels)
    this.squares = [];
    
    // Estado do Mouse
    this.mouse = { x: -1000, y: -1000, isHovering: false };
    
    // Força Magnética (Modo Repulsão)
    this.magneticRadius = 100;
    this.pushStrength = 40; 
    
    // Influências Externas (Merge Inteligente)
    this.externalInfluences = new Map(); // Map de id -> {x, y, radius, strength}
    
    // Cores (Ciano Neon)
    this.colorLine = 'rgba(255, 255, 255, 0.08)';
    this.colorGlow = 'rgba(0, 229, 255, 0.8)';
    this.colorFill = 'rgba(0, 229, 255, 0.15)';
    
    // Controle de Loop
    this.isLooping = false;
    this.isVisible = false;
    
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    const parent = this.canvas.parentElement;
    parent.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
      
      if (!this.mouse.isHovering) {
        this.mouse.isHovering = true;
        this.startLoop();
      }
    });
    
    parent.addEventListener('mouseleave', () => {
      this.mouse.isHovering = false;
    });

    // Registra a instância no elemento pai para acesso externo
    parent._magneticGrid = this;

    // --- OTIMIZAÇÃO DE PERFORMANCE ---
    // Observer para rodar o canvas apenas se estiver na tela
    this.observer = new IntersectionObserver((entries) => {
      this.isVisible = entries[0].isIntersecting;
      if (this.isVisible) {
        this.startLoop();
      } else {
        this.isLooping = false;
      }
    }, { threshold: 0.1 });
    this.observer.observe(parent);

    this.startLoop();
  }

  startLoop() {
    if (!this.isLooping && this.isVisible) {
      this.isLooping = true;
      this.render();
    }
  }

  setInfluence(id, x, y, radius = 60, strength = 30) {
    this.externalInfluences.set(id, { x, y, radius, strength });
    this.startLoop(); // Acorda o grid se houver influência externa
  }

  removeInfluence(id) {
    this.externalInfluences.delete(id);
  }

  resize() {
    const parent = this.canvas.parentElement;
    this.canvas.width = parent.offsetWidth;
    this.canvas.height = parent.offsetHeight;
    
    this.cols = Math.ceil(this.canvas.width / this.gridSize);
    this.rows = Math.ceil(this.canvas.height / this.gridSize);
    
    this.squares = [];
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        const x = i * this.gridSize;
        const y = j * this.gridSize;
        this.squares.push({
          originX: x,
          originY: y,
          x: x,
          y: y,
          scale: 1,
          opacity: 0
        });
      }
    }
    this.startLoop();
  }

  render() {
    if (!this.isLooping) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Desenha a grade estática de fundo (Blueprint)
    this.ctx.beginPath();
    this.ctx.strokeStyle = this.colorLine;
    this.ctx.lineWidth = 1;
    for (let i = 0; i <= this.cols; i++) {
      this.ctx.moveTo(i * this.gridSize, 0);
      this.ctx.lineTo(i * this.gridSize, this.canvas.height);
    }
    for (let j = 0; j <= this.rows; j++) {
      this.ctx.moveTo(0, j * this.gridSize);
      this.ctx.lineTo(this.canvas.width, j * this.gridSize);
    }
    this.ctx.stroke();

    // --- LÓGICA DE ATIVAÇÃO DO MOTOR ---
    let hasMovement = this.mouse.isHovering || this.externalInfluences.size > 0;
    
    this.squares.forEach(sq => {
      let targetX = sq.originX;
      let targetY = sq.originY;
      let targetScale = 1;
      let targetOpacity = 0;
      let jitterX = 0;
      let jitterY = 0;

      if (this.mouse.isHovering) {
        const centerX = sq.originX + (this.gridSize / 2);
        const centerY = sq.originY + (this.gridSize / 2);
        const dx = this.mouse.x - centerX;
        const dy = this.mouse.y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.magneticRadius) {
          const force = (this.magneticRadius - distance) / this.magneticRadius;
          const angle = Math.atan2(dy, dx);
          targetX = sq.originX + Math.cos(angle) * force * -this.pushStrength;
          targetY = sq.originY + Math.sin(angle) * force * -this.pushStrength;
          targetScale = 1 + (force * 1.2);
          targetOpacity = 0.3 + force;
        }
      }

      this.externalInfluences.forEach(inf => {
        const dx = inf.x - (sq.originX + this.gridSize/2);
        const dy = inf.y - (sq.originY + this.gridSize/2);
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        if (dist < inf.radius) {
          const force = (inf.radius - dist) / inf.radius;
          const angle = Math.atan2(dy, dx);
          
          targetX += Math.cos(angle) * force * -inf.strength;
          targetY += Math.sin(angle) * force * -inf.strength;
          
          // EFEITO HACK: Adiciona Jitter (posições soltas e aleatórias)
          jitterX = (Math.random() - 0.5) * 8 * force;
          jitterY = (Math.random() - 0.5) * 8 * force;
          
          targetScale = Math.max(targetScale, 1.2 + (Math.random() * 0.5 * force));
          targetOpacity = Math.max(targetOpacity, 0.4 + (Math.random() * 0.6 * force));
        }
      });

      sq.x += (targetX + jitterX - sq.x) * 0.1;
      sq.y += (targetY + jitterY - sq.y) * 0.1;
      sq.scale += (targetScale - sq.scale) * 0.1;
      sq.opacity += (targetOpacity - sq.opacity) * 0.1;

      // Se o quadrado ainda está se movendo (não voltou ao repouso), mantém o loop vivo
      if (Math.abs(sq.x - sq.originX) > 0.1 || sq.opacity > 0.01) hasMovement = true;

      if (sq.opacity > 0.05) {
        const size = this.gridSize * sq.scale;
        const drawX = sq.x - ((size - this.gridSize) / 2);
        const drawY = sq.y - ((size - this.gridSize) / 2);

        this.ctx.save();
        this.ctx.globalAlpha = sq.opacity;
        
        // Efeito de Flicker Neon no Hack
        const isHacked = this.externalInfluences.size > 0;
        this.ctx.shadowColor = this.colorGlow;
        this.ctx.shadowBlur = isHacked ? (10 + Math.random() * 20) : 10;
        
        this.ctx.fillStyle = this.colorFill;
        this.ctx.fillRect(drawX, drawY, size, size);
        
        this.ctx.strokeStyle = this.colorGlow;
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(drawX, drawY, size, size);
        
        this.ctx.restore();
      }
    });

    if (hasMovement) {
      requestAnimationFrame(() => this.render());
    } else {
      this.isLooping = false;
      // Garante um frame limpo no final se necessário (opcional)
    }
  }
}

export function initMagneticGrids() {
  const canvases = document.querySelectorAll('.magnetic-grid');
  canvases.forEach(canvas => new MagneticGridCanvas(canvas));
}
