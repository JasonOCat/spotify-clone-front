import {Component, inject, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {LibraryComponent} from './layout/library/library.component';
import {fontAwesomeIcons} from './shared/font-awesome-icons';
import {FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NavigationComponent} from './layout/navigation/navigation.component';
import {HeaderComponent} from './layout/header/header.component';
import {PlayerComponent} from './layout/player/player.component';

@Component({
  selector: 'app-root',
  imports: [
    LibraryComponent,
    RouterOutlet,
    FontAwesomeModule,
    NavigationComponent,
    HeaderComponent,
    PlayerComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'spotify-clone-front';
  private faIconLibrary = inject(FaIconLibrary);

  ngOnInit(): void {
    this.initFontAwesome();
  }

  private initFontAwesome() {
    this.faIconLibrary.addIcons(...fontAwesomeIcons);
  }
}
