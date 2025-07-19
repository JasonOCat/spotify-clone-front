export interface SongBase {
  publicId?: string;
  title?: string;
  artist?: string;
}

export interface CreateSong extends SongBase {
  file?: File;
  fileContentType?: string;
  cover?: File;
  coverContentType?: string;
}

export interface SongDTO extends SongBase {
  cover?: string;
  coverContentType?: string;
  favorite: boolean;
  displayPlay: boolean;
}
