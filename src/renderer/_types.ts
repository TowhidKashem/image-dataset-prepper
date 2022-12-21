import { SetStateAction, Dispatch } from 'react';
import { UseStateCallbackT } from './hooks/useStateCallback';
import { topics, screen } from './_data';

export type TopicT = keyof typeof topics;

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
