
import React, { useState, useMemo } from 'react';
import { BOOK_TITLE, BOOK_AUTHOR, bookPages, BOOK_DESCRIPTION } from '../services/bookContent';
import { ReadingProgress } from '../types';
import { getUnlockedArtifacts, ARTIFACTS } from '../services/gamification';

interface HomeProps {
  onStartReading: () => void;
  progress: ReadingProgress | null;
  onSelectChapter: (pageId: number) => void;
  onOpenJourney: () => void;
}

export const Home: React.FC<HomeProps> = ({ onStartReading, progress, onSelectChapter, onOpenJourney }) => {
  const [activeTab, setActiveTab] = useState<'essencia' | 'explorar' | 'eliminar' | 'executar'>('essencia');
  
  const unlockedIds = getUnlockedArtifacts();
  const nextArtifact = ARTIFACTS.find(a => !unlockedIds.includes(a.id));
  
  // Group chapters by book parts for better organization
  const chapters = useMemo(() => bookPages.filter(p => p.chapterTitle), []);
  
  // Simple logic to map chapters to book sections (approximate based on book structure)
  const sections = {
    essencia: chapters.slice(0, 4), // Intro + Ch 1-3
    explorar: chapters.slice(4, 9), // Ch 4-8
    eliminar: chapters.slice(9, 14), // Ch 9-13
    executar: chapters.slice(14, 20), // Ch 14-20
  };

  const currentChapter = progress 
    ? chapters.find(c => c.id > progress.lastReadPage)?.chapterTitle || "Conclusão"
    : chapters[0].chapterTitle;

  const progressPercentage = progress 
    ? Math.round(((progress.lastReadPage + 1) / bookPages.length) * 100) 
    : 0;

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans selection:bg-amber-900/30">
      
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
      }}></div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 md:py-20">
        
        {/* Header / Greeting */}
        <header className="flex justify-between items-end mb-12 animate-fade-in-up">
           <div>
              <p className="text-amber-500 text-xs font-bold tracking-[0.2em] uppercase mb-2">{getTimeGreeting()}, Essencialista</p>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
                {progress ? 'Continue sua busca' : 'Inicie sua jornada'}
              </h1>
           </div>
           <div className="hidden md:block text-right">
              <p className="text-xs text-zinc-500 uppercase tracking-widest">Progresso Total</p>
              <p className="text-3xl font-bold text-zinc-200">{progressPercentage}%</p>
           </div>
        </header>

        {/* Hero Dashboard Card */}
        <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-8 md:p-12 backdrop-blur-xl shadow-2xl mb-16 flex flex-col md:flex-row items-center gap-10 md:gap-16 relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            {/* Action Area - Full Width since cover is removed */}
            <div className="flex-1 w-full text-center md:text-left relative z-10">
                <div className="mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                        {progress ? 'Lendo Agora:' : BOOK_TITLE}
                    </h2>
                    <p className="text-2xl text-amber-500 font-display italic mb-4">
                        {progress ? currentChapter : BOOK_AUTHOR}
                    </p>
                    {progress && (
                        <p className="text-base text-zinc-400 mt-2 max-w-2xl">
                            Você parou na página {progress.lastReadPage + 1}. 
                            {nextArtifact ? ` Continue para desbloquear: "${nextArtifact.title}".` : ' Continue sua leitura diária.'}
                        </p>
                    )}
                    {!progress && (
                         <p className="text-base text-zinc-400 mt-2 max-w-2xl leading-relaxed">
                            {BOOK_DESCRIPTION}
                         </p>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <button 
                        onClick={onStartReading}
                        className="bg-white text-black px-10 py-4 rounded-xl font-bold flex items-center gap-3 hover:bg-gray-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] active:scale-95 w-full sm:w-auto justify-center text-lg"
                    >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        {progress ? 'Continuar Leitura' : 'Começar a Ler'}
                    </button>
                    
                    <button 
                        onClick={onOpenJourney}
                        className="px-8 py-4 rounded-xl font-medium text-gray-300 border border-white/10 hover:bg-white/5 hover:text-white transition-all flex items-center gap-3 w-full sm:w-auto justify-center"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        Ver Conquistas ({unlockedIds.length})
                    </button>
                </div>
            </div>
        </div>

        {/* Artifacts Rail - "The Path" */}
        <div className="mb-16">
            <div className="flex justify-between items-end mb-6 px-2">
                <h3 className="text-lg font-bold text-white">Sua Coleção</h3>
                <span className="text-xs text-zinc-500 uppercase tracking-widest cursor-pointer hover:text-amber-500 transition-colors" onClick={onOpenJourney}>Ver Todos →</span>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar snap-x">
                {ARTIFACTS.map((artifact, i) => {
                    const isUnlocked = unlockedIds.includes(artifact.id);
                    return (
                        <div 
                            key={artifact.id}
                            onClick={onOpenJourney}
                            className={`shrink-0 w-40 aspect-[3/4] rounded-xl border border-white/5 relative overflow-hidden group cursor-pointer snap-start transition-all ${isUnlocked ? 'bg-zinc-900 hover:border-amber-500/50' : 'bg-zinc-900/30 opacity-50'}`}
                        >
                             {/* Status Indicator */}
                             <div className="absolute top-3 right-3">
                                 {isUnlocked ? (
                                     <div className="w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.8)]"></div>
                                 ) : (
                                     <svg className="w-3 h-3 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                 )}
                             </div>

                             {/* Card Content */}
                             <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                                 <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${isUnlocked ? 'bg-amber-500/10 text-amber-500' : 'bg-zinc-800 text-zinc-600'}`}>
                                     <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                         {isUnlocked ? <path d={artifact.iconPath} /> : <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />}
                                     </svg>
                                 </div>
                                 <p className={`text-xs font-bold leading-tight ${isUnlocked ? 'text-gray-200' : 'text-zinc-600'}`}>
                                     {isUnlocked ? artifact.title : `Capítulo ${Math.ceil((i+1)*2)}`}
                                 </p>
                             </div>
                        </div>
                    )
                })}
            </div>
        </div>

        {/* Organized Library */}
        <div>
            <div className="flex flex-wrap items-center gap-6 mb-8 border-b border-white/10 pb-1">
                {(['essencia', 'explorar', 'eliminar', 'executar'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-amber-500' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                        )}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                {sections[activeTab].map((chapter, idx) => (
                    <div 
                        key={chapter.id}
                        onClick={() => onSelectChapter(chapter.id - 1)}
                        className="group bg-zinc-900/50 border border-white/5 p-5 rounded-lg hover:bg-zinc-800 transition-all cursor-pointer flex items-center justify-between"
                    >
                        <div className="flex items-center gap-4">
                            <span className="text-zinc-600 font-display text-2xl font-bold group-hover:text-amber-500/50 transition-colors">
                                {String(chapters.indexOf(chapter) + 1).padStart(2, '0')}
                            </span>
                            <div>
                                <h4 className="text-gray-200 font-medium group-hover:text-white transition-colors">
                                    {chapter.chapterTitle?.replace(/CAPÍTULO \d+/, '').replace(/^\s*:\s*/, '') || `Capítulo`}
                                </h4>
                                <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1">
                                    ~ 5 min leitura
                                </p>
                            </div>
                        </div>
                        
                        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 group-hover:border-amber-500 group-hover:text-amber-500 transition-all">
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};
