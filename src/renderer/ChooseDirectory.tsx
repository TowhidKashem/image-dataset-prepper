import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast, Flex } from '@chakra-ui/react';
import { UploadButton } from './UploadButton';
import { AppContext, channels, toastConfig } from './_data';
import { getRootFileDir } from './_utils';

const { ipcRenderer } = window.electron;

export function ChooseDirectory() {
  const navigate = useNavigate();

  const toast = useToast(toastConfig);

  const { setPathSegments, setDirectories, images } = useContext(AppContext);

  const chooseFolder = async (
    e: React.SyntheticEvent<HTMLInputElement>,
    isRoot = true
  ): Promise<void> => {
    if (!e.currentTarget.files) return;

    const { segments, path } = getRootFileDir(e.currentTarget.files[0].path);

    try {
      const { data, error } = await ipcRenderer.invoke<
        ResponseT<DirContentT[]>
      >(channels.LIST_DIR, path);

      if (error) throw error;

      setPathSegments(segments);

      if (isRoot) {
        return setDirectories(data, () =>
          navigate('/directoryList', { replace: true })
        );
      }

      images.current = data;

      navigate('/directoryList', { replace: true });
    } catch (error) {
      toast({
        description: error.toString(),
        status: 'error'
      });
    }
  };

  return (
    <Flex
      width="100%"
      flex={1}
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      rowGap={8}
    >
      <UploadButton buttonTheme="green" onChange={chooseFolder}>
        Choose Root Folder
      </UploadButton>

      <UploadButton buttonTheme="blue" onChange={(e) => chooseFolder(e, false)}>
        Choose Single Folder
      </UploadButton>
    </Flex>
  );
}
