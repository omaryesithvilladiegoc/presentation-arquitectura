import { useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const pseudoNoise = (seed: number) => {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
};

interface HexagonCubeProps {
  position: [number, number, number];
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
}

function HexagonCube({ position, mouseRef }: HexagonCubeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const baseScale = useRef(1);
  const targetScale = useRef(1);
  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame(() => {
    if (!meshRef.current) return;
    
    const dx = position[0] - mouseRef.current.x * 8;
    const dy = position[1] - mouseRef.current.y * 8;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < 3.5) {
      const factor = 1 - dist / 3.5;
      targetScale.current = 1 + factor * 0.5;
      targetRotation.current.x = mouseRef.current.y * factor * 0.5;
      targetRotation.current.y = mouseRef.current.x * factor * 0.5;
    } else {
      targetScale.current = 1;
      targetRotation.current.x = 0;
      targetRotation.current.y = 0;
    }

    baseScale.current += (targetScale.current - baseScale.current) * 0.05;
    meshRef.current.scale.setScalar(baseScale.current);
    meshRef.current.rotation.x += (targetRotation.current.x - meshRef.current.rotation.x) * 0.05;
    meshRef.current.rotation.y += (targetRotation.current.y - meshRef.current.rotation.y) * 0.05;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[0.3, 0.3, 0.3]} />
      <meshStandardMaterial
        color="#0E0E18"
        emissive="#00D4FF"
        emissiveIntensity={0.25}
        roughness={0.4}
        metalness={0.6}
      />
    </mesh>
  );
}

function HexagonFormation() {
  const groupRef = useRef<THREE.Group>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);

  const positions = useMemo(() => {
    const pos: [number, number, number][] = [];
    const layers = 5;
    const radiusStep = 0.8;
    
    for (let layer = 0; layer < layers; layer++) {
      const radius = layer * radiusStep;
      const count = layer === 0 ? 1 : layer * 6;
      
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + (layer % 2) * 0.3;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        // Add some height variation
        const heightLevels = layer === 0 ? 3 : 2;
        for (let h = 0; h < heightLevels; h++) {
          const y = (h - heightLevels / 2) * 0.45;
          const seed = layer * 100 + i * 10 + h;
          pos.push([
            x + (pseudoNoise(seed) - 0.5) * 0.15,
            y,
            z + (pseudoNoise(seed + 1) - 0.5) * 0.15,
          ]);
        }
      }
    }
    
    // Fill the center with more cubes
    for (let r = 0; r < 3; r++) {
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const radius = r * 0.4 + 0.2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        for (let h = -1; h <= 1; h++) {
          pos.push([x, h * 0.4, z]);
        }
      }
    }
    
    return pos;
  }, []);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
      groupRef.current.position.y = Math.sin(timeRef.current * 0.5) * 0.1;
    }
  });

  const handlePointerMove = useCallback((e: THREE.Event) => {
    const native = (e as unknown as { nativeEvent: PointerEvent }).nativeEvent;
    if (native) {
      mouseRef.current.x = (native.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(native.clientY / window.innerHeight) * 2 + 1;
    }
  }, []);

  return (
    <group ref={groupRef} onPointerMove={handlePointerMove}>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} color="#00D4FF" intensity={0.5} />
      <pointLight position={[-10, -5, -5]} color="#7B61FF" intensity={0.3} />
      {positions.map((pos, i) => (
        <HexagonCube key={i} position={pos} mouseRef={mouseRef} />
      ))}
    </group>
  );
}

export function HexagonScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 18], fov: 50, near: 0.1, far: 100 }}
      style={{ position: 'absolute', inset: 0 }}
      gl={{ antialias: true, alpha: true }}
    >
      <HexagonFormation />
    </Canvas>
  );
}
