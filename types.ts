
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

export interface ArtifactCard {
  id: string;
  title: string;
  description: string;
  archetype: 'Weapon' | 'Amulet' | 'Tool' | 'Relic';
  chapterTriggerId: number; // The page ID that unlocks this card
  iconPath: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
}

export enum ViewState {
  HOME = 'HOME',
  READER = 'READER',
  JOURNEY = 'JOURNEY'
}
