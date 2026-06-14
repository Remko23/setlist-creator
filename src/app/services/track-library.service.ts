import { Injectable, signal, effect } from '@angular/core';
import { Track } from '../models/track.model';

@Injectable({
  providedIn: 'root'
})
export class TrackLibraryService {
  private readonly STORAGE_KEY = 'setlist_creator_tracks';

  tracks = signal<Track[]>(this.loadFromStorage());

  constructor() {
    effect(() => {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tracks()));
    });
  }

  addTrack(track: Track) {
    if (!this.tracks().find(t => t.id === track.id)) {
      this.tracks.update(tracks => [...tracks, track]);
    }
  }

  removeTrack(trackId: string) {
    this.tracks.update(tracks => tracks.filter(t => t.id !== trackId));
  }

  updateTrack(updatedTrack: Track) {
    this.tracks.update(tracks => tracks.map(t => t.id === updatedTrack.id ? updatedTrack : t));
  }

  private loadFromStorage(): Track[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }
}
