import * as THREE from 'three';
import { gsap } from 'gsap';

export function initWebGLShader() {
  const container = document.querySelector('.webgl-container');
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas || !container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(
    window.innerWidth / -2, window.innerWidth / 2,
    window.innerHeight / 2, window.innerHeight / -2,
    1, 1000
  );
  camera.position.z = 1;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // O Shader Material
  const material = new THREE.ShaderMaterial({
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent,
    uniforms: {
      uTime: { value: 0 },
      tDiffuse: { value: null }, // Textura atual
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uHoverState: { value: 0.0 }
    },
    transparent: true
  });

  // Um plano grande o suficiente para preencher a tela
  const geometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight, 32, 32);
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // Mouse tracking para o shader
  const mouse = new THREE.Vector2(0.5, 0.5);
  const targetMouse = new THREE.Vector2(0.5, 0.5);
  
  window.addEventListener('mousemove', (e) => {
    // Normalizado de 0 a 1 para o shader de UV
    targetMouse.x = e.clientX / window.innerWidth;
    targetMouse.y = 1.0 - (e.clientY / window.innerHeight); // Y invertido no WebGL
  });

  // Integração com os itens do Portfólio
  const items = document.querySelectorAll('.portfolio__item');
  const textureLoader = new THREE.TextureLoader();
  const textureCache = {};

  items.forEach(item => {
    // Preload da imagem
    const imgSrc = item.getAttribute('data-image');
    if (imgSrc && !textureCache[imgSrc]) {
      textureCache[imgSrc] = textureLoader.load(imgSrc, (texture) => {
        // Ajustes de textura para cobrir a tela (cover)
        texture.generateMipmaps = false;
        texture.minFilter = THREE.LinearFilter;
        texture.needsUpdate = true;
      });
    }

    item.addEventListener('mouseenter', () => {
      container.classList.add('is-active');
      material.uniforms.tDiffuse.value = textureCache[imgSrc];
      
      gsap.to(material.uniforms.uHoverState, {
        value: 1.0,
        duration: 1,
        ease: "power3.out"
      });
    });

    item.addEventListener('mouseleave', () => {
      container.classList.remove('is-active');
      
      gsap.to(material.uniforms.uHoverState, {
        value: 0.0,
        duration: 0.5,
        ease: "power3.in"
      });
    });
  });

  // Resize handler
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.left = window.innerWidth / -2;
    camera.right = window.innerWidth / 2;
    camera.top = window.innerHeight / 2;
    camera.bottom = window.innerHeight / -2;
    camera.updateProjectionMatrix();
    
    mesh.geometry.dispose();
    mesh.geometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight, 32, 32);
  });

  // Animação loop
  const clock = new THREE.Clock();

  function render() {
    requestAnimationFrame(render);
    
    // Lerp suave pro mouse do shader
    mouse.x += (targetMouse.x - mouse.x) * 0.1;
    mouse.y += (targetMouse.y - mouse.y) * 0.1;

    material.uniforms.uTime.value = clock.getElapsedTime();
    material.uniforms.uMouse.value = mouse;

    renderer.render(scene, camera);
  }
  
  render();
}
