import {
  createContext,
  SetStateAction,
  Dispatch,
  MutableRefObject
} from 'react';
import { UseToastOptions } from '@chakra-ui/react';
import { UseStateCallbackT } from './useStateCallback';

export type EnvVarsT = Record<string, string | number | boolean>;

export const AppContext = createContext<{
  envVars: EnvVarsT;

  pathSegments: string[];
  setPathSegments: Dispatch<SetStateAction<string[]>>;

  directories: string[];
  setDirectories: UseStateCallbackT<string[]>;

  images: MutableRefObject<string[]>;
}>(null);

export const channels = {
  GET_ENV_VARS: 'GET_ENV_VARS',
  LIST_DIR: 'LIST_DIR',
  DELETE_FILE: 'DELETE_FILE'
} as const;

export const toastConfig: Partial<UseToastOptions> = {
  position: 'top',
  duration: 2_000,
  containerStyle: {
    fontSize: 'md'
  }
};
