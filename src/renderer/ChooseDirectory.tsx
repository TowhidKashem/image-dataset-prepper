import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button } from '@chakra-ui/react';
import { AppContext, channels } from './_data';
import { getRootFileDir } from './_utils';

const { ipcRenderer } = window.electron;

export function ChooseDirectory() {
  const navigate = useNavigate();

  const { setPathSegments, setDirectories } = useContext(AppContext);

  const [hover, setHover] = useState(false);

  const chooseFolder = async (
    e: React.SyntheticEvent<HTMLInputElement>
  ): Promise<void> => {
    if (!e.currentTarget.files) return;

    const { segments, path } = getRootFileDir(e.currentTarget.files[0].path);

    try {
      const { data, error } = await ipcRenderer.invoke<Res<string[]>>(
        channels.LIST_DIR,
        path
      );

      if (error) throw error;

      setPathSegments(segments);

      setDirectories(data, () => {
        navigate('/directoryList', { replace: true });
      });
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
