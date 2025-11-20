
import React, { useEffect, useState } from 'react';
import { ArtifactCard } from '../types';

interface UnlockModalProps {
  artifact: ArtifactCard;
  onClose: () => void;
}

export const UnlockModal: React.FC<UnlockModalProps> = ({ artifact, onClose }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Trigger animation
    setTimeout(() => setShow(true), 100);
  }, []);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Legendary': return 'from-amber-300 via-yellow-500 to-amber-600';
      case 'Epic': return 'from-purple-300 via-fuchsia-500 to-purple-600';
      case 'Rare': return 'from-blue-300 via-cyan-500 to-blue-600';
      default: return 'from-gray-300 via-gray-400 to-gray-500';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity duration-500" onClick={onClose}></div>
      
      <div className={`relative w-full max-w-md transform transition-all duration-1000 ${show ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 translate-y-20'}`}>
        
        {/* Rays of light effect */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r ${getRarityColor(artifact.rarity)} rounded-full opacity-20 blur-3xl animate-pulse`}></div>

        {/* The Card */}
        <div className="bg-[#1a1a1a] border-2 border-amber-500/50 rounded-xl overflow-hidden shadow-2xl shadow-amber-500/20 flex flex-col items-center text-center relative">
            {/* Rarity Ribbon */}
            <div className={`w-full h-2 bg-gradient-to-r ${getRarityColor(artifact.rarity)}`}></div>
            
            <div className="pt-8 pb-4">
                 <span className={`text-xs font-bold tracking-[0.3em] uppercase bg-clip-text text-transparent bg-gradient-to-r ${getRarityColor(artifact.rarity)}`}>
                    {artifact.rarity} {artifact.archetype}
                 </span>
            </div>

            <h2 className="text-3xl font-display font-bold text-white mb-2 px-4 drop-shadow-lg">{artifact.title}</h2>
            
            {/* Icon Container */}
            <div className="my-6 relative">
                 <div className={`absolute inset-0 bg-gradient-to-br ${getRarityColor(artifact.rarity)} opacity-20 blur-xl rounded-full`}></div>
                 <div className={`relative w-32 h-32 rounded-full border border-white/10 bg-black/50 flex items-center justify-center text-white shadow-inner`}>
                    <svg className="w-16 h-16 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" fill="currentColor" viewBox="0 0 24 24">
                         <path d={artifact.iconPath || "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"} />
                    </svg>
                 </div>
            </div>

            <div className="px-8 pb-8">
                <p className="text-gray-300 font-serif-book italic leading-relaxed text-lg">
                    "{artifact.description}"
                </p>
            </div>

            <div className="w-full p-4 bg-white/5 border-t border-white/5">
                <button 
                    onClick={onClose}
                    className="w-full py-3 px-6 rounded bg-amber-600 hover:bg-amber-500 text-white font-bold tracking-widest uppercase text-xs transition-all duration-300 shadow-[0_0_20px_rgba(217,119,6,0.3)] hover:shadow-[0_0_30px_rgba(217,119,6,0.5)]"
                >
                    Coletar Recompensa
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
