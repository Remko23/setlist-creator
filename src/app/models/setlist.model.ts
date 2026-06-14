import { Track } from './track.model';

export interface Setlist {
  id: string;
  name: string;
  createdAt: Date;
  tracks: SetlistTrack[];
}

export interface SetlistTrack extends Track {
  orderIndex: number; // To preserve order in the setlist
  // Potentially we can add specific notes for transitions here later
  transitionNote?: string;
}
