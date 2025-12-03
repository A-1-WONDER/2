import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { TreeMorphState } from '../types';
import InteractiveParticles from './InteractiveParticles';
import TreeDecorations from './TreeDecorations';
import Bubbles from './Bubbles';

interface SceneProps {
  currentState: TreeMorphState;
}

const Scene: React.FC<SceneProps> = ({ currentState }) => {
  return (
    <Canvas
      dpr={[1, 2]} // Handle high DPI screens
      shadows
      gl={{ 
        antialias: false, 
        toneMapping: 3, // ACESFilmicToneMapping
        toneMappingExposure: 1.2 
      }}
    >
      <PerspectiveCamera makeDefault position={[0, 2, 14]} fov={45} />
      
      {/* Cinematic Lighting Setup */}
      {/* Low ambient for deep shadows */}
      <ambientLight intensity={0.05} color="#2a0a10" />
      
      {/* Main Key Light - Sharp, bright, casting defined shadows */}
      <spotLight 
        position={[10, 15, 10]} 
        angle={0.25} 
        penumbra={0.4} 
        intensity={80} 
        castShadow 
        shadow-bias={-0.0001}
        color="#fff0fa" // Cool white/pinkish
      />
      
      {/* Rim Light - Gold backlight for dramatic edge highlights */}
      <spotLight 
        position={[-10, 8, -8]} 
        angle={0.4} 
        penumbra={0.5} 
        intensity={100} 
        color="#D4AF37" // Gold
        castShadow
      />

      {/* Fill Light - Soft pink from the opposite side to lift shadows slightly */}
      <pointLight position={[-8, 0, 8]} intensity={20} color="#ff1493" distance={20} decay={2} />

      {/* Uplight - Adds magical glow from bottom */}
      <spotLight
        position={[0, -8, 2]}
        angle={0.6}
        penumbra={1}
        intensity={30}
        color="#F8D9E0"
        distance={15}
      />

      <Suspense fallback={null}>
        <Environment preset="city" environmentIntensity={0.8} />
        <InteractiveParticles currentState={currentState} />
        <TreeDecorations currentState={currentState} />
        <Bubbles />
      </Suspense>

      <OrbitControls 
        enableZoom={true} 
        minDistance={5} 
        maxDistance={25}
        autoRotate={currentState === TreeMorphState.TREE_SHAPE}
        autoRotateSpeed={0.8}
        maxPolarAngle={Math.PI / 1.5} // Prevent going too far below
      />

      {/* Post Processing */}
      <EffectComposer>
        <Bloom 
          luminanceThreshold={1.5} 
          mipmapBlur 
          intensity={1.5} 
          radius={0.5} 
        />
        <Vignette eskil={false} offset={0.1} darkness={0.8} />
        {/* Reduced noise opacity for cleaner look */}
        <Noise opacity={0.015} />
      </EffectComposer>
      
      {/* Background Color - Deep rich dark */}
      <color attach="background" args={['#050203']} />
      <fog attach="fog" args={['#050203', 10, 40]} />
    </Canvas>
  );
};

export default Scene;