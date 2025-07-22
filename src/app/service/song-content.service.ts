import {computed, inject, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {ReadSong, SongContent} from './model/song.model';
import {State} from './model/state.model';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SongContentService {

  http = inject(HttpClient);

  private queueToPlay$: WritableSignal<Array<ReadSong>> = signal([]);
  queueToPlay = computed(() => this.queueToPlay$());

  constructor() {
  }

  private play$ = signal(State.onInit<SongContent, HttpErrorResponse>());
  playNewSong = this.play$.asReadonly();

  createNewQueue(firstSong: ReadSong, songsToPlay: Array<ReadSong>): void {
    songsToPlay = songsToPlay.filter(song => song.publicId !== firstSong.publicId);
    if(songsToPlay) {
      songsToPlay.unshift(firstSong);
    }
    this.queueToPlay$.set(songsToPlay);
  }

  fetchNextSong(songToPlay: SongContent) : void {
    const queryParam = new HttpParams().set('publicId', songToPlay.publicId!);
    this.http.get<SongContent>(`${environment.API_URL}/api/songs/get-content`, {params: queryParam})
      .subscribe({
        next: songContent => {
          this.mapReadSongToSongContent(songContent, songToPlay);
          this.play$.update(state => State.onSuccess(state, songContent))
        },
        error: err => this.play$.update(state => State.onError(state, err))
      })
  }

  private mapReadSongToSongContent(songContent: SongContent, songToPlay: ReadSong) {
    songContent.cover = songToPlay.cover;
    songContent.coverContentType = songToPlay.coverContentType;
    songContent.title = songToPlay.title;
    songContent.artist = songToPlay.artist;
    songContent.isFavorite = songToPlay.isFavorite;
  }
}
