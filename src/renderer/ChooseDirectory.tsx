import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button } from '@chakra-ui/react';
import { AppContext, channels } from './_data';
import { logger } from './_utils';

const { ipcRenderer } = window.electron;

export function ChooseDirectory() {
  const navigate = useNavigate();

  const { setDirPath, setDirectories } = useContext(AppContext);

  const [hover, setHover] = useState(false);

  const chooseFolder = async (
    e: React.SyntheticEvent<HTMLInputElement>
  ): Promise<void> => {
    if (!e.currentTarget.files) return;

    const { path } = e.currentTarget.files[0] as File & {
      path: string;
    };

    const segments = path.split('/');
    segments.pop();
    segments.pop();
    const directory = segments.join('/');

    setDirPath(directory);

    console.warn('[pub][GET_SUB_FOLDERS]:', { directory });

    try {
      const contents = await ipcRenderer.invoke(
        channels.GET_SUB_FOLDERS,
        directory
      );

      setDirectories(contents);
      setDirPath(directory);

      logger('sub', channels.GET_SUB_FOLDERS, { contents, directory });

      navigate('/directoryList', { replace: true });
    } catch (error) {
      console.error(error);
    }
  };

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
        // @ts-ignore
        webkitdirectory=""
        mozdirectory="" // eslint-disable-line react/no-unknown-property
        directory="" // eslint-disable-line react/no-unknown-property
        multiple
      />

      <Button size="lg" colorScheme={hover ? 'twitter' : 'blue'}>
        Choose Folder
      </Button>
    </Box>
  );
}
