import {Component, DestroyRef, effect, inject, signal} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {SongService} from '../service/song.service';
import {Router} from '@angular/router';
import {ToastService} from '../service/toast.service';
import {CreateSongFormContent} from './add-song-form.model';
import {NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {CreateSong} from '../service/model/song.model';


type FlowStatus = 'init' | 'validation-file-error' | 'validation-cover-error' | 'success' | 'error';


@Component({
  selector: 'app-add-song',
  imports: [
    ReactiveFormsModule, NgbAlertModule, FontAwesomeModule
  ],
  templateUrl: './add-song.component.html',
  styleUrl: './add-song.component.scss'
})

export class AddSongComponent {

  public songToCreate: CreateSong = {};

  private formBuilder = inject(FormBuilder);

  private songService = inject(SongService);

  private router = inject(Router);

  private toastService = inject(ToastService);

  flowStatus: FlowStatus = 'init';

  private destroyRef = inject(DestroyRef);

  // Signals
  isAddingSong = this.songService.addSongIsProcessing
  addedSong = this.songService.addedSong
  addSongStatus = this.songService.addSongStatus
  addSongErrorMessage = this.songService.addSongErrorMessage;

  constructor() {
    effect(() => {
      if(this.songService.addSongStatus() === "OK") {
        this.songService.fetchSongs();
        this.toastService.show('Song created with success', "SUCCESS");
        this.router.navigate(['/']);
      } else if (this.songService.addSongStatus() === "ERROR") {
        this.toastService.show('Error occurred when creating song, please try again', "DANGER");
      }
    });

    this.destroyRef.onDestroy(() => this.songService.reset());
  }

  public createForm = this.formBuilder.nonNullable.group<CreateSongFormContent>({
    title: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    artist: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    cover: new FormControl(null, {nonNullable: true, validators: [Validators.required]}),
    file: new FormControl(null, {nonNullable: true, validators: [Validators.required]}),
  });

  create(): void {
    if (this.songToCreate.file === null) {
      this.flowStatus = 'validation-file-error';
    }

    if (this.songToCreate.cover === null) {
      this.flowStatus = 'validation-cover-error';
    }

    const title =  this.createForm.value.title;
    const artist = this.createForm.value.artist;


    this.songToCreate.title = title;
    this.songToCreate.artist = artist;

    this.songService.add(this.songToCreate);
  }

  private extractFileFromTarget(target: EventTarget | null): File | null {
    const htmlInputTarget = target as HTMLInputElement;
    if (target === null || htmlInputTarget.files === null) {
      return null;
    }
    return htmlInputTarget.files[0];
  }

  onUploadCover(target: EventTarget | null) {
    const cover = this.extractFileFromTarget(target);
    if (cover !== null) {
      this.songToCreate.cover = cover;
      this.songToCreate.coverContentType = cover.type;
    }
  }

  onUploadFile(target: EventTarget | null) {
    const file = this.extractFileFromTarget(target);
    if (file !== null) {
      this.songToCreate.file = file;
      this.songToCreate.fileContentType = file.type;
    }
  }

}
