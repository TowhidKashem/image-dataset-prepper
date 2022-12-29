import {
  createContext,
  SetStateAction,
  Dispatch,
  MutableRefObject
} from 'react';
import { UseToastOptions } from '@chakra-ui/react';
import { UseStateCallbackT } from './useStateCallback';

export const AppContext = createContext<{
  images: MutableRefObject<DirContentT[]>;

  pathSegments: string[];
  setPathSegments: Dispatch<SetStateAction<string[]>>;

  directories: DirContentT[];
  setDirectories: UseStateCallbackT<DirContentT[]>;

  visitedDirs: string[];
  setVisitedDirs: Dispatch<SetStateAction<string[]>>;
}>(null);

export const channels = {
  LIST_DIR: 'LIST_DIR',
  DELETE_FILE: 'DELETE_FILE',
  UNDO_DELETE: 'UNDO_DELETE',
  EMPTY_TRASH: 'EMPTY_TRASH',
  MOVE_FILE: 'MOVE_FILE',
  GET_PICKED_COUNT: 'GET_PICKED_COUNT'
} as const;

export const NAV_KEYS = {
  next: 'arrowright',
  prev: 'arrowleft',
  delete: ' ',
  pick: 'a'
};

const SUCCESS_DURATION = 1_500;
export const ERROR_DURATION = 10_000;

export const toastConfig: Partial<UseToastOptions> = {
  position: 'top',
  duration: SUCCESS_DURATION,
  containerStyle: {
    fontSize: 'md'
  }
};
