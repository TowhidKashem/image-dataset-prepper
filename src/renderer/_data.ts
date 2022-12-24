import { createContext, SetStateAction, Dispatch } from 'react';
import { UseStateCallbackT } from './useStateCallback';

export type EnvVarsT = Record<string, string | number | boolean>;

export const AppContext = createContext<{
  envVars: EnvVarsT;

  pathSegments: string[];
  setPathSegments: Dispatch<SetStateAction<string[]>>;

  directories: string[];
  setDirectories: UseStateCallbackT<string[]>;

  images: string[];
  setImages: UseStateCallbackT<string[]>;
}>(null);

export const channels = {
  GET_ENV_VARS: 'GET_ENV_VARS',
  LIST_DIR: 'LIST_DIR',
  DELETE_FILE: 'DELETE_FILE'
} as const;
