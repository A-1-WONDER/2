import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, Group, Object3D, MathUtils } from 'three';

const BUTTERFLY_COUNT = 30;

const Butterfly = ({ offset, speed, centerPosition }: { offset: number; speed: number; centerPosition: Vector3 }) => {
  const meshRef = useRef<Group>(null);
  const leftWing = useRef<Object3D>(null);
  const rightWing = useRef<Object3D>(null);
  
  // Random orbit parameters
  const radius = 4 + Math.random() * 3;
  const yOffset = (Math.random() - 0.5) * 6;
  const speedFactor = 0.5 + Math.random() * 0.5;

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();

    // Orbit logic
    const angle = (t * speed * speedFactor) + offset;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    // Add some vertical bobbing
    const y = yOffset + Math.sin(t * 2 + offset) * 1.5;

    meshRef.current.position.set(x, y, z);
    
    // Look at movement direction (tangent)
    meshRef.current.rotation.y = -angle;

    // Wing flap animation
    const flap = Math.sin(t * 15 + offset);
    if (leftWing.current && rightWing.current) {
      leftWing.current.rotation.z = flap * 0.5;
      rightWing.current.rotation.z = -flap * 0.5;
    }
  });

  return (
    <group ref={meshRef}>
      <group rotation={[Math.PI / 4, 0, 0]}> {/* Tilt forward slightly */}
        <mesh ref={leftWing} position={[-0.05, 0, 0]}>
            <planeGeometry args={[0.3, 0.3]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} side={2} transparent opacity={0.9} />
        </mesh>
        <mesh ref={rightWing} position={[0.05, 0, 0]}>
            <planeGeometry args={[0.3, 0.3]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} side={2} transparent opacity={0.9} />
        </mesh>
      </group>
    </group>
  );
};

const Butterflies: React.FC = () => {
  const butterflies = useMemo(() => {
    return new Array(BUTTERFLY_COUNT).fill(0).map((_, i) => ({
      id: i,
      offset: Math.random() * Math.PI * 2,
      speed: 0.2 + Math.random() * 0.3,
      centerPosition: new Vector3(0, 0, 0)
    }));
  }, []);

  return (
    <group>
      {butterflies.map((b) => (
        <Butterfly 
          key={b.id} 
          offset={b.offset} 
          speed={b.speed} 
          centerPosition={b.centerPosition} 
        />
      ))}
    </group>
  );
};

export default Butterflies;
