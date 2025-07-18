import {Component, inject} from '@angular/core';
import {SongService} from '../service/song.service';
import {SongCardComponent} from './song-card/song-card.component';

@Component({
  selector: 'app-home',
  imports: [
    SongCardComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  // Services
  private songService = inject(SongService);

  // Signals
  fetchSongs = this.songService.songs;
  fetchSongsIsLoading = this.songService.isLoading;
  fetchSongsError = this.songService.errorMessage;

}
