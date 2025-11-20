
import React from 'react';
import { BookCover } from './BookCover';
import { BOOK_TITLE, BOOK_DESCRIPTION, BOOK_AUTHOR, bookPages } from '../services/bookContent';
import { ReadingProgress } from '../types';

interface HomeProps {
  onStartReading: () => void;
  progress: ReadingProgress | null;
  onSelectChapter: (pageId: number) => void;
}

export const Home: React.FC<HomeProps> = ({ onStartReading, progress, onSelectChapter }) => {
  const chapters = bookPages.filter(page => page.chapterTitle);
  const progressPercentage = progress 
    ? Math.round(((progress.lastReadPage + 1) / bookPages.length) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-[#101010] text-white pb-20 font-sans">
      {/* Navbar */}
      <nav className="px-6 md:px-16 py-6 flex items-center justify-between fixed w-full z-40 bg-gradient-to-b from-black/90 to-transparent transition-all duration-500">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center font-display font-bold text-lg shadow-[0_0_15px_rgba(220,38,38,0.5)]">E</div>
           <span className="font-semibold tracking-wide text-sm text-gray-200 hidden sm:block">ESSENCIALISTA READER</span>
        </div>
        <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-white cursor-pointer transition-colors">Biblioteca</span>
            <div className="w-8 h-8 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center hover:border-gray-500 transition-colors cursor-pointer">
                <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative w-full pt-32 pb-16 md:pt-48 md:pb-32 px-6 md:px-16 overflow-hidden">
         {/* Background Ambience */}
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10 scale-105 blur-sm"></div>
         <div className="absolute inset-0 bg-gradient-to-t from-[#101010] via-[#101010]/90 to-transparent"></div>
         <div className="absolute inset-0 bg-gradient-to-r from-[#101010] via-[#101010]/60 to-transparent"></div>
         
         <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end gap-10 md:gap-20 animate-fade-in-up">
            {/* Book Cover - Hero with reflection */}
            <div className="shrink-0 relative group perspective-1000">
               <div className="transform transition-transform duration-500 group-hover:rotate-y-6 group-hover:scale-105">
                 <BookCover />
               </div>
               {/* Reflection */}
               <div className="absolute -bottom-4 left-0 right-0 h-20 bg-gradient-to-b from-white/10 to-transparent opacity-50 blur-xl transform scale-y-[-1] origin-top pointer-events-none"></div>
            </div>

            {/* Info */}
            <div className="flex-1 text-left">
               <div className="flex items-center gap-3 mb-6 text-[10px] md:text-xs font-bold tracking-[0.2em] text-red-500 uppercase">
                  <span className="bg-red-900/20 px-2 py-1 rounded border border-red-900/30">Bestseller</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-400">Produtividade</span>
               </div>
               
               <h1 className="text-5xl md:text-7xl font-bold font-display mb-4 tracking-tighter text-white leading-none">
                  {BOOK_TITLE}
               </h1>
               <p className="text-xl md:text-2xl text-gray-400 mb-8 font-serif-book italic">
                  {BOOK_AUTHOR}
               </p>
               
               <p className="text-gray-300 max-w-xl mb-10 text-sm md:text-base leading-relaxed font-light border-l-2 border-zinc-700 pl-6">
                 {BOOK_DESCRIPTION}
               </p>

               <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                  {progress && progress.lastReadPage > 0 ? (
                    <div className="w-full sm:w-auto">
                        <button 
                            onClick={onStartReading}
                            className="bg-white text-black px-8 py-4 rounded font-bold flex items-center justify-center gap-3 hover:bg-gray-200 transition-all w-full sm:w-auto shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                            <div className="flex flex-col items-start">
                                <span className="text-xs font-normal uppercase tracking-wider text-gray-600">Continuar Lendo</span>
                                <span>Página {progress.lastReadPage + 1}</span>
                            </div>
                        </button>
                        {/* Progress Bar Under Button */}
                        <div className="mt-3 w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                             <div className="h-full bg-red-600" style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 text-center sm:text-left">{progressPercentage}% concluído</p>
                    </div>
                  ) : (
                    <button 
                        onClick={onStartReading}
                        className="bg-red-600 text-white px-10 py-4 rounded font-bold flex items-center justify-center gap-3 hover:bg-red-700 transition-all w-full sm:w-auto shadow-lg shadow-red-900/50 active:scale-95"
                    >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        Ler Agora
                    </button>
                  )}
                  
                  <button className="bg-zinc-800/50 text-white px-8 py-4 rounded font-bold flex items-center justify-center gap-3 hover:bg-zinc-700 transition-colors backdrop-blur-sm w-full sm:w-auto border border-white/5">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Detalhes
                  </button>
               </div>
            </div>
         </div>
      </div>

      {/* Chapters List */}
      <div className="px-6 md:px-16 max-w-7xl mx-auto">
         <div className="flex items-center justify-between mb-8 border-b border-zinc-800 pb-4">
             <h2 className="text-2xl font-bold text-white tracking-tight">Capítulos</h2>
             <span className="text-sm text-zinc-500">{chapters.length} seções</span>
         </div>
         
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {chapters.map((chapter, idx) => {
               // Check if chapter is completed (based on current progress)
               const isCompleted = progress ? progress.lastReadPage >= chapter.id : false;
               const isCurrent = progress && progress.lastReadPage >= (chapter.id - 5) && progress.lastReadPage < (chapters[idx+1]?.id || 9999);

               return (
               <div 
                  key={chapter.id}
                  onClick={() => onSelectChapter(chapter.id - 1)} 
                  className={`group p-5 rounded-lg cursor-pointer transition-all duration-300 border relative overflow-hidden
                    ${isCurrent 
                        ? 'bg-zinc-800 border-red-900/50 shadow-lg' 
                        : 'bg-[#181818] hover:bg-[#202020] border-zinc-800 hover:border-zinc-600'
                    }`}
               >
                  {isCompleted && (
                      <div className="absolute top-3 right-3 text-red-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      </div>
                  )}
                  
                  <div className="flex flex-col h-full">
                    <div className={`text-4xl font-display font-bold mb-3 transition-colors ${isCurrent ? 'text-red-500' : 'text-zinc-700 group-hover:text-zinc-500'}`}>
                        {String(idx + 1).padStart(2, '0')}
                    </div>
                    <h3 className={`font-medium text-sm line-clamp-2 mb-2 transition-colors ${isCurrent ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                       {chapter.chapterTitle?.replace(/CAPÍTULO \d+/, '').replace(/^\s*:\s*/, '') || `Capítulo ${idx + 1}`}
                    </h3>
                    
                    <div className="mt-auto pt-4 flex items-center justify-between opacity-60 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] uppercase tracking-wider text-zinc-500">Pág {chapter.id}</span>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${isCurrent ? 'border-red-500 bg-red-500 text-white' : 'border-zinc-600 group-hover:border-white'}`}>
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                    </div>
                  </div>
               </div>
            )})}
         </div>
      </div>
      <style>{`
        .perspective-1000 {
            perspective: 1000px;
        }
        .rotate-y-6 {
            transform: rotateY(-10deg);
        }
      `}</style>
    </div>
  );
};
