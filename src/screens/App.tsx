import React, { useState, useEffect, useRef } from 'react';
import { useToast, Heading, Image, Icon } from '@chakra-ui/react';
import { FcOpenedFolder, FcCancel, FcImageFile } from 'react-icons/fc';
import styled from '@emotion/styled';
import UploadButton from 'common/UploadButton';

const GET_ALL_IMAGES = 'GET_ALL_IMAGES';
const GET_IMAGE = 'GET_IMAGE';
const DELETE_IMAGE = 'DELETE_IMAGE';

function App() {
  const toast = useToast();

  const [image, setImage] = useState('');
  const [emptyMessage, setEmptyMessage] = useState(false);

  const [directory, setDirectory] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [imageIndex, setImageIndex] = useState(0);

  const directoryRef = useRef('');
  const imagesRef = useRef<string[]>([]);
  const imageIndexRef = useRef(0);

  const isLoopComplete = useRef(false);

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

    window.electron.ipcRenderer.once(GET_ALL_IMAGES, (images) => {
      setImages(images);
      imagesRef.current = images;
      getImage(); // get the first image
    });

    window.electron.ipcRenderer.on(GET_IMAGE, (base64) => setImage(base64));

    window.electron.ipcRenderer.on(DELETE_IMAGE, (response) => {
      if (response.error) {
        return toast({
          description: response.error,
          status: 'error',
          position: 'top',
          duration: 2000
        });
      }

      const newImages = [...imagesRef.current].filter(
        (image) => image !== imagesRef.current[imageIndexRef.current]
      );

      setImages(newImages);
      imagesRef.current = newImages;

      toast({
        description: 'Image deleted successfully',
        status: 'success',
        position: 'top',
        duration: 2000
      });

      if (newImages.length > 0) {
        nextImage();
      } else {
        setImage('');
        setEmptyMessage(true);
      }
    });

    // eslint-disable-next-line
  }, []);

  const chooseFolder = (e: React.SyntheticEvent<HTMLInputElement>) => {
    if (!e.currentTarget.files) return;

    const { path } = e.currentTarget.files[0] as FileWithPath;
    const segments = path.split('/');
    segments.pop();
    const directory = segments.join('/');

    setDirectory(directory);
    directoryRef.current = directory;

    window.electron.ipcRenderer.sendMessage(GET_ALL_IMAGES, { directory });
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
        newIndex = 0;

        if (!isLoopComplete.current) {
          isLoopComplete.current = true;

          toast({
            description: 'All images in folder seen',
            status: 'info',
            position: 'top',
            duration: null
          });
        }
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

  return (
    <ImageReviewer>
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
        <UploadButton label="Choose Folder" onChange={chooseFolder} />
      )}
    </ImageReviewer>
  );
}

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

export default App;
