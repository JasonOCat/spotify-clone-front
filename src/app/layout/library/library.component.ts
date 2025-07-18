import {Component, effect, inject, OnInit} from '@angular/core';
import { SongService } from '../../service/song.service';
import {SongDTO} from '../../model/song.model';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-library',
  imports: [
    NgOptimizedImage
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
