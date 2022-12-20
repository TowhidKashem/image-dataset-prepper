import React, { useState, useEffect, useRef } from 'react';
import {
  useToast,
  SimpleGrid,
  Box,
  Flex,
  Container,
  Center,
  Heading,
  Image,
  Icon,
  Badge,
  Text
} from '@chakra-ui/react';
import {
  FcFolder,
  FcOpenedFolder,
  FcCancel,
  FcImageFile
} from 'react-icons/fc';
import styled from '@emotion/styled';
import { UploadButton } from 'common/UploadButton';
import { BreadCrumbs } from 'common/BreadCrumbs';

const GET_FOLDER_CONTENTS = 'GET_FOLDER_CONTENTS';
const GET_IMAGE = 'GET_IMAGE';
const DELETE_IMAGE = 'DELETE_IMAGE';

const TOAST_DURATION = 2_000;

function App() {
  const toast = useToast();

  const [directories, setDirectories] = useState<string[]>([]);
  const [directory, setDirectory] = useState('');

  const [images, setImages] = useState<string[]>([]);
  const [image, setImage] = useState('');
  const [imageIndex, setImageIndex] = useState(0);

  const [loopCount, setLoopCount] = useState(0);
  const [emptyMessage, setEmptyMessage] = useState(false);

  const directoriesRef = useRef<string[]>([]);
  const directoryRef = useRef('');
  const imagesRef = useRef<string[]>([]);
  const imageIndexRef = useRef(0);
  const loopCountRef = useRef(0);

  useEffect(() => {
    // keyboard navigation
    window.addEventListener('keyup', (e) => {
      if (e.key === ' ') {
        deleteImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      }
    });

    window.electron.ipcRenderer.once(
      GET_FOLDER_CONTENTS,
      ({ contents, args }) => {
        if (args.root) {
          setDirectories(contents);
          directoriesRef.current = contents;
        } else {
          setImages(contents);
          imagesRef.current = contents;
          getImage(); // get the first image
        }
      }
    );

    window.electron.ipcRenderer.on(GET_IMAGE, (base64) => setImage(base64));

    window.electron.ipcRenderer.on(DELETE_IMAGE, (response) => {
      if (response.error) {
        return toast({
          description: response.error.toString(),
          status: 'error',
          position: 'top',
          duration: TOAST_DURATION
        });
      }

      const newImages = imagesRef.current.filter(
        (image) => image !== imagesRef.current[imageIndexRef.current]
      );

      setImages(newImages);
      imagesRef.current = newImages;

      toast({
        description: 'Image deleted successfully',
        status: 'success',
        position: 'top',
        duration: TOAST_DURATION
      });

      if (newImages.length > 0) {
        nextImage();
      } else {
        setImage('');
        setEmptyMessage(true);
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const chooseFolder = (e: React.SyntheticEvent<HTMLInputElement>) => {
    if (!e.currentTarget.files) return;

    console.log('mma', e.currentTarget.files[0]);

    const { path } = e.currentTarget.files[0] as FileWithPath;
    const segments = path.split('/');
    segments.pop();
    segments.pop();
    const rootDirectory = segments.join('/');

    setDirectory(rootDirectory);
    directoryRef.current = rootDirectory;

    window.electron.ipcRenderer.sendMessage(GET_FOLDER_CONTENTS, {
      directory: rootDirectory,
      root: true
    });
  };

  const getImage = () => {
    const imageFile = imagesRef.current[imageIndexRef.current];
    const extension = getExtension(imageFile) || '';

    if (!isImage(extension)) return setImage('');

    window.electron.ipcRenderer.sendMessage(GET_IMAGE, {
      directory: directoryRef.current,
      filename: imageFile
    });
  };

  const navigate = (callback: () => number) => {
    if (imagesRef.current.length > 0) {
      const newIndex = callback();

      setImageIndex(newIndex);
      imageIndexRef.current = newIndex;
      getImage();
    }
  };

  const nextImage = () => {
    navigate(() => {
      let newIndex = imageIndexRef.current + 1;
      // end reached
      if (newIndex > imagesRef.current.length - 1) {
        new Audio('./pop.mp3').play();

        newIndex = 0;

        const newLoopCount = loopCountRef.current + 1;

        setLoopCount(newLoopCount);
        loopCountRef.current = newLoopCount;
      }
      return newIndex;
    });
  };

  const prevImage = () => {
    navigate(() => {
      let newIndex = imageIndexRef.current - 1;
      if (newIndex < 0) newIndex = imagesRef.current.length - 1;
      return newIndex;
    });
  };

  const deleteImage = () => {
    if (imagesRef.current.length > 0) {
      window.electron.ipcRenderer.sendMessage(DELETE_IMAGE, {
        directory: directoryRef.current,
        filename: imagesRef.current[imageIndexRef.current]
      });
    }
  };

  const isImage = (extension: string): boolean =>
    ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(extension);

  const getExtension = (fileName: string): string | undefined =>
    fileName.split('.').pop();

  const extension = images.length > 0 ? getExtension(images[imageIndex]) : null;

  const listItems = [
    {
      key: 'count',
      show: images.length > 0,
      value: `${imageIndex + 1}/${images.length} images`
    },
    {
      key: 'loops',
      show: directory,
      value: `${loopCount} loops`
    },
    {
      key: 'extension',
      show: extension,
      value: extension
    }
  ];

  // let dirName = directory.split('/');
  // dirName = dirName.pop();

  if (directories.length) {
    return (
      <Flex
        flexDirection="column"
        padding="2rem"
        style={{ minHeight: '100vh' }}
      >
        <BreadCrumbs path={directory} />

        <SimpleGrid columns={{ sm: 2, md: 10 }} spacing={2}>
          {directories.map((directory) => (
            <Flex
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              padding={3}
              _hover={{
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: 5,
                cursor: 'pointer'
              }}
            >
              <Icon boxSize="4rem" marginBottom={1} as={FcOpenedFolder} />

              <Heading as="h6" size="xs">
                {directory}
              </Heading>
            </Flex>
          ))}
        </SimpleGrid>
      </Flex>
    );
  }

  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      padding="1rem"
      style={{ height: '100vh', border: '10px solid red' }}
    >
      {directory ? (
        <>
          {image && (
            <PreviewImage
              src={`data:image/${extension};base64,${image}`}
              alt=""
            />
          )}

          {extension && !isImage(extension) && (
            <NoImageWrapper>
              <NoImageIcon>
                <WrongIcon boxSize="2.5rem" as={FcCancel} />
                <Icon boxSize="4.5rem" as={FcImageFile} />
              </NoImageIcon>

              <Heading as="h4" size="lg" className="msg">
                .{extension}
              </Heading>
            </NoImageWrapper>
          )}

          {emptyMessage && (
            <EmptyMessage>
              <EmptyHeader as="h2" size="xl" className="msg">
                All images deleted in this folder
              </EmptyHeader>

              <Icon boxSize="4.5rem" as={FcOpenedFolder} />
            </EmptyMessage>
          )}
        </>
      ) : (
        <UploadButton label="Choose Root Folder" onChange={chooseFolder} />
      )}

      <InfoList>
        {listItems.map(({ key, show, value }) =>
          show ? (
            <li key={key}>
              <Badge>
                <Text fontSize="md" px="2.5" py="0.5">
                  {value}
                </Text>
              </Badge>
            </li>
          ) : null
        )}
      </InfoList>
    </Flex>
  );
}

// const App = styled.div`
//   border: 2px solid blue;
// `;

const Folders = styled.div`
  display: flex;
  flex-direction: column;
  /* display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh; */
  border: 2px solid blue;
`;

////////

const ImageReviewer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`;

const EmptyMessage = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const EmptyHeader = styled(Heading)`
  color: #ffffff;
  text-align: center;
  margin-bottom: 40px;
`;

const PreviewImage = styled(Image)`
  box-shadow: 0px 5px 19px -4px #090b0f;
  max-height: 100vh;
`;

const NoImageWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const NoImageIcon = styled.div`
  position: relative;
  margin-bottom: 10px;
`;

const WrongIcon = styled(Icon)`
  position: absolute;
  top: -10px;
  left: -5px;
`;

const InfoList = styled.ul`
  list-style-type: none;
  position: fixed;
  top: 15px;
  right: 15px;

  li {
    text-align: right;
  }
`;

export default App;
