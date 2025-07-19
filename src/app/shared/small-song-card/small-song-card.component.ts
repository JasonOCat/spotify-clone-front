import {Component, input, output} from '@angular/core';
import { SongDTO } from '../../service/model/song.model';
;

@Component({
  selector: 'app-small-song-card',
  imports: [],
  templateUrl: './small-song-card.component.html',
  styleUrl: './small-song-card.component.scss'
})
export class SmallSongCardComponent {

  song = input.required<SongDTO>();

  songToPlay = output<SongDTO>();

  play() {
    this.songToPlay.emit(this.song());
  }


}
