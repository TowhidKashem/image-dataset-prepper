import { SetStateAction, Dispatch } from 'react';
import { channels } from './_data';

export type ChannelT = keyof typeof channels;

export type AppContextT = {
  directoryPath: string;
  setDirectoryPath: Dispatch<SetStateAction<string>>;

  directories: string[];
  setDirectories: Dispatch<SetStateAction<string[]>>;

  images: string[];
  setImages: Dispatch<SetStateAction<string[]>>;
};
