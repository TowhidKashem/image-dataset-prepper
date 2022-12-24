import {
  createContext,
  SetStateAction,
  Dispatch,
  MutableRefObject
} from 'react';
import { UseToastOptions } from '@chakra-ui/react';
import { UseStateCallbackT } from './useStateCallback';

export type AppDataT = {
  envVars: Record<string, string>;
};

export const AppContext = createContext<{
  appData: AppDataT;

  pathSegments: string[];
  setPathSegments: Dispatch<SetStateAction<string[]>>;

  directories: DirContentT[];
  setDirectories: UseStateCallbackT<DirContentT[]>;

  images: MutableRefObject<string[]>;
}>(null);

export const channels = {
  GET_APP_DATA: 'GET_APP_DATA',
  LIST_DIR: 'LIST_DIR',
  DELETE_FILE: 'DELETE_FILE',
  UNDO_DELETE: 'UNDO_DELETE',
  EMPTY_TRASH: 'EMPTY_TRASH'
} as const;

export const toastConfig: Partial<UseToastOptions> = {
  position: 'top',
  duration: 2_000,
  containerStyle: {
    fontSize: 'md'
  }
};
