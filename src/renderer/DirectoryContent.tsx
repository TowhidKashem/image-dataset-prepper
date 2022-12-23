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
import { FcOpenedFolder, FcImageFile, FcCancel } from 'react-icons/fc';
import { Navigation } from './Navigation';
import { AppContext, channels } from './_data';
import { getFileExtension, getDirName, isImage, logger } from './_utils';

const { ipcRenderer } = window.electron;

const TOAST_DURATION = 2_000;

export function DirectoryContent() {
  const toast = useToast();

  const { directoryPath, images, setImages } = useContext(AppContext);

  const [imageIndex, setImageIndex] = useState(0);
  const [loopCount, setLoopCount] = useState(0);

  const [isDirEmpty, setIsDirEmpty] = useState(false);

  // image info
  const activeImage = images[imageIndex];
  const extension = getFileExtension(activeImage);

  useEffect(() => {
    ipcRenderer.on(channels.DELETE_IMAGE, (response) => deleteImage(response));
    window.addEventListener('keyup', handleKeyboardNavigation);

    return () => {
      ipcRenderer.removeAllListeners(channels.DELETE_IMAGE);
      window.removeEventListener('keyup', handleKeyboardNavigation);
    };
  }, []);

  const handleKeyboardNavigation = (e: KeyboardEvent): void => {
    switch (e.key) {
      case ' ':
        return deleteImage(null);
      case 'ArrowRight':
        return nextImage();
      case 'ArrowLeft':
        return prevImage();
      default:
        return null;
    }
  };

  const nextImage = (): void => {
    if (images.length < 0) return;
    let newIndex = imageIndex + 1;
    // end reached
    if (newIndex > images.length - 1) {
      new Audio('../../assets/pop.mp3').play();
      newIndex = 0;
      const newLoopCount = loopCount + 1;
      setLoopCount(newLoopCount);
    }
    setImageIndex(newIndex);
  };

  const prevImage = (): void => {
    if (images.length < 0) return;
    let newIndex = imageIndex - 1;
    if (newIndex < 0) newIndex = images.length - 1;
    setImageIndex(newIndex);
  };

  const handleBackClick = (): void => {
    const directory = directoryPath.split('/').slice(0, -1).join('/');

    logger('pub', channels.GET_SUB_FOLDERS, { directory });

    ipcRenderer.sendMessage(channels.GET_SUB_FOLDERS, {
      directory
    });
  };

  const deleteImage = ({ error }: { error: boolean }): void => {
    if (error) {
      if (images.length > 0) {
        ipcRenderer.sendMessage(channels.DELETE_IMAGE, {
          directory: directoryPath,
          filename: activeImage
        });
      }

      toast({
        description: error.toString(),
        status: 'error',
        position: 'top',
        duration: TOAST_DURATION
      });

      return;
    }

    const newImages = images.filter((image) => image !== images[imageIndex]);

    setImages(newImages);

    toast({
      description: 'Image deleted successfully',
      status: 'success',
      position: 'top',
      duration: TOAST_DURATION
    });

    if (newImages.length > 0) {
      nextImage();
    } else {
      setImages(null);
      setIsDirEmpty(true);
    }
  };

  const listItems = [
    {
      key: 'count',
      show: images.length > 0,
      value: `${imageIndex + 1}/${images.length} images`
    },
    {
      key: 'loops',
      show: getDirName(directoryPath),
      value: `${loopCount} loops`
    },
    {
      key: 'extension',
      show: extension,
      value: extension
    }
  ];

  return (
    <>
      <Navigation backPath="/dir" onBackClick={handleBackClick} />

      <Flex
        alignItems="center"
        justifyContent="center"
        padding="1rem"
        style={{ height: '100vh' }}
      >
        <Image src={`file://${activeImage}`} alt="" maxHeight="100vh" />

        {extension && !isImage(extension) && (
          <div>
            <Icon as={FcCancel} fontSize="2.5rem" />

            <Icon as={FcImageFile} fontSize="4.5rem" />

            <Heading as="h4" size="lg" className="msg">
              .{extension}
            </Heading>
          </div>
        )}

        {isDirEmpty && (
          <div>
            <Heading as="h2" size="xl" className="msg">
              All images deleted in this folder
            </Heading>

            <Icon boxSize="4.5rem" as={FcOpenedFolder} />
          </div>
        )}

        <ul>
          {listItems.map(
            ({ key, show, value }) =>
              show && (
                <li key={key}>
                  <Badge>
                    <Text fontSize="md" paddingX="2.5" paddingY="0.5">
                      {value}
                    </Text>
                  </Badge>
                </li>
              )
          )}
        </ul>
      </Flex>
    </>
  );
}
