import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SetlistService } from '../../services/setlist.service';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Track } from '../../models/track.model';
import { SetlistTrack } from '../../models/setlist.model';

@Component({
  selector: 'app-setlist-builder',
  imports: [CommonModule, FormsModule, DragDropModule],
  template: `
    <div class="flex flex-col h-full">
      <div class="p-6 border-b border-white/10 flex items-center justify-between bg-zinc-900/50">
        <div *ngIf="activeSetlist(); else noSetlistHeader">
          <h2 class="text-2xl font-bold text-white">{{ activeSetlist()?.name }}</h2>
          <div class="text-sm text-zinc-400 mt-1 flex gap-4">
            <span>{{ activeSetlist()?.tracks?.length || 0 }} tracks</span>
            <span>{{ formattedTotalDuration() }}</span>
          </div>
        </div>
        <ng-template #noSetlistHeader>
          <h2 class="text-2xl font-bold text-zinc-500">No Active Setlist</h2>
        </ng-template>

        <div class="flex gap-3">
          <button *ngIf="!isCreating" (click)="isCreating = true" class="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-medium transition-colors text-sm">
            New Setlist
          </button>
          
          <div *ngIf="isCreating" class="flex gap-2 items-center">
            <input 
              type="text" 
              [(ngModel)]="newSetName" 
              placeholder="Setlist Name" 
              (keyup.enter)="createSetlist()"
              class="bg-zinc-800 border border-white/20 rounded-md px-3 py-1.5 text-sm text-white focus:outline-none focus:border-primary-500"
            />
            <button (click)="createSetlist()" class="px-3 py-1.5 rounded-md bg-accent-500 hover:bg-accent-400 text-white text-sm font-medium">Save</button>
            <button (click)="isCreating = false" class="px-3 py-1.5 rounded-md text-zinc-400 hover:text-white text-sm">Cancel</button>
          </div>
        </div>
      </div>

      <div 
        *ngIf="activeSetlist()"
        class="flex-1 overflow-y-auto p-6 bg-zinc-900/20"
        cdkDropList 
        id="setlistList"
        [cdkDropListData]="activeSetlist()?.tracks || []"
        [cdkDropListConnectedTo]="['libraryList']"
        (cdkDropListDropped)="drop($event)"
      >
        <div *ngIf="activeSetlist()?.tracks?.length === 0" class="h-full flex flex-col items-center justify-center text-zinc-500 border-2 border-dashed border-zinc-700 rounded-2xl">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mb-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          <p class="text-lg">Drag tracks here from your library</p>
          <p class="text-sm mt-2">Build your perfect set</p>
        </div>

        <div class="flex flex-col gap-3 pb-20">
          <ng-container *ngFor="let track of activeSetlist()?.tracks; let i = index">
            <div *ngIf="i > 0" class="flex justify-center -my-1 z-10 relative">
              <div class="bg-zinc-800 border border-zinc-700 rounded-full px-3 py-0.5 flex gap-3 text-[10px] font-mono font-medium shadow-lg"
                   [ngClass]="getTransitionClass(activeSetlist()!.tracks[i-1], track)">
                <span class="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                  </svg>
                  Δ BPM: {{ getBpmDiff(activeSetlist()!.tracks[i-1].bpm, track.bpm) }}
                </span>
                <span class="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.46l9-1.8V13.114A4.369 4.369 0 0016 13c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                  </svg>
                  Key: {{ isHarmonicMatch(activeSetlist()!.tracks[i-1].key, track.key) ? 'Match' : 'Clash' }}
                </span>
              </div>
            </div>

            <div 
              cdkDrag
              class="glass-card p-4 flex items-center gap-4 group hover:bg-zinc-800/80 cursor-grab relative z-0"
            >
              <div class="text-zinc-500 font-mono text-sm w-6 text-center">{{ i + 1 }}</div>
              
              <div class="text-zinc-600 group-hover:text-zinc-400 cursor-grab" cdkDragHandle>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
                </svg>
              </div>

              <img [src]="track.coverUrl || 'assets/placeholder.png'" alt="Cover" class="w-14 h-14 rounded-md object-cover shadow-md" />
              
              <div class="flex-1 min-w-0">
                <div class="text-base font-bold text-white truncate">{{ track.title }}</div>
                <div class="text-sm text-zinc-400 truncate">{{ track.artist }}</div>
              </div>
              
              <div class="flex gap-4 items-center">
                <div class="flex flex-col items-end w-16">
                  <span class="text-sm font-mono text-accent-400 font-bold">{{ track.bpm }}</span>
                  <span class="text-xs text-zinc-500">BPM</span>
                </div>
                <div class="flex flex-col items-center w-12">
                  <span class="text-sm font-mono text-primary-400 font-bold">{{ track.key }}</span>
                  <span class="text-xs text-zinc-500">Key</span>
                </div>
                <div class="text-sm text-zinc-500 font-mono w-12 text-right">
                  {{ formatDuration(track.durationMs) }}
                </div>
              </div>

              <button 
                (click)="removeTrack(track.id)"
                class="w-8 h-8 rounded-full hover:bg-red-500/20 text-zinc-500 hover:text-red-400 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 ml-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </ng-container>
        </div>
      </div>
    </div>
  `,
  styles: `
    .cdk-drag-placeholder {
      opacity: 0.3;
      border: 2px dashed #0ea5e9;
      background: transparent;
    }
    .cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
    .cdk-drop-list-dragging .cdk-drag {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
    .match-perfect { color: #10b981; border-color: rgba(16, 185, 129, 0.3); } /* Emerald */
    .match-warning { color: #f59e0b; border-color: rgba(245, 158, 11, 0.3); } /* Amber */
    .match-danger { color: #ef4444; border-color: rgba(239, 68, 68, 0.3); } /* Red */
  `
})
export class SetlistBuilderComponent {
  private setlistService = inject(SetlistService);

  activeSetlist = this.setlistService.activeSetlist;

  isCreating = false;
  newSetName = '';

  createSetlist() {
    if (this.newSetName.trim()) {
      this.setlistService.createNewSetlist(this.newSetName.trim());
      this.newSetName = '';
      this.isCreating = false;
    }
  }

  drop(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      this.setlistService.reorderActiveSetlistTracks(event.previousIndex, event.currentIndex);
    } else {
      const track = event.previousContainer.data[event.previousIndex] as Track;
      this.setlistService.addTrackToActiveSetlist(track);
    }
  }

  removeTrack(instanceId: string) {
    this.setlistService.removeTrackFromActiveSetlist(instanceId);
  }

  formatDuration(ms: number): string {
    if (!ms) return '0:00';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  formattedTotalDuration = computed(() => {
    const list = this.activeSetlist();
    if (!list || !list.tracks) return '0 min';

    const totalMs = list.tracks.reduce((acc, track) => acc + (track.durationMs || 0), 0);
    const totalMinutes = Math.floor(totalMs / 1000 / 60);
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;

    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  });

  getBpmDiff(bpm1: number, bpm2: number): string {
    const diff = bpm2 - bpm1;
    return diff > 0 ? `+${diff}` : `${diff}`;
  }

  isHarmonicMatch(key1: string, key2: string): boolean {
    if (!key1 || !key2) return false;
    if (key1 === key2) return true;

    const num1 = parseInt(key1);
    const letter1 = key1.replace(/[0-9]/g, '');
    const num2 = parseInt(key2);
    const letter2 = key2.replace(/[0-9]/g, '');

    if (letter1 === letter2) {
      if (num1 === num2 || num1 === (num2 + 1) || num1 === (num2 - 1)) return true;
      if ((num1 === 12 && num2 === 1) || (num1 === 1 && num2 === 12)) return true;
    } else if (num1 === num2) {
      return true;
    }

    return false;
  }

  getTransitionClass(track1: Track, track2: Track): string {
    const bpmDiff = Math.abs(track1.bpm - track2.bpm);
    const harmonic = this.isHarmonicMatch(track1.key, track2.key);

    if (bpmDiff <= 3 && harmonic) return 'match-perfect';
    if (bpmDiff <= 6 || harmonic) return 'match-warning';
    return 'match-danger';
  }
}
