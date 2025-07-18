import {Component, effect, inject, OnInit} from '@angular/core';
import { SongService } from '../../service/song.service';
import {SongDTO} from '../../model/song.model';
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
  fetchSongs = this.songService.songs;
  fetchSongsIsLoading = this.songService.isLoading;
  fetchSongsError = this.songService.errorMessage;

  constructor() {
  }

}
