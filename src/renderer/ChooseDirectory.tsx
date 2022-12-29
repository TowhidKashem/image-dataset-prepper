import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast, Flex, Button } from '@chakra-ui/react';
import { AppContext, channels, toastConfig, ERROR_DURATION } from './_data';
import { removeStartEndSlash } from './_utils';
import { Logo } from './Logo';

const { ipcRenderer, openDialogPicker, onDialogPickerResult } = window.app;

export function ChooseDirectory() {
  const navigate = useNavigate();

  const toast = useToast(toastConfig);

  const { setPathSegments, setDirectories, images } = useContext(AppContext);

  useEffect(() => {
    onDialogPickerResult(({ canceled, filePaths }) => {
      if (!canceled) {
        getFolderContents(filePaths[0]);
      }
    });
  }, []);

  const getFolderContents = async (dirPath: string): Promise<void> => {
    const pathSegments = removeStartEndSlash(dirPath).split('/');

    resetHistory();

    try {
      const { data, error } = await ipcRenderer.invoke<
        ResponseT<DirContentT[]>
      >(channels.LIST_DIR, dirPath);

      if (error) throw error;

      setPathSegments(pathSegments);

      const isParent = data.every(({ isDir }) => isDir);

      if (isParent) {
        setDirectories(data, () => {
          navigate('/directoryList', { replace: true });
        });
      } else {
        images.current = data;
        navigate('/directoryContent', { replace: true });
      }
    } catch (error) {
      toast({
        title: 'Failed to get folder contents',
        description: error.toString(),
        status: 'error',
        duration: ERROR_DURATION
      });
    }
  };

  const resetHistory = (): void => {
    setPathSegments([]);
    setDirectories([]);
    images.current = [];
  };

  return (
    <Flex
      width="100%"
      flex={1}
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      rowGap={6}
    >
      <Flex
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        boxShadow="lg"
        marginBottom={5}
      >
        <Logo />
      </Flex>

      <Button colorScheme="blue" size="lg" onClick={openDialogPicker}>
        Choose Folder
      </Button>
    </Flex>
  );
}
