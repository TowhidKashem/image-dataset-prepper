import React, { useState } from 'react';
import { Button } from '@chakra-ui/react';
import styled from '@emotion/styled';

export function ChooseDirectory() {
  const chooseFolder = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    if (!e.currentTarget.files) return;

    const { path } = e.currentTarget.files[0] as FileWithPath;
    const segments = path.split('/');
    segments.pop();
    segments.pop();
    const rootDirectory = segments.join('/');

    setDirectory(rootDirectory);
    directoryRef.current = rootDirectory;

    window.electron.ipcRenderer.sendMessage(GET_FOLDER_CONTENTS, {
      directory: rootDirectory,
      root: true
    });
  };

  const [hover, setHover] = useState(false);

  return (
    <UploadButtonWrapper>
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
    </UploadButtonWrapper>
  );
}

const UploadButtonWrapper = styled.div`
  position: relative;
  display: inline-block;
`;
