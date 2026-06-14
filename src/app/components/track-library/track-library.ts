import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackLibraryService } from '../../services/track-library.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Track } from '../../models/track.model';

@Component({
  selector: 'app-track-library',
  imports: [CommonModule, DragDropModule],
  template: `
    <div class="glass-panel p-4 flex flex-col gap-4 h-full">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">My Library</h2>
        <span class="text-xs text-zinc-500 font-medium bg-zinc-800 px-2 py-1 rounded-full">{{ tracks().length }} tracks</span>
      </div>

      <div 
        cdkDropList 
        id="libraryList"
        [cdkDropListData]="tracks()"
        [cdkDropListConnectedTo]="['setlistList']"
        class="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 min-h-[200px]"
      >
        <div 
          *ngFor="let track of tracks()" 
          cdkDrag
          [cdkDragData]="track"
          class="glass-card p-3 flex items-center gap-3 group cursor-grab active:cursor-grabbing hover:bg-zinc-800/80"
        >
          <div *cdkDragPreview class="glass-panel p-3 flex items-center gap-3 w-[300px] shadow-2xl opacity-90 border-primary-500/50">
            <img [src]="track.coverUrl || 'assets/placeholder.png'" alt="Cover" class="w-10 h-10 rounded object-cover" />
            <div>
              <div class="text-sm font-bold text-white">{{ track.title }}</div>
              <div class="text-xs text-zinc-400">{{ track.artist }}</div>
            </div>
          </div>

          <div class="text-zinc-600 group-hover:text-zinc-400 cursor-grab">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
            </svg>
          </div>
          <img [src]="track.coverUrl || 'assets/placeholder.png'" alt="Cover" class="w-10 h-10 rounded object-cover bg-zinc-800" />
          <div class="flex-1 min-w-0">
            <div class="text-sm font-semibold text-zinc-100 truncate">{{ track.title }}</div>
            <div class="text-xs text-zinc-400 truncate">{{ track.artist }}</div>
          </div>
          <div class="flex flex-col items-end">
            <span class="text-xs font-mono text-accent-400">{{ track.bpm }}</span>
            <span class="text-xs font-mono text-primary-400">{{ track.key }}</span>
          </div>
          
          <button 
            (click)="removeTrack(track.id)"
            class="w-6 h-6 rounded-full hover:bg-red-500/20 text-zinc-500 hover:text-red-400 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 ml-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div *ngIf="tracks().length === 0" class="text-zinc-500 text-sm text-center py-10 border border-dashed border-zinc-700 rounded-xl m-2">
          Your library is empty.<br/>Search and add tracks above.
        </div>
      </div>
    </div>
  `,
  styles: `
    .cdk-drag-placeholder {
      opacity: 0.3;
      border: 1px dashed #7c3aed;
    }
    .cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
    .cdk-drop-list-dragging .cdk-drag {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
  `
})
export class TrackLibraryComponent {
  private libraryService = inject(TrackLibraryService);

  tracks = this.libraryService.tracks;

  removeTrack(id: string) {
    this.libraryService.removeTrack(id);
  }
}
