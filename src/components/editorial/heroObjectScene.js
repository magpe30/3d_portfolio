import {
  AmbientLight,
  DirectionalLight,
  OrthographicCamera,
  Scene,
  WebGLRenderer,
  ACESFilmicToneMapping,
  PMREMGenerator,
} from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createHeroObjects } from './heroObjectMeshes';

export function createHeroObjectScene(host, onReady, onLost) {
  let renderer;
  try {
    renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  } catch {
    onLost();
    return () => {};
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.domElement.className = 'hero-object-canvas';
  host.appendChild(renderer.domElement);
  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 2000);
  camera.position.z = 1000;
  scene.add(new AmbientLight(0xffffff, 2));
  const key = new DirectionalLight(0xffeee0, 4.5);
  key.position.set(-3, 5, 7);
  scene.add(key);
  const fill = new DirectionalLight(0xc0cee9, 2);
  fill.position.set(4, -1, -3);
  scene.add(fill);
  let environment;
  const lightGlass = () => {
    environment?.dispose();
    const studio = new RoomEnvironment();
    const generator = new PMREMGenerator(renderer);
    environment = generator.fromScene(studio, 0.04);
    scene.environment = environment.texture;
    studio.dispose();
    generator.dispose();
  };
  lightGlass();
  const objects = createHeroObjects();
  objects.forEach(({ root }) => scene.add(root));
  const hero = host.closest('section');
  let width = 0,
    height = 0,
    raf = 0,
    visible = false,
    lost = false,
    disposed = false,
    previous = 0;
  let pointerX = 0,
    easedX = 0;
  const render = (delta = 0) => {
    if (!width || !height || lost) return;
    const ease = 1 - Math.exp(-delta * 4);
    easedX += (pointerX - easedX) * ease;
    const clamp = (value) => Math.min(1, Math.max(0, value));
    const progress = clamp(-hero.getBoundingClientRect().top / (hero.offsetHeight * 0.6));
    const drop = clamp(progress / 0.62);
    const fracture = clamp((progress - 0.62) / 0.38);
    const settle = fracture * fracture * (3 - 2 * fracture);
    host.dataset.phase =
      progress >= 0.99
        ? 'settled'
        : fracture > 0
          ? 'shattered'
          : progress > 0
            ? 'falling'
            : 'intact';
    const unit = Math.min(width, height * 1.4);
    const anchors = [
      [0.085, 0.28, 0.1, -0.14],
      [0.89, width < 761 ? 0.82 : 0.54, 0.085, 0.12],
    ];
    objects.forEach(({ root, intact, broken, fragments }, index) => {
      const [x, y, size, turn] = anchors[index];
      const scale = size * unit;
      const startY = y * height;
      const floorY = height - scale * 1.2 - 12;
      root.scale.setScalar(scale);
      root.position.set(
        x * width - width / 2 + easedX * 6 * (1 - drop),
        height / 2 - (startY + (floorY - startY) * drop * drop),
        0,
      );
      root.rotation.set(
        0.12 * (1 - fracture),
        (index ? -0.3 : 0.3) * (1 - fracture) + easedX * 0.12 * (1 - drop),
        turn * (1 - drop),
      );
      intact.visible = fracture === 0;
      broken.visible = fracture > 0;
      fragments.forEach(({ mesh, origin }, i) => {
        const direction = ((i * 13 + index * 5) % 17) / 8 - 1;
        mesh.position.set(
          origin[0] + direction * fracture * 1.9,
          origin[1] +
            (-0.85 + ((i * 7) % 5) * 0.04 - origin[1]) * settle +
            Math.sin(fracture * Math.PI) * (0.3 + Math.abs(direction) * 0.55),
          Math.sin(i * 2.1) * fracture * 0.3,
        );
        mesh.rotation.set(
          fracture * (i % 2 ? 1.3 : -1.2),
          direction * fracture * 2.4,
          direction * fracture * 2.8,
        );
      });
    });
    renderer.render(scene, camera);
  };
  const tick = (now) => {
    raf = 0;
    if (!visible || document.hidden || lost || disposed) return;
    const delta = previous ? Math.min((now - previous) / 1000, 0.05) : 1 / 60;
    previous = now;
    render(delta);
    if (Math.abs(pointerX - easedX) > 0.002) {
      raf = requestAnimationFrame(tick);
    }
  };
  const requestFrame = () => {
    if (!raf && visible && !document.hidden && !lost && !disposed) {
      raf = requestAnimationFrame(tick);
    }
  };
  const sync = () => {
    cancelAnimationFrame(raf);
    raf = 0;
    previous = 0;
    if (visible && !document.hidden && !lost && !disposed) raf = requestAnimationFrame(tick);
  };
  const refresh = () => {
    if (disposed || lost) return;
    ({ width, height } = host.getBoundingClientRect());
    if (!width || !height) return;
    camera.left = -width / 2;
    camera.right = width / 2;
    camera.top = height / 2;
    camera.bottom = -height / 2;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    render();
    onReady();
  };
  const resize = new ResizeObserver(refresh);
  resize.observe(host);
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  });
  observer.observe(host);
  const move = (event) => {
    if (event.pointerType === 'touch') return;
    const bounds = host.getBoundingClientRect();
    pointerX = (event.clientX - bounds.left) / bounds.width - 0.5;
    requestFrame();
  };
  const reset = () => {
    pointerX = 0;
    requestFrame();
  };
  const contextLost = (event) => {
    event.preventDefault();
    lost = true;
    sync();
    onLost();
  };
  const contextRestored = () => {
    lost = false;
    lightGlass();
    refresh();
    sync();
  };
  hero.addEventListener('pointermove', move);
  hero.addEventListener('pointerleave', reset);
  window.addEventListener('scroll', requestFrame, { passive: true });
  document.addEventListener('visibilitychange', sync);
  renderer.domElement.addEventListener('webglcontextlost', contextLost);
  renderer.domElement.addEventListener('webglcontextrestored', contextRestored);
  refresh();
  return () => {
    disposed = true;
    cancelAnimationFrame(raf);
    resize.disconnect();
    observer.disconnect();
    hero.removeEventListener('pointermove', move);
    hero.removeEventListener('pointerleave', reset);
    window.removeEventListener('scroll', requestFrame);
    document.removeEventListener('visibilitychange', sync);
    renderer.domElement.removeEventListener('webglcontextlost', contextLost);
    renderer.domElement.removeEventListener('webglcontextrestored', contextRestored);
    const geometries = new Set(),
      materials = new Set();
    scene.traverse((object) => {
      if (object.geometry) geometries.add(object.geometry);
      if (object.material) materials.add(object.material);
    });
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((material) => material.dispose());
    environment.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    renderer.domElement.remove();
  };
}
