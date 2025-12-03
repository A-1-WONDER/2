import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, Color, InstancedMesh, Object3D, MathUtils } from 'three';
import { TreeMorphState, ParticleData } from '../types';

// Utility to generate random coordinates within a sphere
const randomInSphere = (radius: number): Vector3 => {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const r = Math.cbrt(Math.random()) * radius;
  const sinPhi = Math.sin(phi);
  return new Vector3(
    r * sinPhi * Math.cos(theta),
    r * sinPhi * Math.sin(theta),
    r * Math.cos(phi)
  );
};

// Utility to generate tree position
const generateTreePosition = (): Vector3 => {
  let treePos = new Vector3();
  const tier = Math.random();
  let radius = 0;
  let yBase = 0;
  let height = 0;

  if (tier < 0.5) {
    // Bottom Tier (Base)
    radius = 3.5;
    height = 2;
    yBase = -2;
  } else if (tier < 0.85) {
    // Middle Tier
    radius = 2.2;
    height = 1.8;
    yBase = 0;
  } else {
    // Top Tier
    radius = 1.0;
    height = 1.2;
    yBase = 1.8;
  }

  // Distribute within the cylinder shell
  const angle = Math.random() * Math.PI * 2;
  // Add some thickness variance to the shell
  const r = radius * (0.8 + Math.random() * 0.4); 
  const y = yBase + (Math.random() * height);
  
  treePos.set(
    Math.cos(angle) * r,
    y,
    Math.sin(angle) * r
  );
  return treePos;
};

interface InteractiveParticlesProps {
  currentState: TreeMorphState;
}

const PARTICLE_COUNT = 1500;
const CUBE_COUNT = 500; // New white cubes
const ANIMATION_SPEED = 2.0;

const InteractiveParticles: React.FC<InteractiveParticlesProps> = ({ currentState }) => {
  const meshRef = useRef<InstancedMesh>(null); // For Gems
  const cubeMeshRef = useRef<InstancedMesh>(null); // For Cubes
  
  const dummy = useMemo(() => new Object3D(), []);
  
  // State to track the interpolation factor (0 = scattered, 1 = tree)
  const morphTarget = useRef(0);
  const currentMorph = useRef(0);

  // --- GEM DATA ---
  const particles = useMemo(() => {
    const tempParticles: ParticleData[] = [];
    const colorPalette = [
      new Color('#FFD1DC'), // Pale Pink
      new Color('#FFFFFF'), // White
      new Color('#FFF0F5'), // Lavender Blush
      new Color('#FFD700'), // Gold / Yellow (Restored)
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      tempParticles.push({
        id: i,
        scatterPosition: randomInSphere(12),
        treePosition: generateTreePosition(),
        color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
        scale: 0.05 + Math.random() * 0.15, 
        rotationSpeed: new Vector3(
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 0.5
        )
      });
    }
    return tempParticles;
  }, []);

  // --- CUBE DATA ---
  const cubeParticles = useMemo(() => {
    const tempParticles: ParticleData[] = [];
    const whiteColor = new Color('#FFFFFF');

    for (let i = 0; i < CUBE_COUNT; i++) {
      tempParticles.push({
        id: i + PARTICLE_COUNT, // Offset ID
        scatterPosition: randomInSphere(12),
        treePosition: generateTreePosition(),
        color: whiteColor,
        scale: 0.05 + Math.random() * 0.12, // Slightly smaller or similar to gems
        rotationSpeed: new Vector3(
          (Math.random() - 0.5) * 0.3, 
          (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.3
        )
      });
    }
    return tempParticles;
  }, []);

  // Set colors initially for Gems (Cubes are all white, can set in material or loop)
  useEffect(() => {
    if (meshRef.current) {
      particles.forEach((p, i) => {
        meshRef.current!.setColorAt(i, p.color);
      });
      meshRef.current.instanceColor!.needsUpdate = true;
    }
    if (cubeMeshRef.current) {
      // Initialize cubes as white
      const white = new Color('#FFFFFF');
      cubeParticles.forEach((p, i) => {
        cubeMeshRef.current!.setColorAt(i, white);
      });
      cubeMeshRef.current.instanceColor!.needsUpdate = true;
    }
  }, [particles, cubeParticles]);

  // Update target based on prop
  useEffect(() => {
    morphTarget.current = currentState === TreeMorphState.TREE_SHAPE ? 1 : 0;
  }, [currentState]);

  // Animation Loop
  useFrame((state, delta) => {
    const step = delta * ANIMATION_SPEED;
    if (Math.abs(currentMorph.current - morphTarget.current) > 0.001) {
       currentMorph.current = MathUtils.lerp(currentMorph.current, morphTarget.current, step);
    }

    const t = currentMorph.current;
    const easedT = t * t * (3 - 2 * t);
    const time = state.clock.getElapsedTime();

    // Helper function to animate a particle set
    const animateParticles = (
      data: ParticleData[], 
      mesh: InstancedMesh | null, 
      scaleBase: number
    ) => {
      if (!mesh) return;
      
      data.forEach((particle, i) => {
        // Interpolate position
        const x = MathUtils.lerp(particle.scatterPosition.x, particle.treePosition.x, easedT);
        const y = MathUtils.lerp(particle.scatterPosition.y, particle.treePosition.y, easedT);
        const z = MathUtils.lerp(particle.scatterPosition.z, particle.treePosition.z, easedT);

        dummy.position.set(x, y, z);

        // Add floating motion
        const floatIntensity = MathUtils.lerp(0.5, 0.05, easedT);
        dummy.position.y += Math.sin(time * 0.5 + particle.id * 0.1) * 0.2 * floatIntensity;
        dummy.position.x += Math.cos(time * 0.3 + particle.id * 0.1) * 0.2 * floatIntensity;

        // Rotation
        dummy.rotation.set(
          time * particle.rotationSpeed.x,
          time * particle.rotationSpeed.y,
          time * particle.rotationSpeed.z
        );

        // Scale
        const scaleMultiplier = MathUtils.lerp(1, 1.2, easedT); 
        dummy.scale.setScalar(particle.scale * scaleMultiplier * scaleBase);

        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
    };

    // Animate Gems
    animateParticles(particles, meshRef.current, 1);
    
    // Animate Cubes
    animateParticles(cubeParticles, cubeMeshRef.current, 1);
  });

  return (
    <group>
      {/* 1. GEMS (Icosahedron) */}
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, PARTICLE_COUNT]}
        castShadow
        receiveShadow
      >
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          roughness={0.15}
          metalness={0.9}
          emissive="#ff0055"
          emissiveIntensity={0.1}
        />
      </instancedMesh>

      {/* 2. CUBES (Box) - Pure White */}
      <instancedMesh
        ref={cubeMeshRef}
        args={[undefined, undefined, CUBE_COUNT]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          roughness={0.2}
          metalness={0.6}
          color="#FFFFFF"
          emissive="#FFFFFF"
          emissiveIntensity={0.3}
        />
      </instancedMesh>
    </group>
  );
};

export default InteractiveParticles;