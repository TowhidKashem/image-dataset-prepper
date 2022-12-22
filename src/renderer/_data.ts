import { createContext } from 'react';
import { AppContextT } from './_types';

export const topics = {
  GET_SUB_FOLDERS: 'GET_SUB_FOLDERS',
  GET_IMAGES: 'GET_IMAGES',
  DELETE_IMAGE: 'DELETE_IMAGE'
} as const;

export const screen = {
  chooseDirectory: 'chooseDirectory',
  directoryList: 'directoryList',
  directoryContent: 'directoryContent'
} as const;

export const AppContext = createContext<AppContextT>(null);
