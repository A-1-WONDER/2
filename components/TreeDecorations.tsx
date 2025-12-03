import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, MathUtils } from 'three';
import { TreeMorphState } from '../types';

interface TreeDecorationsProps {
  currentState: TreeMorphState;
}

const Bowtie = () => {
  // A stylized bowtie made of primitives
  // Opaque solid material with glow
  const materialProps = {
    color: "#F8D9E0", // Pink
    metalness: 0.3,
    roughness: 0.2, // Slightly glossy
    transparent: false, // Changed to Opaque
    emissive: "#FFB6C1", // Glowing Pink
    emissiveIntensity: 1.5, // High intensity for bloom
    toneMapped: false // bypass tonemapping so it hits bloom threshold
  };

  return (
    <group position={[0, 3.4, 0]} rotation={[0, 0, 0]}>
      {/* Center Knot REMOVED as per request */}
      
      {/* Left Loop */}
      <mesh position={[-0.4, 0, 0]} rotation={[0, 0, Math.PI / 1.8]} castShadow>
        <torusGeometry args={[0.5, 0.2, 16, 32]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
      
      {/* Right Loop */}
      <mesh position={[0.4, 0, 0]} rotation={[0, 0, -Math.PI / 1.8]} castShadow>
        <torusGeometry args={[0.5, 0.2, 16, 32]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
    </group>
  );
};

const TreeDecorations: React.FC<TreeDecorationsProps> = ({ currentState }) => {
  const groupRef = useRef<Group>(null);
  
  // Animation state
  const opacity = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Fade in/out based on state
    // Just handling visibility/scale for the bowtie now since ribbons are removed
    const targetScale = currentState === TreeMorphState.TREE_SHAPE ? 1 : 0;
    
    // Smooth opacity/scale transition
    opacity.current = MathUtils.lerp(opacity.current, targetScale, delta * 2.0);

    // Visibility toggle to save performance
    groupRef.current.visible = opacity.current > 0.01;
    
    // Scale effect for assembly
    groupRef.current.scale.setScalar(opacity.current);

    // Gentle rotation of the decoration group
    if (currentState === TreeMorphState.TREE_SHAPE) {
        groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <Bowtie />
    </group>
  );
};

export default TreeDecorations;