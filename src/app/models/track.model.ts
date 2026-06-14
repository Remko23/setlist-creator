export interface Track {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  key: string;
  genre: string;
  durationMs: number;
  coverUrl?: string;
}
