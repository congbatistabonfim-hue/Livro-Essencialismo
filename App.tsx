import React, { useState, useEffect } from 'react';
import { Home } from './components/Home';
import { Reader } from './components/Reader';
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
    // Find the actual index in the array based on page ID logic, 
    // but here bookPages is array, so index is array index.
    // If we pass the raw ID from the bookPages array, we need to find its index.
    // The Home component passes (id - 1), which matches array index if ids are sequential starting at 1.
    // For safety:
    const index = bookPages.findIndex(p => p.id === pageIndex + 1);
    setCurrentPageIndex(index >= 0 ? index : 0);
    setView(ViewState.READER);
  };

  return (
    <div className="antialiased">
      {view === ViewState.HOME && (
        <Home 
          onStartReading={handleStartReading} 
          progress={progress}
          onSelectChapter={(idx) => handleChapterSelect(idx)}
        />
      )}
      
      {view === ViewState.READER && (
        <Reader 
          pages={bookPages}
          initialPageIndex={currentPageIndex}
          onClose={() => setView(ViewState.HOME)}
        />
      )}
    </div>
  );
}

export default App;