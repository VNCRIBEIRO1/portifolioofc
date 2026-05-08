import * as THREE from 'three';
import { createNeuralGrid } from './neural-grid.js';

export function initThreeScene() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050510, 0.02); // Fog para depth, mesma cor do --bg

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
  });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limita a 2 para performance

  // Neural Grid System
  const neuralGrid = createNeuralGrid();
  scene.add(neuralGrid.group);

  // Mouse Interactivity
  const mouse = new THREE.Vector2();
  const targetMouse = new THREE.Vector2();
  let mouseActive = false;

  window.addEventListener('mousemove', (event) => {
    // Normaliza mouse de -1 a 1
    targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    mouseActive = true;
  });

  window.addEventListener('mouseout', () => {
    mouseActive = false;
  });

  // Scroll Interaction
  let scrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  });

  // Resize Handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  // Animation Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Lerp do mouse para movimento suave
    if(mouseActive) {
      mouse.x += (targetMouse.x - mouse.x) * 0.05;
      mouse.y += (targetMouse.y - mouse.y) * 0.05;
    } else {
      mouse.x += (0 - mouse.x) * 0.02;
      mouse.y += (0 - mouse.y) * 0.02;
    }

    // Atualiza o grid (animação de partículas e conexões)
    neuralGrid.update(elapsedTime, mouse, scrollY);

    // Camera movement based on scroll (Parallax sutil + avanço Z)
    const scrollNormalized = scrollY / (document.body.scrollHeight - window.innerHeight);
    
    camera.position.y = -scrollNormalized * 40; // Desce a câmera no eixo Y
    camera.position.z = 30 - (scrollNormalized * 15); // Avança sutilmente no eixo Z
    
    // Rotação suave baseada no mouse
    camera.position.x += (mouse.x * 5 - camera.position.x) * 0.05;
    camera.lookAt(0, camera.position.y, 0);

    renderer.render(scene, camera);
  }

  // Só inicia a animação pesada após o preloader
  document.addEventListener('app:ready', () => {
    animate();
  });
}
