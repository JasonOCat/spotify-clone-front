import {FormControl} from "@angular/forms";

export type CreateSongFormContent = {
  title: FormControl<string>;
  artist: FormControl<string>;
  cover: FormControl<File | null>;
  file: FormControl<File | null>;
}
