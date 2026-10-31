import React from 'react';

export const NeonSidebars: React.FC = () => {
  return (
    <>
      {/* Left Crisp Accent Strip */}
      <div 
        className="fixed top-0 left-0 bottom-0 w-1.5 md:w-2 z-40 pointer-events-none overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom, #ef4444, #22c55e, #3b82f6, #eab308, #ef4444)',
        }}
      >
        <div className="w-full h-24 bg-white/70 animate-laser" />
      </div>

      {/* Right Crisp Accent Strip */}
      <div 
        className="fixed top-0 right-0 bottom-0 w-1.5 md:w-2 z-40 pointer-events-none overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom, #3b82f6, #eab308, #ef4444, #22c55e, #3b82f6)',
        }}
      >
        <div className="w-full h-24 bg-white/70 animate-laser" style={{ animationDelay: '2s' }} />
      </div>

      {/* Top subtle crisp hairline */}
      <div 
        className="fixed top-0 left-0 right-0 h-[1.5px] z-40 pointer-events-none bg-gradient-to-r from-red-500 via-emerald-400 to-blue-500"
      />
    </>
  );
};
