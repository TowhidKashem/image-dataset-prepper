import { createContext, SetStateAction, Dispatch } from 'react';
import { UseStateCallbackT } from 'hooks/useStateCallback';

export type ScreenT = 'chooseDirectory' | 'directoryList' | 'directoryContent';

type AppContextT = {
  screen: ScreenT;
  setScreen: Dispatch<SetStateAction<ScreenT>>;

  directoryPath: string;
  setDirectoryPath: UseStateCallbackT<string>;

  directories: string[];
  setDirectories: UseStateCallbackT<string[]>;

  images: string[];
  setImages: UseStateCallbackT<string[]>;
};

export const AppContext = createContext<AppContextT>(null);

export const topics = {
  GET_FOLDER_CONTENTS: 'GET_FOLDER_CONTENTS',
  GET_IMAGE: 'GET_IMAGE',
  DELETE_IMAGE: 'DELETE_IMAGE'
} as const;

export type TopicT = keyof typeof topics;
