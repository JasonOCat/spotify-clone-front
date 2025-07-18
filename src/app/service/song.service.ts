import {computed, effect, inject, Injectable, signal} from '@angular/core';
import {SongDTO} from '../model/song.model';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';


export interface SongState {
  isLoading: boolean,
  songs: SongDTO[]
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class SongService {

  http = inject(HttpClient);

  private state = signal<SongState>({
    isLoading: false,
    songs: [],
    error: null
  });

  // Selectors
  isLoading = computed(() => this.state().isLoading);
  songs = computed(() => this.state().songs);
  errorMessage = computed(() => this.state().error);


  constructor() {
    this.fetchSongs();
  }

  async fetchSongs() {
    this.setLoadingIndicator(true);
    this.getSongs();
    // to simulate loading when fetching data
    const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));
    await sleep(2000);
    this.setLoadingIndicator(false);
  }

  private setLoadingIndicator(isLoading: boolean) {
    this.state.update(state => ({
      ...state,
      isLoading: isLoading
    }));
  }

  private getSongs() {
    this.http.get<SongDTO[]>(`http://localhost:8080/api/songs`)
      .subscribe({
        next: (response) => {
          this.setSongs(response);
        },
        error: (err) => {
          this.setError(err);
        },

      });
  }

  private setSongs(response: SongDTO[]) {
    this.state.update(state => ({
      ...state,
      songs: response,
      error: null,
    }))
  }

  private setError(err: HttpErrorResponse) {
    const errorMessage = setErrorMessage(err);
    this.state.update(state => ({
      ...state,
      songs: [],
      error: errorMessage
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
