import './style.css'
import * as THREE from 'three';

// Three.js Background Animation
const initThreeJS = () => {
  const container = document.getElementById('canvas-container');
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio); // Sharper rendering
  container.appendChild(renderer.domElement);

  // Particles
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 1000; // Increased count

  const posArray = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 20; // Wider spread
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

  // Material
  const material = new THREE.PointsMaterial({
    size: 0.03,
    color: 0x00c6ff, // Cyan accent
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });

  // Mesh
  const particlesMesh = new THREE.Points(particlesGeometry, material);
  scene.add(particlesMesh);

  // Connecting Lines (Neural Network effect)
  // Note: Drawing lines between all particles is expensive. 
  // We'll use a simpler approach or a dedicated shader for better performance if needed.
  // For now, let's stick to a dynamic particle field that rotates.

  camera.position.z = 4;

  // Mouse interaction
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX / window.innerWidth - 0.5;
    mouseY = event.clientY / window.innerHeight - 0.5;
  });

  // Animation Loop
  const clock = new THREE.Clock();

  const animate = () => {
    const elapsedTime = clock.getElapsedTime();

    // Smooth mouse movement
    targetX = mouseX * 2;
    targetY = mouseY * 2;

    particlesMesh.rotation.y += 0.002; // Constant slow rotation
    particlesMesh.rotation.x += (targetY - particlesMesh.rotation.x) * 0.05;
    particlesMesh.rotation.y += (targetX - particlesMesh.rotation.y) * 0.05;

    // Wave effect
    // Note: Modifying buffer attributes every frame is costly, but for 1000 particles it's fine on modern devices.
    // For better performance, a vertex shader would be ideal.

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };

  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
};

initThreeJS();

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Staggered Scroll Animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Apply to elements
const animatedElements = document.querySelectorAll('.card, .section-title, .hero h1, .hero .subtitle, .btn, .card-icon');

animatedElements.forEach((el, index) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'all 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)';

  // Add delay based on index within its container for staggered effect
  // Simple heuristic: just use a small delay for everything to ensure smooth entry
  // For true staggered grid, we'd need to group by parent.

  observer.observe(el);
});

// Icon Pop Animation
const iconObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.transform = 'scale(1)';
        entry.target.style.opacity = '1';
      }, 300); // Delay after card appears
      iconObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.card-icon').forEach(icon => {
  icon.style.transform = 'scale(0)';
  icon.style.opacity = '0';
  icon.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'; // Bouncy effect
  iconObserver.observe(icon);
});

// In-view logic
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Add a small delay based on DOM order or random for organic feel?
      // Let's just use CSS transition delay if we can, or JS timeout.

      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, 100); // Base delay

      revealObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

animatedElements.forEach(el => revealObserver.observe(el));
