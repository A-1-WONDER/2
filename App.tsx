import React, { useState } from 'react';
import Scene from './components/Scene';
import UIOverlay from './components/UIOverlay';
import { TreeMorphState } from './types';

const App: React.FC = () => {
  const [currentState, setCurrentState] = useState<TreeMorphState>(TreeMorphState.SCATTERED);

  return (
    <div className="relative w-full h-full bg-neutral-900 text-white overflow-hidden">
      {/* 3D Scene Background */}
      <div className="absolute inset-0 z-0">
        <Scene currentState={currentState} />
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <UIOverlay 
          currentState={currentState} 
          onToggleState={(newState) => setCurrentState(newState)} 
        />
      </div>
    </div>
  );
};

export default App;