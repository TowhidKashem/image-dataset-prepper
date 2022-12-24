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
import { AppContext, channels } from './_data';
import { getFileExtension } from './_utils';

const { ipcRenderer } = window.electron;

const TOAST_DURATION = 2_000;

export function DirectoryContent() {
  const toast = useToast();

  const { envVars, images } = useContext(AppContext);

  const imageIndex = useRef(0);
  const [currentImage, setCurrentImage] = useState(
    images.current[imageIndex.current]
  );

  const [loopCount, setLoopCount] = useState(0);
  const [isDirEmpty, setIsDirEmpty] = useState(false);

  useEffect(() => {
    window.addEventListener('keyup', handleKeyboardNav);

    return () => {
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
      default:
        return null;
    }
  };

  const nextImage = (): void => {
    if (images.current.length < 0) return;

    let nextIndex = imageIndex.current + 1;

    const isEndReached = nextIndex > images.current.length - 1;

    if (isEndReached) {
      nextIndex = 0;

      setLoopCount((prevCount) => prevCount + 1);

      const popSound = `file://${envVars.PROJECT_ROOT}/assets/pop.mp3`;
      new Audio(popSound).play();
    }

    imageIndex.current = nextIndex;

    setCurrentImage(images.current[imageIndex.current]); // trigger re-render
  };

  const prevImage = (): void => {
    if (images.current.length < 0) return;

    let prevIndex = imageIndex.current - 1;

    if (prevIndex < 0) prevIndex = images.current.length - 1;

    imageIndex.current = prevIndex;

    setCurrentImage(images.current[imageIndex.current]); // trigger re-render
  };

  const deleteImage = async (): Promise<void> => {
    const imgToDelete = images.current[imageIndex.current];

    try {
      await ipcRenderer.invoke(channels.DELETE_FILE, imgToDelete);

      images.current = images.current.filter((image) => image !== imgToDelete);

      if (images.current.length > 0) {
        nextImage();
      } else {
        setIsDirEmpty(true);

        window.removeEventListener('keyup', handleKeyboardNav);
      }

      toast({
        description: 'Image deleted!',
        status: 'success',
        position: 'top',
        duration: TOAST_DURATION
      });
    } catch (error) {
      toast({
        description: error.toString(),
        status: 'error',
        position: 'top',
        duration: TOAST_DURATION
      });
    }
  };

  const extension = getFileExtension(currentImage);
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
        <Image
          src={`file://${currentImage}`}
          alt=""
          maxWidth="100%"
          maxHeight="100%"
          boxShadow="md"
        />

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
