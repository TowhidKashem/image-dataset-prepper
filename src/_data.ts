import React from 'react';

export const AppContext = React.createContext<{
  directory: string;
  directories: string[];
}>(null);

export const GET_FOLDER_CONTENTS = 'GET_FOLDER_CONTENTS';
export const GET_IMAGE = 'GET_IMAGE';
export const DELETE_IMAGE = 'DELETE_IMAGE';

export const TOAST_DURATION = 2_000;
