import {Component, effect, inject} from '@angular/core';
import {ToastService} from '../service/toast.service';
import {SongService} from '../service/song.service';
import {SongCardComponent} from './song-card/song-card.component';
import {ReadSong} from '../service/model/song.model';
import {SongContentService} from '../service/song-content.service';
import {FavoriteSongCardComponent} from './favorite-song-card/favorite-song-card.component';

@Component({
  selector: 'app-home',
  imports: [
    SongCardComponent,
    FavoriteSongCardComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  // Services
  private songService = inject(SongService);
  private toastService = inject(ToastService);
  private songContentService = inject(SongContentService);

  // Signals
  fetchedSongs = this.songService.fetchedSongs;
  fetchSongsIsLoading = this.songService.fetchSongsIsLoading;
  fetchSongsStatus = this.songService.addSongStatus
  fetchSongsErrorMessage = this.songService.fetchSongsErrorMessage;

  constructor() {
    effect(() => {
      if (this.fetchSongsStatus() === "ERROR") {
        this.toastService.show('An error occurred when fetching all songs', "DANGER");
      }
    });
  }

  onPlaySong(songToPlayFirst: ReadSong) {
    this.songContentService.createNewQueue(songToPlayFirst, this.fetchedSongs()!);
  }

}
