import { gsap } from 'gsap';

export class VideoScrubber {
  constructor(el) {
    this.el = el;
    this.video = el.querySelector('video');
    this.isHovering = false;
    
    // Configurações de suavização
    this.targetTime = 0;
    this.currentTime = 0;
    this.lerpSpeed = 0.05;
    
    this.init();
  }

  init() {
    if (!this.video) return;

    // Garante que o vídeo carregou os metadados para sabermos a duração
    this.video.addEventListener('loadedmetadata', () => {
      this.duration = this.video.duration;
    });

    this.el.addEventListener('mouseenter', () => {
      this.isHovering = true;
      this.video.play(); // Começa a tocar mas vamos controlar o tempo
      this.render();
    });

    this.el.addEventListener('mouseleave', () => {
      this.isHovering = false;
      // Quando sai, podemos deixar o vídeo tocando devagar ou resetar
      gsap.to(this.video, { playbackRate: 0.5, duration: 1 });
    });

    this.el.addEventListener('mousemove', (e) => {
      if (!this.isHovering || !this.duration) return;

      const rect = this.el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      // Mapeia X e Y para o tempo do vídeo (X controla progresso geral, Y adiciona micro-variação)
      // Isso cria a sensação de "transições entre cenas" conforme você navega no card
      this.targetTime = x * this.duration;
      
      // Ajusta a velocidade de reprodução baseado na velocidade do mouse para ser orgânico
      const mouseSpeed = Math.abs(e.movementX) + Math.abs(e.movementY);
      const playbackRate = gsap.utils.mapRange(0, 100, 0.5, 3, mouseSpeed);
      this.video.playbackRate = playbackRate;
    });
  }

  render() {
    if (!this.isHovering) return;

    // Interpolação suave para o currentTime (Efeito "Cinemático")
    this.currentTime += (this.targetTime - this.currentTime) * this.lerpSpeed;
    
    // Só atualizamos se houver uma mudança significativa para poupar performance
    if (Math.abs(this.targetTime - this.video.currentTime) > 0.01) {
        this.video.currentTime = this.currentTime;
    }

    requestAnimationFrame(() => this.render());
  }
}

export function initVideoScrub() {
  const elements = document.querySelectorAll('[data-video-scrub]');
  elements.forEach(el => new VideoScrubber(el));
}
