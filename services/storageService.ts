
import { ReadingProgress, Bookmark } from "../types";

const PROGRESS_KEY = 'essencialismo_progress';
const BOOKMARKS_KEY = 'essencialismo_bookmarks';

export const saveProgress = (pageIndex: number) => {
  const progress: ReadingProgress = {
    lastReadPage: pageIndex,
    lastReadDate: new Date().toISOString(),
  };
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
};

export const getProgress = (): ReadingProgress | null => {
  const stored = localStorage.getItem(PROGRESS_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch (e) {
    return null;
  }
};

export const clearProgress = () => {
  localStorage.removeItem(PROGRESS_KEY);
};

export const saveBookmarks = (bookmarks: Bookmark[]) => {
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
};

export const getBookmarks = (): Bookmark[] => {
  const stored = localStorage.getItem(BOOKMARKS_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (e) {
    return [];
  }
};
