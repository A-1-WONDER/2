import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { InstancedMesh, Object3D } from 'three';

const BUBBLE_COUNT = 60;

const Bubbles: React.FC = () => {
  const meshRef = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);

  // Initialize random data for each bubble
  const particles = useMemo(() => {
    return new Array(BUBBLE_COUNT).fill(0).map(() => ({
      // Start in a random cloud around the center
      position: [
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 15
      ],
      // Speed of upward float
      speed: 0.2 + Math.random() * 0.5,
      // Random phase for wobble
      offset: Math.random() * Math.PI * 2,
      scale: 0.1 + Math.random() * 0.25
    }));
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();

    particles.forEach((p, i) => {
      // Float Upwards
      let y = p.position[1] + time * p.speed;
      
      // Reset height to loop (modulo-like wrapping)
      // Range from -5 to 10
      const heightRange = 15;
      y = ((y + 5) % heightRange) - 5;

      // Horizontal Wander / Wobble
      const x = p.position[0] + Math.sin(time * 0.5 + p.offset) * 1.0;
      const z = p.position[2] + Math.cos(time * 0.3 + p.offset) * 1.0;

      dummy.position.set(x, y, z);
      
      // Gentle pulsing scale
      const pulse = 1 + Math.sin(time * 2 + p.offset) * 0.05;
      dummy.scale.setScalar(p.scale * pulse);
      
      dummy.rotation.set(time * 0.1, time * 0.2, 0);

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, BUBBLE_COUNT]}>
      <sphereGeometry args={[1, 32, 32]} />
      {/* 
        MeshPhysicalMaterial for Bubble Look:
        - Pale Pink color
        - High transmission
        - Lower opacity for more transparency
      */}
      <meshPhysicalMaterial 
        transmission={0.98}
        opacity={0.3} // More transparent
        roughness={0}
        thickness={0.02} // Thinner walls for more delicate look
        ior={1.33} 
        clearcoat={1}
        clearcoatRoughness={0}
        color="#F8D9E0" // Pale Pink
        emissive="#F8D9E0"
        emissiveIntensity={0.2}
        transparent
      />
    </instancedMesh>
  );
};

export default Bubbles;