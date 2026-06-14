import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Track } from '../../models/track.model';
import { ItunesSearchService } from '../../services/itunes-search.service';
import { TrackLibraryService } from '../../services/track-library.service';

@Component({
  selector: 'app-track-search',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="glass-panel p-4 flex flex-col gap-4">
      <h2 class="text-xl font-bold bg-gradient-to-r from-accent-400 to-primary-400 bg-clip-text text-transparent">Search Tracks</h2>
      
      <div class="flex gap-2">
        <input 
          type="text" 
          [(ngModel)]="searchTerm" 
          (keyup.enter)="search()"
          placeholder="Artist, Title..." 
          class="flex-1 bg-zinc-800/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-all placeholder-zinc-500"
        />
        <button 
          (click)="search()" 
          [disabled]="isLoading()"
          class="bg-accent-500 hover:bg-accent-400 text-white font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          <svg *ngIf="!isLoading()" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
          </svg>
          <svg *ngIf="isLoading()" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </button>
      </div>

      <div class="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1" *ngIf="results().length > 0">
        <div *ngFor="let track of results()" class="glass-card p-2 flex items-center gap-3 group">
          <img [src]="track.coverUrl || 'assets/placeholder.png'" alt="Cover" class="w-12 h-12 rounded-md object-cover bg-zinc-800" />
          <div class="flex-1 min-w-0">
            <div class="text-sm font-semibold text-white truncate">{{ track.title }}</div>
            <div class="text-xs text-zinc-400 truncate">{{ track.artist }}</div>
            <div class="text-[10px] text-zinc-500 flex gap-2 mt-1">
              <span class="bg-zinc-800 px-1.5 py-0.5 rounded text-accent-400">{{ track.bpm }} BPM</span>
              <span class="bg-zinc-800 px-1.5 py-0.5 rounded text-primary-400">{{ track.key }}</span>
            </div>
          </div>
          <button 
            (click)="addToLibrary(track)"
            class="w-8 h-8 rounded-full bg-zinc-700/50 hover:bg-primary-500 text-white flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      <div *ngIf="hasSearched() && results().length === 0 && !isLoading()" class="text-zinc-500 text-sm text-center py-4">
        No tracks found.
      </div>
    </div>
  `,
  styles: ``
})
export class TrackSearchComponent {
  private itunesService = inject(ItunesSearchService);
  private libraryService = inject(TrackLibraryService);

  searchTerm = '';
  results = signal<Track[]>([]);
  isLoading = signal(false);
  hasSearched = signal(false);

  search() {
    if (!this.searchTerm.trim()) return;

    this.isLoading.set(true);
    this.hasSearched.set(true);
    this.itunesService.searchTracks(this.searchTerm).subscribe({
      next: (tracks) => {
        this.results.set(tracks);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Search failed', err);
        this.isLoading.set(false);
      }
    });
  }

  addToLibrary(track: Track) {
    this.libraryService.addTrack(track);
  }
}
