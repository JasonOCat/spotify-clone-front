import { Routes } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {AddSongComponent} from './add-song/add-song.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'add-song',
    component: AddSongComponent
  },
];
