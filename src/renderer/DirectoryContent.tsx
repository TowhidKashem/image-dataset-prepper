import { useState, useEffect, useContext, useRef } from 'react';
import {
  useToast,
  Image,
  Icon,
  Flex,
  Heading,
  List,
  ListItem,
  ListIcon
} from '@chakra-ui/react';
import { FcOpenedFolder } from 'react-icons/fc';
import { FaHashtag, FaUndo, FaRegImage } from 'react-icons/fa';
import { Navigation } from './Navigation';
import { AppContext, channels, toastConfig } from './_data';
import { getFileExtension } from './_utils';

const { ipcRenderer } = window.electron;

export function DirectoryContent() {
  const toast = useToast(toastConfig);

  const {
    appData: { envVars },
    pathSegments,
    images
  } = useContext(AppContext);

  const imageIndex = useRef(0);
  const deleteHistory = useRef<string[]>([]);
  const isDeleteTouched = useRef(false);

  // since we use refs to store images and the active image index, updating them won't trigger a re-render
  // so use this flag to force re-renders. And the reason for using refs instead of state is due to stale values
  // being cached inside event handlers - https://reactjs.org/docs/hooks-faq.html#why-am-i-seeing-stale-props-or-state-inside-my-function
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setTriggerRender] = useState(false);

  const [loopCount, setLoopCount] = useState(0);
  const [isDirEmpty, setIsDirEmpty] = useState(false);

  useEffect(() => {
    window.addEventListener('keyup', handleKeyboardNav);

    return () => {
      if (isDeleteTouched.current) emptyTrash();

      window.removeEventListener('keyup', handleKeyboardNav);
    };
  }, []);

  const handleKeyboardNav = (e: KeyboardEvent): void | Promise<void> => {
    switch (e.key) {
      case ' ':
        return deleteImage();
      case 'ArrowRight':
        return nextImage();
      case 'ArrowLeft':
        return prevImage();
      case 'Meta':
        return undoDelete();
    }
  };

  const nextImage = (): void => {
    if (images.current.length < 0) return;

    let nextIndex = imageIndex.current + 1;

    const isEndReached = nextIndex > images.current.length - 1;

    if (isEndReached) {
      nextIndex = 0;

      if (images.current.length !== 1) {
        setLoopCount((prevCount) => prevCount + 1);

        new Audio(`file://${envVars.PROJECT_ROOT}/assets/pop.mp3`).play();
      }
    }

    imageIndex.current = nextIndex;

    setTriggerRender((prev) => !prev);
  };

  const prevImage = (): void => {
    if (images.current.length < 0) return;

    let prevIndex = imageIndex.current - 1;

    if (prevIndex < 0) prevIndex = images.current.length - 1;

    imageIndex.current = prevIndex;

    setTriggerRender((prev) => !prev);
  };

  const deleteImage = async (): Promise<void> => {
    const imgToDelete = images.current[imageIndex.current];

    try {
      const { error } = await ipcRenderer.invoke<ResponseT<void>>(
        channels.DELETE_FILE,
        imgToDelete
      );

      if (error) throw error;

      images.current = images.current.filter((image) => image !== imgToDelete);

      deleteHistory.current.push(imgToDelete);

      if (images.current.length > 0) {
        nextImage();
      } else {
        setIsDirEmpty(true);

        window.removeEventListener('keyup', handleKeyboardNav);
      }

      toast({
        description: 'Image deleted!',
        status: 'success'
      });
    } catch (error) {
      toast({
        description: error.toString(),
        status: 'error'
      });
    } finally {
      isDeleteTouched.current = true;
    }
  };

  const undoDelete = async (): Promise<void> => {
    if (deleteHistory.current.length === 0) return;

    try {
      const lastDeleted = deleteHistory.current.pop();

      const { error } = await ipcRenderer.invoke<ResponseT<void>>(
        channels.UNDO_DELETE,
        lastDeleted
      );

      if (error) throw error;

      toast({
        description: 'Restored Image!',
        status: 'success'
      });
    } catch (error) {
      toast({
        description: error.toString(),
        status: 'error'
      });
    }
  };

  const emptyTrash = async (): Promise<void> => {
    try {
      const { error } = await ipcRenderer.invoke<ResponseT<void>>(
        channels.EMPTY_TRASH,
        pathSegments.join('/')
      );

      if (error) throw error;
    } catch (error) {
      toast({
        title: 'Trash not Emptied!',
        description: error.toString(),
        status: 'error'
      });
    }
  };

  const activeImage = images.current[imageIndex.current];
  const extension = getFileExtension(activeImage);
  const totalImages = images.current.length;
  const imageDetails = [
    {
      key: 'count',
      isVisible: totalImages > 0,
      icon: FaHashtag,
      value: `${imageIndex.current + 1} / ${totalImages} images`
    },
    {
      key: 'loops',
      isVisible: true,
      icon: FaUndo,
      value: `${loopCount} loops`
    },
    {
      key: 'extension',
      isVisible: extension,
      icon: FaRegImage,
      value: extension
    }
  ];

  return (
    <>
      <Navigation backPath="/directoryList" />

      <Flex
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="calc(100vh - 95px)" // 95px = nav height + vertical margins
        paddingBottom="2rem"
      >
        {activeImage && (
          <Image
            src={`file://${activeImage}`}
            alt=""
            maxWidth="100%"
            maxHeight="100%"
            boxShadow="md"
          />
        )}

        {isDirEmpty ? (
          <Flex flexDirection="column" alignItems="center">
            <Icon boxSize="4.5rem" as={FcOpenedFolder} display="block" />

            <Heading
              as="h2"
              size="xl"
              marginTop={5}
              color="whiteAlpha.800"
              textShadow="0.1rem 0.1rem black.500"
            >
              All images deleted in this folder
            </Heading>
          </Flex>
        ) : (
          <List
            position="fixed"
            top={0}
            right={0}
            spacing={3}
            padding={5}
            background="rgba(0, 0, 0, 0.4)"
            borderBottomLeftRadius={10}
            width={200}
          >
            {imageDetails.map(({ key, isVisible, value, icon }) =>
              isVisible ? (
                <ListItem key={key} color="whiteAlpha.800" fontSize={18}>
                  <ListIcon as={icon} />
                  {value}
                </ListItem>
              ) : null
            )}
          </List>
        )}
      </Flex>
    </>
  );
}
