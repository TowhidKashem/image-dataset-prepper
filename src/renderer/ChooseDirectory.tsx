import { useState, useContext } from 'react';
import { Box, Button } from '@chakra-ui/react';
import { AppContext, channels } from './_data';

export function ChooseDirectory() {
  const { screen, setDirectoryPath } = useContext(AppContext);

  const [hover, setHover] = useState(false);

  const chooseFolder = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    if (!e.currentTarget.files) return;

    const { path } = e.currentTarget.files[0] as File & {
      path: string;
    };

    const segments = path.split('/');
    segments.pop();
    segments.pop();
    const directory = segments.join('/');

    setDirectoryPath(directory);

    console.warn('[pub][GET_SUB_FOLDERS]:', { directory });

    window.electron.ipcRenderer.sendMessage(channels.GET_SUB_FOLDERS, {
      directory
    });
  };

  if (screen !== 'chooseDirectory') return null;

  return (
    <Box position="relative">
      <input
        type="file"
        onChange={chooseFolder}
        onClick={({ target }) => {
          (target as HTMLInputElement).value = '';
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        webkitdirectory=""
        mozdirectory=""
        directory=""
        multiple
      />

      <Button size="lg" colorScheme={hover ? 'twitter' : 'blue'}>
        Choose Folder
      </Button>
    </Box>
  );
}
