import React from 'react';
import { TreeMorphState } from '../types';

interface UIOverlayProps {
  currentState: TreeMorphState;
  onToggleState: (state: TreeMorphState) => void;
}

const UIOverlay: React.FC<UIOverlayProps> = ({ currentState, onToggleState }) => {
  const isTree = currentState === TreeMorphState.TREE_SHAPE;

  return (
    <div className="w-full h-full flex flex-col justify-between p-8 md:p-12 pointer-events-none">
      
      {/* Header */}
      <header className="flex flex-col items-center md:items-start space-y-4 pointer-events-auto transition-opacity duration-1000 ease-in-out">
        <h1 className="font-serif text-4xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-arix-pink via-white to-arix-gold drop-shadow-lg tracking-wide">
          欣
        </h1>
        <div className="h-[1px] w-24 bg-gradient-to-r from-arix-gold to-transparent" />
        <p className="font-sans text-xs md:text-sm text-arix-pink opacity-80 max-w-[300px] md:max-w-md leading-relaxed tracking-wide">
          亲爱的，在浪漫的二十岁，请享受过程。勇敢地去做你认为正确的事。永远对自己抱有无限期待。祝热烈，祝自由，永远幸福。
        </p>
      </header>

      {/* Center Message (Shows when Tree is formed) */}
      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center transition-all duration-1000 ${isTree ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-xl scale-90'}`}>
        <h2 className="font-serif text-5xl md:text-7xl text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] whitespace-nowrap">
          Happy birthday
        </h2>
        <p className="font-serif italic text-xl md:text-3xl text-arix-gold mt-4 tracking-widest">
          一直幸运快乐
        </p>
      </div>

      {/* Controls */}
      <footer className="flex justify-center md:justify-end pb-8 pointer-events-auto">
        <button
          onClick={() => onToggleState(isTree ? TreeMorphState.SCATTERED : TreeMorphState.TREE_SHAPE)}
          className="group relative px-8 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-full overflow-hidden transition-all duration-500 hover:bg-white/10 hover:border-arix-gold/50"
        >
          <div className={`absolute inset-0 bg-arix-gold/20 transition-transform duration-500 ease-out origin-left ${isTree ? 'scale-x-100' : 'scale-x-0'}`} />
          
          <span className="relative flex items-center space-x-3">
            <span className={`w-2 h-2 rounded-full transition-colors duration-500 ${isTree ? 'bg-arix-gold shadow-[0_0_8px_#D4AF37]' : 'bg-white/50'}`} />
            <span className="font-sans text-sm tracking-widest uppercase text-white font-light">
              {isTree ? 'Release Magic' : 'Make a Wish'}
            </span>
          </span>
        </button>
      </footer>
    </div>
  );
};

export default UIOverlay;