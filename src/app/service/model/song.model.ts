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

export interface ReadSong extends SongBase {
  cover?: string;
  coverContentType?: string;
  favorite: boolean;
  displayPlay: boolean;
}

export interface SongContent extends ReadSong {
  file?: string;
  fileContentType?: string;
}
