import {Component, EventEmitter, input, OnInit, output, Output} from '@angular/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import { SongDTO } from '../../service/model/song.model';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-song-card',
  imports: [
    FontAwesomeModule,

  ],
  templateUrl: './song-card.component.html',
  styleUrl: './song-card.component.scss',
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(':enter', [
          style({transform: 'translateY(10px)', opacity: 0}),
          animate('.2s ease-out', style({transform: 'translateY(0px)', opacity: 1}))
        ]),
        transition(
          ':leave',
          [
            style({transform: 'translateY(0px)', opacity: 1}),
            animate('.2s ease-in', style({transform: 'translateY(10px)', opacity: 0}))
          ]
        ),
      ])
  ]
})
export class SongCardComponent implements OnInit{

  song = input.required<SongDTO>();
  songDisplay: SongDTO = {favorite: false, displayPlay: false};

  songToPlay = output<SongDTO>();

  ngOnInit(): void {
    this.songDisplay = this.song();
  }

  onHoverPlay(displayIcon: boolean): void {
    this.songDisplay.displayPlay = displayIcon;
  }

  play(): void {
    this.songToPlay.emit(this.songDisplay);
  }

}


