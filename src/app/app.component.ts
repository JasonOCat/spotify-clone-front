import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {LibraryComponent} from './layout/library/library.component';

@Component({
  selector: 'app-root',
  imports: [LibraryComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'spotify-clone-front';
}
