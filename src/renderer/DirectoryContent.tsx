import { useState, useEffect, useContext } from 'react';
import {
  useToast,
  Image,
  Icon,
  Flex,
  Heading,
  Text,
  Badge
} from '@chakra-ui/react';
import { FcOpenedFolder } from 'react-icons/fc';
import { Navigation } from './Navigation';
import { AppContext, channels } from './_data';
import { getFileExtension } from './_utils';
// @ts-ignore
// import popSound from '../../assets/pop.mp3';

const { ipcRenderer } = window.electron;

const TOAST_DURATION = 2_000;

export function DirectoryContent() {
  const toast = useToast();

  const { images, setImages } = useContext(AppContext);

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

        // new Audio(popSound).play();
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
    if (totalImages === 0) return;

    try {
      await ipcRenderer.invoke(channels.DELETE_IMAGE, activeImage);

      const newImages = images.filter((image) => image !== activeImage);

      setImages(newImages, () => {
        if (totalImages > 0) {
          nextImage();
        } else {
          setIsDirEmpty(true);
        }
      });

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

  const activeImage = images[imageIndex];
  const extension = getFileExtension(activeImage);
  const totalImages = images.length;
  const imageDetails = [
    {
      key: 'count',
      isVisible: totalImages > 0,
      value: `${imageIndex + 1}/${totalImages} images`
    },
    {
      key: 'loops',
      isVisible: true,
      value: `${loopCount} loops`
    },
    {
      key: 'extension',
      isVisible: extension,
      value: extension
    }
  ];

  return (
    <>
      <Navigation backPath="/directoryList" />

      <Flex
        alignItems="center"
        justifyContent="center"
        padding="1rem"
        height="100vh"
      >
        <Image src={`file://${activeImage}`} alt="" maxHeight="100vh" />

        {isDirEmpty && (
          <div>
            <Heading as="h2" size="xl" className="msg">
              All images deleted in this folder
            </Heading>

            <Icon boxSize="4.5rem" as={FcOpenedFolder} />
          </div>
        )}

        <ul>
          {imageDetails.map(({ key, isVisible, value }) =>
            isVisible ? (
              <li key={key}>
                <Badge>
                  <Text fontSize="md" paddingX="2.5" paddingY="0.5">
                    {value}
                  </Text>
                </Badge>
              </li>
            ) : null
          )}
        </ul>
      </Flex>
    </>
  );
}
