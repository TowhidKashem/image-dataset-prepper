import { useState, useEffect, useContext, useCallback } from 'react';
import {
  Image,
  // useToast,
  Flex
} from '@chakra-ui/react';
import { AppContext, channels } from './_data';
// import { getPathInfo } from './_utils';

export function DirectoryContent() {
  // const toast = useToast();
  // export const TOAST_DURATION = 2_000;

  const {
    screen,
    // directoryPath,
    images
  } = useContext(AppContext);

  const [imageIndex, setImageIndex] = useState(0);
  const [loopCount, setLoopCount] = useState(0);

  // const directory = getPathInfo(directoryPath).dirName;

  useEffect(() => {
    window.electron.ipcRenderer.on(channels.DELETE_IMAGE, (response) => {
      deleteImage(response);
    });
  }, []);

  const nextImage = useCallback(() => {
    if (images.length < 0) return;
    let newIndex = imageIndex + 1;

    // end reached
    if (newIndex > images.length - 1) {
      new Audio('./pop.mp3').play();
      newIndex = 0;
      const newLoopCount = loopCount + 1;
      setLoopCount(newLoopCount);
    }

    setImageIndex(newIndex);
  }, [imageIndex, images, loopCount]);

  const prevImage = useCallback(() => {
    if (images.length < 0) return;
    let newIndex = imageIndex - 1;
    if (newIndex < 0) newIndex = images.length - 1;

    setImageIndex(newIndex);
  }, [imageIndex, images]);

  const deleteImage = useCallback((response: any) => {
    // if (response.error) {
    // if (imagesRef.current.length > 0) {
    //   window.electron.ipcRenderer.sendMessage(DELETE_IMAGE, {
    //     directory: directoryRef.current,
    //     filename: imagesRef.current[imageIndexRef.current]
    //   });
    // }
    //
    //   return toast({
    //     description: response.error.toString(),
    //     status: 'error',
    //     position: 'top',
    //     duration: TOAST_DURATION
    //   });
    // }
    // const newImages = imagesRef.current.filter(
    //   (image) => image !== imagesRef.current[imageIndexRef.current]
    // );
    // setImages(newImages);
    // imagesRef.current = newImages;
    // toast({
    //   description: 'Image deleted successfully',
    //   status: 'success',
    //   position: 'top',
    //   duration: TOAST_DURATION
    // });
    // if (newImages.length > 0) {
    //   nextImage();
    // } else {
    //   setImage('');
    //   setEmptyMessage(true);
    // }
  }, []);

  // const extension = images.length > 0 ? getExtension(images[imageIndex]) : null;
  // const extension = '';

  // const listItems = [
  //   // {
  //   //   key: 'count',
  //   //   show: images.length > 0,
  //   //   value: `${imageIndex + 1}/${images.length} images`
  //   // },
  //   // {
  //   //   key: 'loops',
  //   //   show: directory,
  //   //   value: `${loopCount} loops`
  //   // },
  //   // {
  //   //   key: 'extension',
  //   //   show: extension,
  //   //   value: extension
  //   // }
  // ];

  // keyboard navigation
  useEffect(() => {
    if (screen === 'directoryContent') {
      window.addEventListener('keyup', (e) => {
        switch (e.key) {
          case ' ':
            return deleteImage(null);
          case 'ArrowRight':
            return nextImage();
          case 'ArrowLeft':
            return prevImage();
        }
      });
    }
  }, [screen, images, nextImage, prevImage, deleteImage]);

  if (screen !== 'directoryContent') return null;

  const activeImage = images[imageIndex];

  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      padding="1rem"
      style={{ height: '100vh' }}
    >
      <Image src={`file://${activeImage}`} alt="" maxHeight="100vh" />

      {/*

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
      </InfoList> */}
    </Flex>
  );
}

// const ImageReviewer = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   min-height: 100vh;
// `;

// const EmptyMessage = styled.section`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   flex-direction: column;
// `;

// const EmptyHeader = styled(Heading)`
//   color: #ffffff;
//   text-align: center;
//   margin-bottom: 40px;
// `;

// const PreviewImage = styled(Image)`
//   box-shadow: 0px 5px 19px -4px #090b0f;
//   max-height: 100vh;
// `;

// const NoImageWrapper = styled.div`
//   display: flex;
//   align-items: center;
//   flex-direction: column;
// `;

// const NoImageIcon = styled.div`
//   position: relative;
//   margin-bottom: 10px;
// `;

// const WrongIcon = styled(Icon)`
//   position: absolute;
//   top: -10px;
//   left: -5px;
// `;

// const InfoList = styled.ul`
//   list-style-type: none;
//   position: fixed;
//   top: 15px;
//   right: 15px;

//   li {
//     text-align: right;
//   }
// `;
