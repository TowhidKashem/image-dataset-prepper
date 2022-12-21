import React from 'react';
import { UseStateCallbackT } from './hooks/useStateCallback';

export type ScreenT = 'chooseDirectory' | 'directoryList' | 'directoryContent';

export const AppContext = React.createContext<{
  screen: ScreenT;
  setScreen: React.Dispatch<React.SetStateAction<ScreenT>>;

  directory: string;
  setDirectory: React.Dispatch<React.SetStateAction<string>>;

  directories: string[];
  setDirectories: UseStateCallbackT<string[]>;
}>(null);

export const GET_FOLDER_CONTENTS = 'GET_FOLDER_CONTENTS';
export const GET_IMAGE = 'GET_IMAGE';
export const DELETE_IMAGE = 'DELETE_IMAGE';

export const TOAST_DURATION = 2_000;
