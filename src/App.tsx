import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import UploadButton from './common/UploadButton/UploadButton';
import './App.scss';

function App() {
  const toast = useToast();

  const [directory, setDirectory] = useState<string>(null);
  const [images, setImages] = useState<string[]>([]);
  const [image, setImage] = useState<string>(null);
  const [imageIndex, setImageIndex] = useState(0);

  const getImage = (image) => {
    console.warn('fetch image', image);

    window.electron.ipcRenderer.sendMessage('get_image', {
      filename: images[imageIndex],
      directory
    } as any);
  };

  const nextImage = () => {
    console.log('nextImage()', imageIndex);

    let newIndex = imageIndex + 1;
    if (newIndex > images.length - 1) {
      console.warn('reset back to begining');
      newIndex = 0;
    }

    getImage(newIndex);
  };

  const prevImage = () => {
    let newIndex = imageIndex - 1;
    if (newIndex < 0) newIndex = images.length - 1;

    getImage(newIndex);
  };

  const deleteImage = () => {
    window.electron.ipcRenderer.sendMessage('delete_image', {
      filename: images[imageIndex],
      directory
    } as any);
  };

  const chooseFolder = (e) => {
    console.warn('choose folder');

    const { path } = e.currentTarget.files[0];
    const segments = path.split('/');
    segments.pop();
    const directory = segments.join('/');

    setDirectory(directory);
    getImageList(directory);
  };

  const getImageList = (directory) => {
    window.electron.ipcRenderer.sendMessage('get_all_images', {
      directory
    } as any);

    window.electron.ipcRenderer.once('get_all_images', (images) => {
      setImages(images as string[]);

      // get the first image
      getImage(images[imageIndex]);
      setImageIndex(imageIndex + 1);
    });
  };

  // useEffect(() => {
  //   if (images.length > 0) {
  //     getImage(imageIndex);
  //   }
  // }, [images]);

  useEffect(() => {
    // keyboard navigation
    window.addEventListener('keyup', (event) => {
      if (event.key === ' ') {
        deleteImage();
      } else if (event.key === 'ArrowRight') {
        nextImage();
      } else if (event.key === 'ArrowLeft') {
        prevImage();
      }
    });

    // get single image
    window.electron.ipcRenderer.on('get_image', (base64) => {
      alert('image got');
      setImage(base64 as string);
    });

    // delete image
    window.electron.ipcRenderer.on(
      'delete_image',
      ({ success, error }: any) => {
        if (success) {
          const newImages = [...images].filter(
            (image) => image !== images[imageIndex]
          );

          setImages(newImages);

          toast({
            title: 'Deleted!',
            description: 'Image deleted successfully',
            status: 'success',
            duration: 800,
            isClosable: true
          });
        } else {
          // eslint-disable-next-line no-alert
          alert(error as string);
        }
      }
    );
  }, []);

  const extension =
    images.length > 0 ? images[imageIndex].split('.').pop() : null;

  return (
    <ChakraProvider>
      <div className="app">
        <h1 style={{ color: '#fff', fontWeight: 'bold', fontSize: 22 }}>
          {imageIndex}
        </h1>

        {directory ? (
          <div className="preview">
            {image && (
              <img src={`data:image/${extension};base64,${image}`} alt="" />
            )}
          </div>
        ) : (
          <UploadButton />
        )}
      </div>
    </ChakraProvider>
  );
}

export default App;
