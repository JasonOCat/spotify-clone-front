import {Component, computed, effect, inject, OnInit} from '@angular/core';
import { SongService } from '../../service/song.service';
import {SongDTO} from '../../service/model/song.model';
import {NgOptimizedImage} from '@angular/common';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {SmallSongCardComponent} from '../../shared/small-song-card/small-song-card.component';

@Component({
  selector: 'app-library',
  imports: [
    FontAwesomeModule,
    SmallSongCardComponent
  ],
  templateUrl: './library.component.html',
  styleUrl: './library.component.scss'
})
export class LibraryComponent {
  // Services
  private songService = inject(SongService);

  // Signals
  fetchedSongs = computed(() => this.songService.fetchSongsState().value);
  fetchSongsIsLoading = computed(() => this.songService.fetchSongsState().isProcessing);
  fetchSongsError = computed(() => this.songService.fetchSongsState().error);

  constructor() {
  }

}
