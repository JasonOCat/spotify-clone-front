import {Component, effect, inject, Signal, signal, WritableSignal} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {SmallSongCardComponent} from "../shared/small-song-card/small-song-card.component";
import {SongService} from "../service/song.service";
import {SongContentService} from "../service/song-content.service";
import {ToastService} from "../service/toast.service";
import {ReadSong} from "../service/model/song.model";
import {debounce, debounceTime, distinctUntilChanged, filter, interval, of, switchMap, tap} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {State} from "../service/model/state.model";
import {FavoriteSongBtnComponent} from '../shared/favorite-song-btn/favorite-song-btn.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    FormsModule,
    FontAwesomeModule,
    SmallSongCardComponent,
    ReactiveFormsModule,
    FavoriteSongBtnComponent,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {

  searchTerm$ = new FormControl('', {nonNullable: true});

  private songService = inject(SongService);
  private songContentService = inject(SongContentService);
  private toastService = inject(ToastService);

  songsResult: Array<ReadSong> = [];

  isSearching = false;
  searchCompleted = signal<boolean>(true);

  constructor() {
    effect(() => {

      this.searchTerm$.valueChanges.pipe(
        tap(() => this.searchCompleted.set(false)),
        debounceTime(400),
        distinctUntilChanged(),
        // handle special case for empty term
        tap(newSearchTerm => this.resetResultIfEmptyTerm(newSearchTerm)),
        // ignore empty term
        filter(newSearchTerm => newSearchTerm.length > 0),
        tap(() => this.isSearching = true),
        switchMap(newSearchTerm => this.songService.search(newSearchTerm))
      ).subscribe({
        next: searchState => {
          this.onNext(searchState)
          this.isSearching = false;
          this.searchCompleted.set(true);
        },
        error: () => {
          this.isSearching = false
          this.searchCompleted.set(true);
        }

      })
    });
  }

  private resetResultIfEmptyTerm(newSearchTerm: string) {
    if (newSearchTerm.length === 0) {
      this.songsResult = [];
    }
  }

  onPlay(firstSong: ReadSong) {
    this.songContentService.createNewQueue(firstSong, this.songsResult);
  }

  private onNext(searchState: State<Array<ReadSong>, HttpErrorResponse>) {

    if(searchState.status === "OK") {
      this.songsResult = searchState.value!;
    } else if (searchState.status === "ERROR") {
      this.toastService.show('An error occurred while searching', "DANGER");
    }
  }
}
