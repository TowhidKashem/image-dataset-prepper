import { useState, useContext } from 'react';
import { Box, Button } from '@chakra-ui/react';
import { AppContext, topics } from './_data';

const { GET_SUB_FOLDERS } = topics;

interface FileWithPath extends File {
  path: string;
}

export function ChooseDirectory() {
  const { screen, setDirectoryPath } = useContext(AppContext);

  const [hover, setHover] = useState(false);

  const chooseFolder = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    if (!e.currentTarget.files) return;

    const { path } = e.currentTarget.files[0] as FileWithPath;
    const segments = path.split('/');
    segments.pop();
    segments.pop();
    const directory = segments.join('/');

    setDirectoryPath(directory);

    window.electron.ipcRenderer.sendMessage(GET_SUB_FOLDERS, { directory });
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
