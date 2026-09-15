import PropTypes from 'prop-types';
// src/components/canvas/GalaxyScene.jsx
import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Fiber resets its clock when a paused render loop resumes. Keep our own
// animation time, and cap long frames so returning to a tab cannot jump ahead.
const useAnimationTime = () => {
  const timeRef = useRef(0);
  useFrame((_, delta) => {
    timeRef.current += Math.min(delta, 0.05);
  }, -1);
  return timeRef;
};

// Procedural soft radial-gradient sprite texture, used to fake nebula cloud
// wisps out of a few big billboards instead of shipping an image asset.
const useNebulaTexture = () =>
  useMemo(() => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2
    );
    gradient.addColorStop(0, 'rgba(52, 211, 153, 0.55)');
    gradient.addColorStop(0.4, 'rgba(16, 120, 90, 0.28)');
    gradient.addColorStop(1, 'rgba(3, 10, 6, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

// Soft round glow texture for individual stars — without this, WebGL point
// sprites render as hard-edged squares (worse, near-invisible 1px squares
// once far enough from camera), which is what was showing through the page.
const useStarTexture = () =>
  useMemo(() => {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.7)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

const Nebula = () => {
  const groupRef = useRef(null);
  const texture = useNebulaTexture();

  const blobs = useMemo(
    () => [
      { pos: [-2.2, 0.6, -6], scale: 7, speed: 0.02 },
      { pos: [2.6, -0.8, -9], scale: 9, speed: -0.015 },
      { pos: [0, 1.4, -12], scale: 11, speed: 0.01 },
      { pos: [-3.4, -1.6, -14], scale: 8, speed: -0.025 },
    ],
    []
  );

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.z += Math.min(delta, 0.05) * 0.01;
  });

  return (
    <group ref={groupRef}>
      {blobs.map((b, i) => (
        <sprite key={i} position={b.pos} scale={[b.scale, b.scale, 1]}>
          <spriteMaterial
            map={texture}
            transparent
            opacity={0.8}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      ))}
    </group>
  );
};

const STAR_COUNT = 2600;

const Starfield = ({ progressRef }) => {
  const pointsRef = useRef(null);
  const timeRef = useAnimationTime();
  const starTexture = useStarTexture();

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(STAR_COUNT * 3);
    const col = new Float32Array(STAR_COUNT * 3);
    const white = new THREE.Color('#ffffff');
    const green = new THREE.Color('#a7f3d0');

    for (let i = 0; i < STAR_COUNT; i++) {
      // A true sphere centered on the object's own local origin — rotating it
      // then just spins it in place. Baking an offset into the raw vertex
      // data instead (as a hemisphere pushed out in front of the camera)
      // means `rotation.y` pivots around a point outside the cluster, so the
      // whole field visibly swings/orbits over time instead of spinning —
      // that was the "stars drifting off-screen" bug.
      const radius = 3 + Math.random() * 15;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      const mixed = white.clone().lerp(green, Math.random() * 0.6);
      col[i * 3] = mixed.r;
      col[i * 3 + 1] = mixed.g;
      col[i * 3 + 2] = mixed.b;
    }

    return [pos, col];
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const progress = progressRef.current;
    pointsRef.current.rotation.y += Math.min(delta, 0.05) * (0.015 + progress * 0.02);
    pointsRef.current.rotation.x = Math.sin(timeRef.current * 0.05) * 0.05;
  });

  return (
    <points ref={pointsRef} position={[0, 0, -9]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={STAR_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={STAR_COUNT}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        map={starTexture}
        alphaMap={starTexture}
        size={0.12}
        vertexColors
        transparent
        opacity={1}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const Drift = ({ progressRef, children }) => {
  const timeRef = useAnimationTime();
  const smoothedProgress = useRef(progressRef.current);
  useFrame((state, delta) => {
    smoothedProgress.current = THREE.MathUtils.damp(
      smoothedProgress.current, progressRef.current, 5, Math.min(delta, 0.05)
    );
    const progress = smoothedProgress.current;
    // A gentle parallax drift tied to how far down the whole page you are,
    // plus a slow ambient bob — this backdrop has to stay comfortable behind
    // a full page of reading, not just one dramatic screen, so it never
    // "dives" all the way in.
    const t = timeRef.current;
    state.camera.position.x = Math.sin(t * 0.06) * 0.3;
    state.camera.position.y = Math.sin(t * 0.04) * 0.2 - progress * 0.6;
    state.camera.position.z = THREE.MathUtils.lerp(6, 4.2, progress);
    state.camera.lookAt(0, 0, -1);
  });

  return children;
};

// Persistent, full-page WebGL backdrop: a green-tinted starfield with soft
// nebula billboards, gently animated by scroll progress via `progressRef`
// (a plain ref, not React state, so scrolling never triggers a re-render).
const GalaxyScene = ({ progressRef, running }) => {
  return (
    <Canvas
      frameloop={running ? 'always' : 'never'}
      fallback={null}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ antialias: true, alpha: false }}
    >
      <color attach="background" args={['#030a06']} />
      <fogExp2 attach="fog" args={['#03150d', 0.03]} />
      <ambientLight intensity={0.4} />
      <Drift progressRef={progressRef}>
        <Nebula />
        <Starfield progressRef={progressRef} />
      </Drift>
    </Canvas>
  );
};

export default GalaxyScene;

const progressRefType = PropTypes.shape({ current: PropTypes.number.isRequired }).isRequired;
Starfield.propTypes = { progressRef: progressRefType };
Drift.propTypes = { progressRef: progressRefType, children: PropTypes.node };
GalaxyScene.propTypes = { progressRef: progressRefType, running: PropTypes.bool.isRequired };
