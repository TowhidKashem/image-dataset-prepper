import { createContext, SetStateAction, Dispatch } from 'react';

export const AppContext = createContext<{
  dirPath: string;
  setDirPath: Dispatch<SetStateAction<string>>;

  directories: string[];
  setDirectories: Dispatch<SetStateAction<string[]>>;

  images: string[];
  setImages: Dispatch<SetStateAction<string[]>>;
}>(null);

export const channels = {
  GET_SUB_FOLDERS: 'GET_SUB_FOLDERS',
  GET_IMAGES: 'GET_IMAGES',
  DELETE_IMAGE: 'DELETE_IMAGE'
} as const;
