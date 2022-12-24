import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast, Flex, Box, Input, Button } from '@chakra-ui/react';
import { AppContext, channels, toastConfig } from './_data';
import { getRootFileDir } from './_utils';

const { ipcRenderer } = window.electron;

export function ChooseDirectory() {
  const navigate = useNavigate();

  const toast = useToast(toastConfig);

  const { setPathSegments, setDirectories } = useContext(AppContext);

  const [hover, setHover] = useState(false);

  const chooseFolder = async (
    e: React.SyntheticEvent<HTMLInputElement>
  ): Promise<void> => {
    if (!e.currentTarget.files) return;

    const { segments, path } = getRootFileDir(e.currentTarget.files[0].path);

    try {
      const { data, error } = await ipcRenderer.invoke<
        ResponseT<DirContentT[]>
      >(channels.LIST_DIR, path);

      if (error) throw error;

      setPathSegments(segments);

      setDirectories(data, () => {
        navigate('/directoryList', { replace: true });
      });
    } catch (error) {
      toast({
        description: error.toString(),
        status: 'error'
      });
    }
  };

  return (
    <Flex width="100%" flex={1} alignItems="center" justifyContent="center">
      <Box position="relative">
        <Input
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
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          opacity={0}
          zIndex={1}
        />

        <Button size="lg" colorScheme={hover ? 'twitter' : 'blue'}>
          Choose Folder
        </Button>
      </Box>
    </Flex>
  );
}
