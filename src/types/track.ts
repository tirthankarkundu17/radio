export type SupportedLanguage = 'all' | 'en' | 'bn' | 'hi';

export interface Track {
  id: string;
  title: string;
  artist: string;
  language: 'en' | 'bn' | 'hi';
  genre: string;
  mood: string;
  duration: number; // in seconds
  audioUrl: string;
  coverUrl: string;
  aiModel: string;  // e.g. "Suno v3.5", "Udio v1.5"
  prompt: string;
}
