
import React, { useEffect, useState } from 'react';
import { ARTIFACTS, getUnlockedArtifacts } from '../services/gamification';
import { playClick } from '../services/soundService';

interface JourneyProps {
  onBack: () => void;
}

export const Journey: React.FC<JourneyProps> = ({ onBack }) => {
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);

  useEffect(() => {
    setUnlockedIds(getUnlockedArtifacts());
  }, []);

  const handleBack = () => {
      playClick();
      onBack();
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'Legendary': return 'border-amber-500 shadow-amber-900/40';
      case 'Epic': return 'border-fuchsia-500 shadow-fuchsia-900/40';
      case 'Rare': return 'border-blue-500 shadow-blue-900/40';
      default: return 'border-zinc-600';
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5f2] dark:bg-[#101010] text-gray-900 dark:text-white font-sans pb-20 transition-colors duration-300">
       {/* Header */}
       <div className="sticky top-0 z-30 bg-[#f8f5f2]/90 dark:bg-[#101010]/90 backdrop-blur-md border-b border-gray-200 dark:border-white/5 px-6 py-4 flex items-center justify-between">
           <div className="flex items-center gap-4">
               <button onClick={handleBack} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                  <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
               </button>
               <h1 className="text-xl font-display font-bold tracking-wide text-amber-600 dark:text-amber-500">Sua Jornada</h1>
           </div>
           <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
               {unlockedIds.length} / {ARTIFACTS.length} Artefatos
           </div>
       </div>

       {/* Grid */}
       <div className="max-w-7xl mx-auto p-6 md:p-12">
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
               {ARTIFACTS.map((artifact) => {
                   const isUnlocked = unlockedIds.includes(artifact.id);
                   return (
                       <div 
                          key={artifact.id}
                          className={`relative group aspect-[3/4] rounded-xl border-2 transition-all duration-500 
                            ${isUnlocked 
                                ? `bg-white dark:bg-zinc-900 ${getRarityBorder(artifact.rarity)} shadow-xl hover:scale-105` 
                                : 'bg-gray-200 dark:bg-zinc-900/50 border-gray-300 dark:border-zinc-800 grayscale opacity-60'}`}
                       >
                           {/* Card Content */}
                           <div className="absolute inset-0 flex flex-col items-center justify-between p-6">
                               
                               {/* Top Rarity */}
                               <div className="w-full flex justify-between items-center">
                                   <span className={`text-[10px] font-bold uppercase tracking-widest ${isUnlocked ? 'text-gray-400 dark:text-white/70' : 'text-gray-400 dark:text-white/20'}`}>
                                       {isUnlocked ? artifact.rarity : 'Bloqueado'}
                                   </span>
                                   {isUnlocked && (
                                       <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                   )}
                               </div>

                               {/* Icon */}
                               <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-700 ${isUnlocked ? 'bg-gradient-to-br from-gray-100 to-white dark:from-white/10 dark:to-transparent shadow-inner' : 'bg-gray-300 dark:bg-black/20'}`}>
                                   <svg className={`w-16 h-16 ${isUnlocked ? 'text-amber-600 dark:text-amber-100 drop-shadow-[0_0_8px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'text-gray-500 dark:text-zinc-700'}`} fill="currentColor" viewBox="0 0 24 24">
                                      {isUnlocked ? <path d={artifact.iconPath} /> : <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />}
                                   </svg>
                               </div>

                               {/* Text */}
                               <div className="text-center">
                                   <h3 className={`font-display font-bold text-xl mb-2 ${isUnlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-zinc-600'}`}>
                                       {isUnlocked ? artifact.title : '???'}
                                   </h3>
                                   <p className={`text-xs font-serif-book leading-relaxed ${isUnlocked ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400 dark:text-zinc-700'}`}>
                                       {isUnlocked ? artifact.description : 'Continue lendo para descobrir este artefato.'}
                                   </p>
                               </div>
                           </div>
                       </div>
                   );
               })}
           </div>
       </div>
    </div>
  );
};
