import { useState, useEffect, useContext, useRef } from 'react';
import {
  useToast,
  Image,
  Icon,
  Flex,
  Box,
  Badge,
  Heading,
  List,
  ListItem,
  ListIcon
} from '@chakra-ui/react';
import { FcOpenedFolder, FcDocument } from 'react-icons/fc';
import { IoLocation, IoArrowRedo, IoImage } from 'react-icons/io5';
import { Navigation } from './Navigation';
import {
  AppContext,
  channels,
  toastConfig,
  ERROR_DURATION,
  NAV_KEYS
} from './_data';
import { sortImages, isValidImage } from './_utils';
import popSound from '../../assets/pop.mp3';

const { ipcRenderer } = window.app;

export function DirectoryContent() {
  const toast = useToast(toastConfig);

  const { pathSegments, directories, visitedDirs, setVisitedDirs, images } =
    useContext(AppContext);

  const imageIndex = useRef(0);

  const deleteHistory = useRef<DirContentT[]>([]);
  const isDeleteTouched = useRef(false);

  // since we use refs to store images and the active image index, updating them won't trigger a re-render
  // so use this flag to force re-renders. And the reason for using refs instead of state is due to stale values
  // being cached inside event handlers - https://reactjs.org/docs/hooks-faq.html#why-am-i-seeing-stale-props-or-state-inside-my-function

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setTriggerRender] = useState(false);

  const [loopCount, setLoopCount] = useState(0);
  const [isDirEmpty, setIsDirEmpty] = useState(false);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyboardNav);

    return () => {
      emptyTrash();

      window.removeEventListener('keydown', handleKeyboardNav);
    };
  }, []);

  const markDirVisited = (): void => {
    const curPath = `/${pathSegments.join('/')}`;

    if (visitedDirs.includes(curPath)) return;

    const newVisitedDirs = [...visitedDirs, curPath];

    setVisitedDirs(newVisitedDirs);
    localStorage.setItem('visitedDirs', JSON.stringify(newVisitedDirs));
  };

  const handleKeyboardNav = (e: KeyboardEvent): void | Promise<void> => {
    const KEY = e.key.toLowerCase();
    const isUndo = (e.ctrlKey || e.metaKey) && KEY === 'z';

    if (isUndo) return undoDelete();

    switch (KEY) {
      case NAV_KEYS.delete:
        return deleteImage();
      case NAV_KEYS.next:
        return nextImage();
      case NAV_KEYS.prev:
        return prevImage();
      case NAV_KEYS.pick:
        return pickImage();
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

        new Audio(popSound).play();

        // only mark the directory as visited if the
        // user has looped through all the images at least once
        markDirVisited();
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
    const imageToDelete = images.current[imageIndex.current];

    try {
      const { error } = await ipcRenderer.invoke<ResponseT<void>>(
        channels.DELETE_FILE,
        imageToDelete.path
      );

      if (error) throw error;

      deleteHistory.current.push(imageToDelete);

      images.current = sortImages(
        images.current.filter(({ path }) => path !== imageToDelete.path)
      );

      setTriggerRender((prev) => !prev);

      if (images.current.length === 0) {
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
        status: 'error',
        duration: ERROR_DURATION
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
        lastDeleted.path
      );

      if (error) throw error;

      // put it back in the images array
      images.current.push(lastDeleted);
      sortImages(images.current);
      setTriggerRender((prev) => !prev);

      toast({
        description: 'Restored!',
        status: 'info'
      });
    } catch (error) {
      toast({
        description: error.toString(),
        status: 'error',
        duration: ERROR_DURATION
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
        status: 'error',
        duration: ERROR_DURATION
      });
    }
  };

  const pickImage = async (): Promise<void> => {
    const pickedImage = images.current[imageIndex.current];

    try {
      const { error } = await ipcRenderer.invoke<ResponseT<void>>(
        channels.MOVE_FILE,
        pickedImage.path
      );

      if (error) throw error;

      images.current = sortImages(
        images.current.filter(({ path }) => path !== pickedImage.path)
      );

      setTriggerRender((prev) => !prev);

      if (images.current.length === 0) {
        setIsDirEmpty(true);

        window.removeEventListener('keyup', handleKeyboardNav);
      }

      toast({
        description: 'Image picked!',
        status: 'info',
        variant: 'subtle'
      });
    } catch (error) {
      toast({
        description: error.toString(),
        status: 'error',
        duration: ERROR_DURATION
      });
    }
  };

  const { path, name, extension } = images.current[imageIndex.current];

  const totalImages = images.current.length;

  const imageDetails = [
    {
      key: 'count',
      isVisible: totalImages > 0,
      icon: IoLocation,
      value: `${imageIndex.current + 1} / ${totalImages} images`
    },
    {
      key: 'loops',
      isVisible: true,
      icon: IoArrowRedo,
      value: `${loopCount} loops`
    },
    {
      key: 'extension',
      isVisible: !!extension,
      icon: IoImage,
      value: extension
    }
  ];

  const isImageFile = isValidImage({ extension: extension.slice(1) });

  const NAV_BAR_HEIGHT = '105px'; // nav height (55px) + vertical margins (25px * 2)

  return (
    <>
      <Navigation
        backPath={directories.length ? '/directoryList' : '/chooseDirectory'}
      />

      <Flex
        alignItems="center"
        justifyContent="center"
        width="100%"
        height={`calc(100vh - ${NAV_BAR_HEIGHT})`}
        paddingBottom="2rem"
      >
        {isImageFile ? (
          <Image
            src={`img://${path}`}
            alt=""
            maxWidth="100%"
            maxHeight="100%"
            boxShadow="md"
          />
        ) : (
          <Box position="relative" paddingBottom={8}>
            <Icon as={FcDocument} fontSize="18rem" />

            <Badge
              position="absolute"
              left="50%"
              bottom={2}
              transform="translateX(-50%)"
              fontSize={18}
              boxShadow="lg"
              maxWidth={300}
              isTruncated
            >
              {name}
            </Badge>
          </Box>
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
            top={NAV_BAR_HEIGHT}
            right={0}
            spacing={3}
            padding={5}
            background="rgba(0, 0, 0, 0.4)"
            backdropFilter="blur(1rem)"
            borderTopLeftRadius={8}
            borderBottomLeftRadius={8}
            width={240}
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
