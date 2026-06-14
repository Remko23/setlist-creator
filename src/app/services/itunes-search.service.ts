import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Track } from '../models/track.model';

interface ItunesResponse {
  resultCount: number;
  results: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ItunesSearchService {
  private http = inject(HttpClient);
  private apiUrl = 'https://itunes.apple.com/search';

  searchTracks(term: string, limit: number = 20): Observable<Track[]> {
    return this.http.get<ItunesResponse>(`${this.apiUrl}?term=${encodeURIComponent(term)}&entity=song&limit=${limit}`).pipe(
      map(response => response.results.map(item => this.mapItunesToTrack(item)))
    );
  }

  private mapItunesToTrack(item: any): Track {
    const randomBpm = Math.floor(Math.random() * (135 - 110 + 1) + 110);
    const keys = ['1A', '2A', '3A', '4A', '5A', '6A', '7A', '8A', '9A', '10A', '11A', '12A', '1B', '2B', '3B', '4B', '5B', '6B', '7B', '8B', '9B', '10B', '11B', '12B'];
    const randomKey = keys[Math.floor(Math.random() * keys.length)];

    return {
      id: item.trackId.toString(),
      title: item.trackName,
      artist: item.artistName,
      bpm: randomBpm,
      key: randomKey,
      genre: item.primaryGenreName,
      durationMs: item.trackTimeMillis,
      coverUrl: item.artworkUrl100?.replace('100x100bb', '300x300bb')
    };
  }
}
