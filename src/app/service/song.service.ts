import {computed, inject, Injectable, signal} from '@angular/core';
import {CreateSong, ReadSong} from './model/song.model';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {State} from './model/state.model';
import {environment} from '../../environments/environment';

export type StatusNotification = 'OK' | 'ERROR' | 'INIT';

export interface SongState {
  isLoading: boolean,
  fetchedSongs: ReadSong[]
  error: string | undefined;
  status: StatusNotification;
}

export interface createSongState {
  isCreating: boolean,
  createdSong: CreateSong | undefined;
  error: string | undefined,
  status: StatusNotification;
}

@Injectable({
  providedIn: 'root'
})
export class SongService {

  http = inject(HttpClient);

  // private fetchSongState = signal<SongState>({
  //   isLoading: false,
  //   fetchedSongs: [],
  //   error: undefined,
  //   status: "INIT"
  // });

  private fetchSongsStateSignal = signal(State.onInit<Array<ReadSong>, HttpErrorResponse>());
  fetchSongsState = this.fetchSongsStateSignal.asReadonly();

  // Selectors
  fetchSongsIsLoading = computed(() => this.fetchSongsState().isProcessing);
  fetchedSongs = computed(() => this.fetchSongsState().value);
  fetchSongsErrorMessage = computed(() => this.fetchSongsState().error);


  private addSongStateSignal = signal(State.onInit<CreateSong, HttpErrorResponse>());
  addSongState = this.addSongStateSignal.asReadonly();

  addSongIsProcessing = computed(() => this.addSongState().isProcessing);
  addedSong = computed(() => this.addSongState().value);
  addSongStatus = computed(() => this.addSongState().status);
  addSongErrorMessage = computed(() => this.addSongState().error);


  constructor() {
    this.fetchSongs();
  }

  reset(): void {
    this.addSongStateSignal.set(State.onInit<CreateSong, HttpErrorResponse>());
  }

  async fetchSongs() {
    this.fetchSongsStateSignal.update(state => State.setProcessing(state, true));
    this.getSongs();
    // to simulate loading when fetching data
    const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));
    // await sleep(1000);
    this.fetchSongsStateSignal.update(state => State.setProcessing(state, false));
  }


  private getSongs() {
    this.http.get<ReadSong[]>(`${environment.API_URL}/api/songs`)
      .subscribe({
        next: (songs) => {
          this.fetchSongsStateSignal.update(state => State.onSuccess(state, songs));
        },
        error: (err) => {
          this.fetchSongsStateSignal.update(state => State.onError(state, err));
        },
      });
  }



  add(song: CreateSong): void {
    this.addSongStateSignal.update(state => State.setProcessing(state, true));
    this.addSong(song);
    this.addSongStateSignal.update(state => State.setProcessing(state, false));
  }

  addSong(song: CreateSong): void {
    const formData = new FormData();
    formData.append('cover', song.cover!);
    formData.append('audioFile', song.file!);
    formData.append('title', song.title!);
    formData.append('artist', song.artist!);

    this.http.post<CreateSong>(`${environment.API_URL}/api/songs`, formData)
      .subscribe({
        next: createdSong => this.addSongStateSignal.update(state => State.onSuccess(state, createdSong)),
        error: err => this.addSongStateSignal.update(state => State.onSuccess(state, err)),
      });
  }
}
