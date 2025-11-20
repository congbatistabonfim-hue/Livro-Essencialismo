
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { BookPage, Bookmark, ArtifactCard } from '../types';
import { saveProgress, saveBookmarks, getBookmarks } from '../services/storageService';
import { checkAndUnlockArtifact } from '../services/gamification';
import { UnlockModal } from './UnlockModal';
import { useTheme } from '../contexts/ThemeContext';
import { playClick, playPageTurn } from '../services/soundService';

interface ReaderProps {
  pages: BookPage[];
  initialPageIndex: number;
  onClose: () => void;
}

export const Reader: React.FC<ReaderProps> = ({ pages, initialPageIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialPageIndex);
  const [fontSize, setFontSize] = useState(19);
  const [showControls, setShowControls] = useState(true);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [showBookmarksSidebar, setShowBookmarksSidebar] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [unlockedArtifact, setUnlockedArtifact] = useState<ArtifactCard | null>(null);
  
  const { theme, toggleTheme } = useTheme();
  
  // Navigation & Highlight State
  const [activeBlockIndex, setActiveBlockIndex] = useState<number>(-1);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Audio State
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);

  const currentPage = pages[currentIndex];
  const totalPages = pages.length;
  const progressPercentage = Math.round(((currentIndex + 1) / totalPages) * 100);
  
  const isBookmarked = useMemo(() => {
    return bookmarks.some(b => b.pageId === currentPage.id);
  }, [bookmarks, currentPage.id]);

  // Load bookmarks on mount
  useEffect(() => {
    setBookmarks(getBookmarks());
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Save progress and audio cleanup
  useEffect(() => {
    saveProgress(currentIndex);
    window.speechSynthesis.cancel();
    setIsReading(false);
    setIsPaused(false);
    setActiveBlockIndex(-1);
    blockRefs.current = [];
    
    const artifact = checkAndUnlockArtifact(currentPage.id);
    if (artifact) {
        // Sound will be played inside UnlockModal when it mounts
        setUnlockedArtifact(artifact);
    }
  }, [currentIndex, currentPage.id]);

  // Calculate reading time
  const readingTime = useMemo(() => {
    if (!currentPage.content) return 1;
    const words = currentPage.content.split(/\s+/).length;
    return Math.ceil(words / 200);
  }, [currentPage]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning || unlockedArtifact) return;
      
      if (e.key === 'ArrowRight') {
          changePage(currentIndex + 1);
      } else if (e.key === 'ArrowLeft') {
          changePage(currentIndex - 1);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const totalBlocks = blockRefs.current.length;
        if (activeBlockIndex < totalBlocks - 1) {
          const nextIndex = activeBlockIndex + 1;
          setActiveBlockIndex(nextIndex);
          blockRefs.current[nextIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (activeBlockIndex > 0) {
          const prevIndex = activeBlockIndex - 1;
          setActiveBlockIndex(prevIndex);
          blockRefs.current[prevIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
           setActiveBlockIndex(-1);
           if (scrollContainerRef.current) scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else if (e.key === 'Escape') {
        if (showBookmarksSidebar) setShowBookmarksSidebar(false);
        else handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, showBookmarksSidebar, isTransitioning, activeBlockIndex, unlockedArtifact]);

  // Auto-hide controls
  useEffect(() => {
    const resetControls = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        window.clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = window.setTimeout(() => {
        if (!showBookmarksSidebar) {
           setShowControls(false);
        }
      }, 3000);
    };

    window.addEventListener('mousemove', resetControls);
    window.addEventListener('touchstart', resetControls);
    window.addEventListener('click', resetControls);
    
    resetControls();

    return () => {
      window.removeEventListener('mousemove', resetControls);
      window.removeEventListener('touchstart', resetControls);
      window.removeEventListener('click', resetControls);
      if (controlsTimeoutRef.current) window.clearTimeout(controlsTimeoutRef.current);
    };
  }, [showBookmarksSidebar]);

  const changePage = (newIndex: number) => {
    if (newIndex < 0 || newIndex >= pages.length) return;
    
    playPageTurn(); // Sound effect
    
    setIsTransitioning(true);
    setTimeout(() => {
        setCurrentIndex(newIndex);
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
        }
        setTimeout(() => {
            setIsTransitioning(false);
        }, 50);
    }, 300);
  };

  const handleNext = () => changePage(currentIndex + 1);
  const handlePrev = () => changePage(currentIndex - 1);
  
  const handleClose = () => {
      playClick();
      onClose();
  };

  const toggleBookmark = () => {
    playClick();
    let newBookmarks;
    if (isBookmarked) {
      newBookmarks = bookmarks.filter(b => b.pageId !== currentPage.id);
    } else {
      const preview = currentPage.content.slice(0, 100).replace(/\n/g, ' ') + '...';
      const chapterTitle = currentPage.chapterTitle || `Página ${currentPage.id}`;
      const newBookmark: Bookmark = {
        pageId: currentPage.id,
        chapterTitle,
        preview,
        createdAt: Date.now()
      };
      newBookmarks = [...bookmarks, newBookmark];
    }
    setBookmarks(newBookmarks);
    saveBookmarks(newBookmarks);
  };

  const handleJumpToBookmark = (pageId: number) => {
      playClick();
      const index = pages.findIndex(p => p.id === pageId);
      if (index !== -1) {
          changePage(index);
          setShowBookmarksSidebar(false);
      }
  };
  
  const handleThemeToggle = () => {
      playClick();
      toggleTheme();
  };

  // Audio Functions
  const toggleReading = () => {
    playClick();
    if (isReading) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    } else {
      startSpeaking();
    }
  };

  const startSpeaking = () => {
    const textToRead = currentPage.content || "";
    if (!textToRead) return;
    window.speechSynthesis.cancel(); 
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'pt-BR';
    utterance.rate = playbackRate;
    utterance.onend = () => { setIsReading(false); setIsPaused(false); };
    utterance.onerror = (e) => { console.error("Speech error", e); setIsReading(false); setIsPaused(false); };
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsReading(true);
    setIsPaused(false);
  };

  const changePlaybackRate = () => {
      playClick();
      const rates = [1, 1.5, 2, 0.75];
      const nextIndex = (rates.indexOf(playbackRate) + 1) % rates.length;
      const newRate = rates[nextIndex];
      setPlaybackRate(newRate);
      if (isReading) {
          window.speechSynthesis.cancel();
          setTimeout(() => {
             const textToRead = currentPage.content || "";
             const utterance = new SpeechSynthesisUtterance(textToRead);
             utterance.lang = 'pt-BR';
             utterance.rate = newRate;
             utterance.onend = () => { setIsReading(false); setIsPaused(false); };
             window.speechSynthesis.speak(utterance);
             setIsReading(true);
             setIsPaused(false);
          }, 50);
      }
  };
  
  // Enhanced Text Formatter with Block Refs
  const formatText = (text: string) => {
    if (!text) return null;
    const normalizedText = text.replace(/\n{3,}/g, '\n\n');
    const rawParagraphs = normalizedText.split(/\n\s*\n/);

    blockRefs.current = blockRefs.current.slice(0, rawParagraphs.length);

    return rawParagraphs.map((paragraph, idx) => {
      let trimmed = paragraph.trim();
      if (!trimmed) return null;

      const isChapterTitle = /^(CAPÍTULO|APÊNDICE|SUMÁRIO|AGRADECIMENTOS|NOTAS|SOBRE O AUTOR|CONHEÇA OUTROS|INTRODUÇÃO|PREFÁCIO)/i.test(trimmed);
      const isParteSection = /^(Primeira|Segunda|Terceira|Quarta)\s+parte:/i.test(trimmed);
      const isShortUpperCase = trimmed.length > 3 && trimmed.length < 60 && trimmed === trimmed.toUpperCase() && !/[.!?]$/.test(trimmed);
      const isSubtitle = (isShortUpperCase || isParteSection) && !isChapterTitle;
      const isDialogue = trimmed.startsWith('—') || trimmed.startsWith('-');
      const isNumberList = /^\d+\./.test(trimmed);
      const isBulletList = /^[\-•]/.test(trimmed);
      const isBlockQuote = (trimmed.startsWith('“') && trimmed.endsWith('”')) && trimmed.length > 100;

      const isActive = idx === activeBlockIndex;
      const baseClasses = `transition-all duration-500 ease-in-out rounded-lg px-4 py-2 mb-6 border-l-4 ${isActive ? 'bg-gray-100/50 dark:bg-white/5 border-amber-600 dark:border-amber-500 shadow-lg' : 'border-transparent hover:border-gray-300 dark:hover:border-zinc-800'}`;

      const assignRef = (el: HTMLDivElement | null) => {
         blockRefs.current[idx] = el;
      };

      if (isChapterTitle) {
        return (
          <div key={idx} ref={assignRef} className="mt-24 mb-16 text-center animate-fade-in-up">
            <span className="text-red-600 dark:text-red-500/80 text-xs font-bold tracking-[0.4em] uppercase mb-6 block">Nova Seção</span>
            <div className="flex items-center justify-center gap-4 md:gap-6 group">
                <h2 className="text-5xl md:text-6xl font-display font-bold text-amber-600 dark:text-amber-500 italic tracking-tight leading-none drop-shadow-md">
                  {trimmed}
                </h2>
                <button
                    onClick={(e) => { e.stopPropagation(); toggleReading(); }}
                    className={`w-12 h-12 flex items-center justify-center rounded-full border-2 transition-all duration-300 shadow-lg ${isReading && !isPaused ? 'bg-amber-500 border-amber-500 text-white dark:text-black animate-pulse' : 'border-amber-500/30 text-amber-600 dark:text-amber-500 hover:bg-amber-500/10 hover:border-amber-500'}`}
                >
                    {isReading && !isPaused ? (
                         <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                    ) : (
                         <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    )}
                </button>
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-600/60 to-transparent mx-auto mt-10 rounded-full"></div>
          </div>
        );
      }

      if (isSubtitle) {
        return (
          <div key={idx} ref={assignRef} className={`${baseClasses}`}>
             <h3 className="text-xl md:text-2xl font-display italic font-semibold text-red-700 dark:text-red-100/90 tracking-wide pl-2 py-1">
                {trimmed}
             </h3>
          </div>
        );
      }

      if (isBlockQuote) {
        return (
          <div key={idx} ref={assignRef} className={`${baseClasses}`}>
              <blockquote className="pl-4 md:pl-6 border-l-2 border-amber-500/50 italic text-amber-700 dark:text-amber-100/80 font-serif-book text-lg md:text-xl leading-relaxed bg-amber-50 dark:bg-transparent p-2 rounded">
                "{trimmed.replace(/^“|”$/g, '')}"
              </blockquote>
          </div>
        );
      }

      if (isDialogue) {
        const cleanDialogue = trimmed.replace(/^[—-] /, '');
        return (
            <div key={idx} ref={assignRef} className={`${baseClasses} group`}>
               <div className="relative pl-4 md:pl-6">
                 <span className="absolute left-0 top-0 text-red-600 dark:text-red-500 font-serif-book text-xl">—</span>
                 <p className="text-justify text-gray-800 dark:text-gray-300 leading-loose font-serif-book hyphens-auto">
                   {cleanDialogue}
                 </p>
               </div>
            </div>
        );
      }

      if (isNumberList || isBulletList) {
         const isNum = isNumberList;
         const marker = isNum ? trimmed.split('.')[0] + '.' : '•';
         const content = trimmed.replace(/^\d+\.|^[\-•]/, '').trim();
         return (
             <div key={idx} ref={assignRef} className={`${baseClasses}`}>
                 <div className="pl-4 md:pl-8 relative flex items-baseline">
                     <span className="absolute left-0 text-amber-600 dark:text-amber-500 font-bold font-mono text-sm">
                        {marker}
                     </span>
                     <p className="text-justify text-gray-800 dark:text-gray-300 leading-loose font-serif-book hyphens-auto">
                        {content}
                     </p>
                 </div>
             </div>
         )
      }

      return (
        <div key={idx} ref={assignRef} className={`${baseClasses}`}>
            <p className="text-justify text-gray-800 dark:text-gray-300/90 leading-loose font-serif-book hyphens-auto tracking-normal antialiased">
              {trimmed}
            </p>
        </div>
      );
    });
  };

  return (
    <div className="fixed inset-0 bg-[#fdfbf7] dark:bg-[#101010] flex flex-col z-50 text-gray-800 dark:text-gray-300 font-sans selection:bg-amber-200 dark:selection:bg-amber-900/40 selection:text-black dark:selection:text-amber-100 transition-colors duration-300">
      
      {/* Header Controls */}
      <div className={`absolute top-0 left-0 right-0 transition-transform duration-300 z-30 ${showControls ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="bg-gradient-to-b from-white/95 to-white/0 dark:from-black/95 dark:to-black/0 px-4 md:px-8 pt-6 pb-12 flex items-center justify-between">
            
            {/* Left: Navigation Controls */}
            <div className="flex items-center gap-2">
                {/* Home/Index Button */}
                <button 
                    onClick={handleClose}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/15 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-all backdrop-blur-md border border-gray-200 dark:border-white/5 group"
                    title="Voltar ao Índice"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
                    <span className="hidden md:inline text-xs font-bold tracking-widest uppercase">Índice</span>
                </button>

                {/* Previous Chapter Button */}
                <button 
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/15 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-all backdrop-blur-md border border-gray-200 dark:border-white/5 ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title="Capítulo Anterior"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    <span className="hidden md:inline text-xs font-bold tracking-widest uppercase">Anterior</span>
                </button>
            </div>

            {/* Right: Tools */}
            <div className="flex items-center gap-3">
                
                 {/* Theme Toggle */}
                <button 
                  onClick={handleThemeToggle}
                  className="p-2 rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
                  title={theme === 'dark' ? "Modo Claro" : "Modo Escuro"}
                >
                  {theme === 'dark' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                  )}
                </button>

                {/* Audio Controls */}
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-black/40 backdrop-blur-md px-1 py-1 rounded-full border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-lg mr-2">
                   <button
                      onClick={toggleReading}
                      className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${isReading && !isPaused ? 'bg-amber-500 text-white dark:text-black' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10'}`}
                      title={isReading && !isPaused ? "Pausar Leitura" : "Ler em Voz Alta"}
                   >
                      {isReading && !isPaused ? (
                         <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                      ) : (
                         <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      )}
                   </button>
                   <button
                      onClick={changePlaybackRate}
                      className="w-10 h-8 flex items-center justify-center rounded-full text-[10px] font-bold text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
                      title="Velocidade de Leitura"
                   >
                      {playbackRate}x
                   </button>
                </div>

                {/* Bookmark Toggle */}
                <button
                   onClick={toggleBookmark}
                   className={`p-2 rounded-full transition-all ${isBookmarked ? 'text-amber-500 bg-amber-500/10' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10'}`}
                   title={isBookmarked ? "Remover marcador" : "Adicionar marcador"}
                >
                    <svg className="w-5 h-5" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                </button>

                {/* Bookmarks List Toggle */}
                <button 
                    onClick={() => { playClick(); setShowBookmarksSidebar(true); }}
                    className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all relative"
                    title="Meus Marcadores"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    {bookmarks.length > 0 && (
                        <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full"></span>
                    )}
                </button>

                {/* Font Controls */}
                <div className="flex items-center gap-3 bg-gray-100 dark:bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-lg ml-2">
                    <button 
                        onClick={() => { playClick(); setFontSize(s => Math.max(16, s - 1)); }} 
                        className="text-xs font-serif-book text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors w-6 text-center"
                    >
                        A-
                    </button>
                    <div className="h-3 w-px bg-gray-300 dark:bg-white/20"></div>
                    <button 
                        onClick={() => { playClick(); setFontSize(s => Math.min(26, s + 1)); }}
                        className="text-base font-serif-book text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors w-6 text-center"
                    >
                        A+
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden flex justify-center scroll-smooth no-scrollbar bg-[#fdfbf7] dark:bg-[#101010] transition-colors duration-300"
      >
        <div className="w-full max-w-3xl px-6 md:px-16 py-24 md:py-32 min-h-full">
          
          {/* Animated Content Container */}
          <div 
            className={`transition-all duration-300 ease-in-out ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`} 
            style={{ fontSize: `${fontSize}px` }}
          >
            {currentPage.isImagePlaceholder ? (
               <div className="flex flex-col items-center justify-center py-40 my-10 bg-gray-50 dark:bg-zinc-900/30 rounded-xl border border-gray-200 dark:border-zinc-800/50 p-8 text-center">
                  <div className="mb-6 p-6 rounded-full bg-gray-100 dark:bg-zinc-800/50">
                    <svg className="w-12 h-12 text-gray-400 dark:text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <p className="text-gray-400 dark:text-zinc-500 text-sm font-bold tracking-widest uppercase">{currentPage.content || "Ilustração"}</p>
               </div>
            ) : (
              <div>
                 {formatText(currentPage.content)}
              </div>
            )}
          </div>

          <div className={`mt-20 grid grid-cols-2 gap-6 pt-10 border-t border-gray-200 dark:border-zinc-900 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
             <button 
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className={`group px-6 py-5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-300 flex flex-col items-start gap-2 ${currentIndex === 0 ? 'opacity-0 pointer-events-none' : 'bg-gray-100 dark:bg-zinc-900/50 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white'}`}
             >
               <span className="text-gray-400 dark:text-zinc-600 text-[10px] group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">Anterior</span>
               <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                Página {currentIndex}
               </span>
             </button>

             <button 
                onClick={handleNext}
                disabled={currentIndex === pages.length - 1}
                className="group px-6 py-5 bg-zinc-800 dark:bg-zinc-100 text-white dark:text-black hover:bg-zinc-700 dark:hover:bg-white rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-xl shadow-gray-300/50 dark:shadow-black/50 flex flex-col items-end gap-2 ml-auto w-full text-right"
             >
               <span className="text-zinc-400 text-[10px] group-hover:text-zinc-300 dark:group-hover:text-zinc-600 transition-colors">
                   {currentIndex === pages.length - 1 ? 'Concluir' : 'Próxima'}
               </span>
               <span className="flex items-center gap-2">
                Página {currentIndex + 2}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
               </span>
             </button>
          </div>
          
          <div className={`mt-12 text-center transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
             <p className="text-gray-400 dark:text-zinc-700 text-[10px] uppercase tracking-widest font-bold">
                 ~ {readingTime} min de leitura ~
             </p>
          </div>
        </div>
      </div>

      {/* Persistent Progress Footer */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-[#141414] border-t border-gray-200 dark:border-white/5 py-3 px-6 flex items-center justify-between text-xs font-medium text-gray-500 transition-transform duration-300 z-30 ${showControls ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="flex items-center gap-4 w-full max-w-3xl mx-auto">
             <span className="w-10 text-right">{Math.round(progressPercentage)}%</span>
             <div className="relative flex-1 h-1 bg-gray-200 dark:bg-zinc-800 rounded-full group cursor-pointer">
                <div 
                  className="absolute top-0 left-0 h-full bg-amber-600 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
             </div>
             <span className="w-20 text-left whitespace-nowrap">Pág {currentIndex + 1}</span>
          </div>
      </div>

      {/* Bookmarks Sidebar Drawer */}
      <div className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ${showBookmarksSidebar ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
         <div className="absolute inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm" onClick={() => setShowBookmarksSidebar(false)}></div>
         <div className={`relative w-80 bg-white dark:bg-[#181818] h-full shadow-2xl border-l border-gray-200 dark:border-white/10 transform transition-transform duration-300 flex flex-col ${showBookmarksSidebar ? 'translate-x-0' : 'translate-x-full'}`}>
             <div className="p-6 border-b border-gray-200 dark:border-white/5 flex items-center justify-between">
                 <h3 className="text-gray-900 dark:text-white font-bold font-display text-lg">Marcadores</h3>
                 <button onClick={() => setShowBookmarksSidebar(false)} className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
             </div>
             <div className="flex-1 overflow-y-auto p-4 space-y-3">
                 {bookmarks.length === 0 ? (
                     <div className="text-center text-gray-500 mt-20 text-sm">
                         <p>Nenhum marcador salvo.</p>
                         <p className="mt-2 text-xs">Toque no ícone <svg className="w-3 h-3 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg> para salvar uma página.</p>
                     </div>
                 ) : (
                     bookmarks.map((b, i) => (
                         <div key={i} onClick={() => handleJumpToBookmark(b.pageId)} className="bg-gray-50 dark:bg-zinc-900 p-4 rounded-lg border border-gray-200 dark:border-zinc-800 hover:border-amber-500/50 dark:hover:border-amber-900/50 cursor-pointer group transition-all hover:bg-white dark:hover:bg-zinc-800 shadow-sm">
                             <div className="flex justify-between items-start mb-2">
                                 <span className="text-xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider">Página {b.pageId}</span>
                                 <span className="text-[10px] text-gray-400 dark:text-gray-600">{new Date(b.createdAt).toLocaleDateString()}</span>
                             </div>
                             <h4 className="text-gray-900 dark:text-white text-sm font-medium mb-1 line-clamp-1">{b.chapterTitle}</h4>
                             <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 font-serif-book italic">"{b.preview}"</p>
                         </div>
                     ))
                 )}
             </div>
         </div>
      </div>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>
      
      {/* Unlock Modal Overlay */}
      {unlockedArtifact && (
         <UnlockModal artifact={unlockedArtifact} onClose={() => setUnlockedArtifact(null)} />
      )}
    </div>
  );
};
