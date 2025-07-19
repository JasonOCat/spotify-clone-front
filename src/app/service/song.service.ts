import {computed, inject, Injectable, signal} from '@angular/core';
import {CreateSong, SongDTO} from './model/song.model';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {State} from './model/state.model';

export type StatusNotification = 'OK' | 'ERROR' | 'INIT';

export interface SongState {
  isLoading: boolean,
  fetchedSongs: SongDTO[]
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

  private fetchSongsStateSignal = signal(State.onInit<Array<SongDTO>, HttpErrorResponse>());
  fetchSongsState = this.fetchSongsStateSignal.asReadonly();

  // Selectors
  fetchSongsIsLoading = computed(() => this.fetchSongsState().isProcessing);
  fetchedSongs = computed(() => this.fetchSongsState().value);
  fetchSongsErrorMessage = computed(() => this.fetchSongsState().error);

  private createSongState = signal<createSongState>({
    isCreating: false,
    createdSong: undefined,
    error: undefined,
    status: "INIT"
  });

  addSongIsLoading = computed(() => this.createSongState().isCreating);
  addedSong = computed(() => this.createSongState().createdSong);
  addSongErrorMessage = computed(() => this.createSongState().error);


  constructor() {
    this.fetchSongs();
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
    this.http.get<SongDTO[]>(`http://localhost:8080/api/songs`)
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
    this.setAddSongLoading(true);
    this.addSong(song);
    this.setAddSongLoading(false);
  }

  addSong(song: CreateSong): void {
    const formData = new FormData();
    formData.append('cover', song.cover!);
    formData.append('file', song.file!);
    formData.append('title', song.title!);
    formData.append('artist', song.artist!);

    this.http.post<CreateSong>(`http://localhost:8080/api/songs`, formData)
      .subscribe({
        next: createdSong => this.setCreatedSong(createdSong),
        error: err => this.setCreateSongError(err),
      });
  }

  private setCreateSongError(err: HttpErrorResponse) {
    this.createSongState.update(state => {
      const errorMessage = setErrorMessage(err);
      return {
        ...state,
        createdSong: undefined,
        error: errorMessage,
        status: "ERROR"
      };
    });
  }

  private setCreatedSong(createdSong: CreateSong) {
    this.createSongState.update(state => ({
      ...state,
      createdSong,
      error: undefined,
      status: "OK"
    }));
  }

  private setAddSongLoading(isLoading: boolean) {
    this.createSongState.update(state => ({
      ...state,
      isLoading: isLoading
    }));
  }

}

// This should be somewhere reusable
export function setErrorMessage(err: HttpErrorResponse): string {
  let errorMessage: string;
  if (err.error instanceof ErrorEvent) {
    // A client-side or network error occurred. Handle it accordingly.
    errorMessage = `An error occurred: ${err.error.message}`;
  } else {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong,
    errorMessage = `Backend returned code ${err.status}: ${err.message}`;
  }
  console.error(err);
  return errorMessage;
}
