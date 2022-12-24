import { useState, useEffect, useContext } from 'react';
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

  const { envVars, images, setImages } = useContext(AppContext);

  const [imageIndex, setImageIndex] = useState(0);
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
    if (totalImages < 0) return;

    setImageIndex((curImgIndex) => {
      let nextIndex = curImgIndex + 1;

      const isEndReached = nextIndex > totalImages - 1;

      if (isEndReached) {
        nextIndex = 0;

        setLoopCount((prevCount) => prevCount + 1);

        const popSound = `file://${envVars.PROJECT_ROOT}/assets/pop.mp3`;
        new Audio(popSound).play();
      }

      return nextIndex;
    });
  };

  const prevImage = (): void => {
    if (totalImages < 0) return;

    setImageIndex((curImgIndex) => {
      let prevIndex = curImgIndex - 1;

      if (prevIndex < 0) prevIndex = totalImages - 1;

      return prevIndex;
    });
  };

  const deleteImage = async (): Promise<void> => {
    // wrap everything in this set state to get the updated value of `imageIndex`
    // otherwise the stale value remains cached within event listeners
    // we return the same value at the end to avoid updating the state
    setImageIndex((imageIndex) => {
      const deleteImgPath = images[imageIndex];

      try {
        (async () => {
          await ipcRenderer.invoke(channels.DELETE_FILE, deleteImgPath);

          const newImages = images.filter((image) => image !== deleteImgPath);

          setImages(newImages, () => {
            if (newImages.length > 0) {
              nextImage();
            } else {
              setIsDirEmpty(true);

              window.removeEventListener('keyup', handleKeyboardNav);
            }
          });

          toast({
            description: 'Image deleted!',
            status: 'success',
            position: 'top',
            duration: TOAST_DURATION
          });
        })();
      } catch (error) {
        toast({
          description: error.toString(),
          status: 'error',
          position: 'top',
          duration: TOAST_DURATION
        });
      }

      return imageIndex;
    });
  };

  const activeImage = images[imageIndex];
  const extension = getFileExtension(activeImage);
  const totalImages = images.length;
  const imageDetails = [
    {
      key: 'count',
      isVisible: totalImages > 0,
      icon: FaHashtag,
      value: `${imageIndex + 1} / ${totalImages} images`
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
          src={`file://${activeImage}`}
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
