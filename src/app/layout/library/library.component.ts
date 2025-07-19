import {Component, computed, effect, inject, OnInit} from '@angular/core';
import { SongService } from '../../service/song.service';
import {ReadSong} from '../../service/model/song.model';
import {NgOptimizedImage} from '@angular/common';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {SmallSongCardComponent} from '../../shared/small-song-card/small-song-card.component';
import {RouterLink} from '@angular/router';
import {SongContentService} from '../../service/song-content.service';

@Component({
  selector: 'app-library',
  imports: [
    FontAwesomeModule,
    SmallSongCardComponent,
    RouterLink
  ],
  templateUrl: './library.component.html',
  styleUrl: './library.component.scss'
})
export class LibraryComponent implements OnInit{
  // Services
  private songService = inject(SongService);
  private songContentService = inject(SongContentService);
  // Signals

  fetchedSongs = computed(() => this.songService.fetchSongsState().value);
  fetchSongsIsLoading = computed(() => this.songService.fetchSongsState().isProcessing);
  fetchSongsError = computed(() => this.songService.fetchSongsState().error);


  ngOnInit(): void {
    this.songService.fetchSongs();
  }

  onPlaySong(songToPlayFirst: ReadSong) {
    this.songContentService.createNewQueue(songToPlayFirst, this.fetchedSongs() ?? []);
  }

}
