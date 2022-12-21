import React, { useState, useContext } from 'react';
import { Box, Button } from '@chakra-ui/react';
import { AppContext, GET_FOLDER_CONTENTS } from './_data';

export function ChooseDirectory() {
  const { screen, setDirectory } = useContext(AppContext);

  const [hover, setHover] = useState(false);

  const chooseFolder = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    if (!e.currentTarget.files) return;

    const { path } = e.currentTarget.files[0] as FileWithPath;
    const segments = path.split('/');
    segments.pop();
    segments.pop();
    const rootDirectory = segments.join('/');

    setDirectory(rootDirectory);

    window.electron.ipcRenderer.sendMessage(GET_FOLDER_CONTENTS, {
      directory: rootDirectory,
      root: true
    });
  };

  if (screen !== 'chooseDirectory') return null;

  return (
    <Box position="relative">
      <input
        type="file"
        // @ts-ignore
        webkitdirectory=""
        directory=""
        multiple
        onInput={chooseFolder}
        onChange={chooseFolder}
        onClick={({ target }) => {
          (target as HTMLInputElement).value = '';
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      />
      <Button size="lg" colorScheme={hover ? 'twitter' : 'blue'}>
        Choose Root Folder
      </Button>
    </Box>
  );
}
