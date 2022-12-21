import { createContext, SetStateAction, Dispatch } from 'react';
import { UseStateCallbackT } from 'hooks/useStateCallback';

export type ScreenT = 'chooseDirectory' | 'directoryList' | 'directoryContent';

export const AppContext = createContext<{
  screen: ScreenT;
  setScreen: Dispatch<SetStateAction<ScreenT>>;

  directoryPath: string;
  setDirectoryPath: UseStateCallbackT<string>;

  directories: string[];
  setDirectories: UseStateCallbackT<string[]>;

  images: string[];
  setImages: UseStateCallbackT<string[]>;
}>(null);

export const GET_FOLDER_CONTENTS = 'GET_FOLDER_CONTENTS';
export const GET_IMAGE = 'GET_IMAGE';
export const DELETE_IMAGE = 'DELETE_IMAGE';

// export const TOAST_DURATION = 2_000;
