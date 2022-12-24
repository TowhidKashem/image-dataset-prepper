import { createContext, SetStateAction, Dispatch } from 'react';
import { UseStateCallbackT } from './useStateCallback';

export const AppContext = createContext<{
  pathSegments: string[];
  setPathSegments: Dispatch<SetStateAction<string[]>>;

  directories: string[];
  setDirectories: UseStateCallbackT<string[]>;

  images: string[];
  setImages: UseStateCallbackT<string[]>;
}>(null);

export const channels = {
  LIST_DIR: 'LIST_DIR',
  DELETE_IMAGE: 'DELETE_IMAGE'
} as const;
