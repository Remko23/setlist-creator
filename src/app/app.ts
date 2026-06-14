import { Component, signal } from '@angular/core';

import { TrackSearchComponent } from './components/track-search/track-search';
import { TrackLibraryComponent } from './components/track-library/track-library';
import { SetlistBuilderComponent } from './components/setlist-builder/setlist-builder';

@Component({
  selector: 'app-root',
  imports: [TrackSearchComponent, TrackLibraryComponent, SetlistBuilderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Setlist Creator');
}
