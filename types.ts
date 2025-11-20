
export interface BookPage {
  id: number;
  content: string;
  chapterTitle?: string; // If this page starts a new chapter
  isImagePlaceholder?: boolean;
}

export interface ReadingProgress {
  lastReadPage: number; // Index of the page
  lastReadDate: string;
}

export interface Bookmark {
  pageId: number;
  chapterTitle: string;
  preview: string;
  createdAt: number;
}

export enum ViewState {
  HOME = 'HOME',
  READER = 'READER'
}
