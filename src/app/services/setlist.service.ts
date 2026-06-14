import { Injectable, signal, effect, computed } from '@angular/core';
import { Setlist, SetlistTrack } from '../models/setlist.model';
import { Track } from '../models/track.model';

@Injectable({
  providedIn: 'root'
})
export class SetlistService {
  private readonly STORAGE_KEY = 'setlist_creator_setlists';
  private readonly ACTIVE_SETLIST_ID_KEY = 'setlist_creator_active_id';

  setlists = signal<Setlist[]>(this.loadSetlistsFromStorage());

  activeSetlistId = signal<string | null>(this.loadActiveSetlistId());

  activeSetlist = computed(() => {
    const id = this.activeSetlistId();
    if (!id) return null;
    return this.setlists().find(s => s.id === id) || null;
  });

  constructor() {
    effect(() => {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.setlists()));
      const activeId = this.activeSetlistId();
      if (activeId) {
        localStorage.setItem(this.ACTIVE_SETLIST_ID_KEY, activeId);
      } else {
        localStorage.removeItem(this.ACTIVE_SETLIST_ID_KEY);
      }
    });
  }

  createNewSetlist(name: string) {
    const newSetlist: Setlist = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date(),
      tracks: []
    };
    this.setlists.update(list => [...list, newSetlist]);
    this.activeSetlistId.set(newSetlist.id);
  }

  setActiveSetlist(id: string) {
    this.activeSetlistId.set(id);
  }

  addTrackToActiveSetlist(track: Track) {
    this.setlists.update(list => list.map(setlist => {
      if (setlist.id === this.activeSetlistId()) {
        const newTrack: SetlistTrack = {
          ...track,
          id: crypto.randomUUID(),
          orderIndex: setlist.tracks.length
        };
        return { ...setlist, tracks: [...setlist.tracks, newTrack] };
      }
      return setlist;
    }));
  }

  removeTrackFromActiveSetlist(instanceId: string) {
    this.setlists.update(list => list.map(setlist => {
      if (setlist.id === this.activeSetlistId()) {
        return { ...setlist, tracks: setlist.tracks.filter(t => t.id !== instanceId) };
      }
      return setlist;
    }));
  }

  reorderActiveSetlistTracks(previousIndex: number, currentIndex: number) {
    this.setlists.update(list => list.map(setlist => {
      if (setlist.id === this.activeSetlistId()) {
        const tracks = [...setlist.tracks];
        const [movedItem] = tracks.splice(previousIndex, 1);
        tracks.splice(currentIndex, 0, movedItem);

        const reordered = tracks.map((t, idx) => ({ ...t, orderIndex: idx }));
        return { ...setlist, tracks: reordered };
      }
      return setlist;
    }));
  }

  private loadSetlistsFromStorage(): Setlist[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private loadActiveSetlistId(): string | null {
    return localStorage.getItem(this.ACTIVE_SETLIST_ID_KEY);
  }
}
