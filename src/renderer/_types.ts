import { SetStateAction, Dispatch } from 'react';
import { UseStateCallbackT } from './hooks/useStateCallback';
import { channels, screen } from './_data';

export type ChannelT = keyof typeof channels;

export type ScreenT = keyof typeof screen;

export type AppContextT = {
  screen: ScreenT;
  setScreen: Dispatch<SetStateAction<ScreenT>>;

  directoryPath: string;
  setDirectoryPath: UseStateCallbackT<string>;

  directories: string[];
  setDirectories: UseStateCallbackT<string[]>;

  images: string[];
  setImages: UseStateCallbackT<string[]>;
};
