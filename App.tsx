
import React, { useState, useEffect } from 'react';
import { Home } from './components/Home';
import { Reader } from './components/Reader';
import { Journey } from './components/Journey';
import { bookPages } from './services/bookContent';
import { getProgress } from './services/storageService';
import { ViewState, ReadingProgress } from './types';

function App() {
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [progress, setProgress] = useState<ReadingProgress | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  useEffect(() => {
    const savedProgress = getProgress();
    setProgress(savedProgress);
    if (savedProgress) {
      setCurrentPageIndex(savedProgress.lastReadPage);
    }
  }, [view]); // Refresh progress when view changes (e.g. returning home)

  const handleStartReading = () => {
    const saved = getProgress();
    setCurrentPageIndex(saved ? saved.lastReadPage : 0);
    setView(ViewState.READER);
  };

  const handleChapterSelect = (pageIndex: number) => {
    const index = bookPages.findIndex(p => p.id === pageIndex + 1);
    setCurrentPageIndex(index >= 0 ? index : 0);
    setView(ViewState.READER);
  };

  const handleOpenJourney = () => {
    setView(ViewState.JOURNEY);
  };

  return (
    <div className="antialiased">
      {view === ViewState.HOME && (
        <Home 
          onStartReading={handleStartReading} 
          progress={progress}
          onSelectChapter={(idx) => handleChapterSelect(idx)}
          onOpenJourney={handleOpenJourney}
        />
      )}
      
      {view === ViewState.READER && (
        <Reader 
          pages={bookPages}
          initialPageIndex={currentPageIndex}
          onClose={() => setView(ViewState.HOME)}
        />
      )}

      {view === ViewState.JOURNEY && (
        <Journey 
          onBack={() => setView(ViewState.HOME)}
        />
      )}
    </div>
  );
}

export default App;
