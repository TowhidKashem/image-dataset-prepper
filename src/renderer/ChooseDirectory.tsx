import { useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useToast,
  useDisclosure,
  Flex,
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogBody
} from '@chakra-ui/react';
import { UploadButton } from './UploadButton';
import { AppContext, channels, toastConfig, ERROR_DURATION } from './_data';
import { getRootDir } from './_utils';
import { Logo } from './Logo';

const { ipcRenderer } = window.electron;

const DIR_INITIAL_STATE: {
  type: 'root' | 'single';
  fileInput: string;
  dirPicker: string;
} = {
  type: null,
  fileInput: null,
  dirPicker: null
};

export function ChooseDirectory() {
  const navigate = useNavigate();

  const toast = useToast(toastConfig);

  const dirSelection = useRef(DIR_INITIAL_STATE);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { setPathSegments, setDirectories, images } = useContext(AppContext);

  const chooseFolder = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    dirSelection.current.fileInput = e.currentTarget.files[0].path;
    onOpen();
  };

  const chooseAgain = async (): Promise<void> => {
    try {
      const { name } = await window.showDirectoryPicker();
      dirSelection.current.dirPicker = name;

      getFolderContents();
      onClose();
    } catch (error) {
      toast({
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
    dirSelection.current = DIR_INITIAL_STATE;
  };

  const getFolderContents = async (): Promise<void> => {
    const { type, fileInput, dirPicker } = dirSelection.current;

    const { segments, path } = getRootDir(fileInput, dirPicker);

    resetHistory();

    try {
      const { data, error } = await ipcRenderer.invoke<
        ResponseT<DirContentT[]>
      >(channels.LIST_DIR, path);

      if (error) throw error;

      setPathSegments(segments);

      if (type === 'root') {
        setDirectories(data, () => {
          navigate('/directoryList', { replace: true });
        });
      } else {
        images.current = data;

        navigate('/directoryContent', { replace: true });
      }
    } catch (error) {
      toast({
        title: 'Are you sure you picked the same folder both times?',
        description: error.toString(),
        status: 'error',
        duration: ERROR_DURATION
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

      <UploadButton
        buttonTheme="green"
        onChange={(e) => {
          dirSelection.current.type = 'root';
          chooseFolder(e);
        }}
      >
        Choose Root Folder
      </UploadButton>

      <UploadButton
        buttonTheme="blue"
        onChange={(e) => {
          dirSelection.current.type = 'single';
          chooseFolder(e);
        }}
      >
        Choose Single Folder
      </UploadButton>

      <AlertDialog
        leastDestructiveRef={null}
        isOpen={isOpen}
        onClose={onClose}
        size="sm"
        motionPreset="slideInBottom"
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Choose the same folder again
            </AlertDialogHeader>

            <AlertDialogBody fontSize="md">
              Ugh this is kinda annoying but due to some file system
              limitations, you'll need to pick the same folder twice!
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button colorScheme="whatsapp" onClick={chooseAgain}>
                Choose Again
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
}
