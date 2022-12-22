import { createContext } from 'react';
import { AppContextT } from './_types';

export const AppContext = createContext<AppContextT>(null);

export const channels = {
  GET_SUB_FOLDERS: 'GET_SUB_FOLDERS',
  GET_IMAGES: 'GET_IMAGES',
  DELETE_IMAGE: 'DELETE_IMAGE'
} as const;
