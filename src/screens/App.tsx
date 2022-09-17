import PubSub from 'pubsub-js';
import { useState, useEffect, useRef } from 'react';
import { useToast, Heading, Image } from '@chakra-ui/react';
import UploadButton from 'common/UploadButton';
import './App.scss';

const GET_ALL_IMAGES = 'GET_ALL_IMAGES';
const GET_IMAGE = 'GET_IMAGE';
const DELETE_IMAGE = 'DELETE_IMAGE';

window.electron.ipcRenderer.once(GET_ALL_IMAGES, (images) => {
  PubSub.publish(GET_ALL_IMAGES, images);
});

window.electron.ipcRenderer.on(GET_IMAGE, (base64) => {
  PubSub.publish(GET_IMAGE, base64);
});

window.electron.ipcRenderer.on(DELETE_IMAGE, (response) => {
  PubSub.publish(DELETE_IMAGE, response);
});

function App() {
  const toast = useToast();

  const [image, setImage] = useState('');
  const [emptyMessage, setEmptyMessage] = useState(false);

  const [directory, setDirectory] = useState('');
  const [images, setImages] = useState([]);
  const [imageIndex, setImageIndex] = useState(0);

  const directoryRef = useRef('');
  const imagesRef = useRef([]);
  const imageIndexRef = useRef(0);

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

    PubSub.subscribe(GET_ALL_IMAGES, async (_, payload) => {
      setImages(payload);
      imagesRef.current = payload;

      getImage(); // get the first image
    });

    PubSub.subscribe(GET_IMAGE, (_, payload) => {
      setImage(payload);
    });

    PubSub.subscribe(DELETE_IMAGE, (_, payload) => {
      if (payload.success) {
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
          resetAll();
          setEmptyMessage(true);
        }
      } else {
        alert(payload.error);
      }
    });

    // eslint-disable-next-line
  }, []);

  const resetAll = () => {
    setImage('');

    setImages([]);
    setImageIndex(0);
    setDirectory('');

    imagesRef.current = [];
    imageIndexRef.current = 0;
    directoryRef.current = '';
  };

  const chooseFolder = (e) => {
    const { path } = e.currentTarget.files[0];
    const segments = path.split('/');
    segments.pop();
    const directory = segments.join('/');

    setEmptyMessage(false);

    setDirectory(directory);
    directoryRef.current = directory;

    window.electron.ipcRenderer.sendMessage(GET_ALL_IMAGES, { directory });
  };

  const getImage = () => {
    const imageFile = imagesRef.current[imageIndexRef.current];

    if (imageFile) {
      window.electron.ipcRenderer.sendMessage(GET_IMAGE, {
        directory: directoryRef.current,
        filename: imageFile
      });
    }

    console.warn(GET_IMAGE, {
      imageIndex: imageIndexRef.current,
      imageFile
    });
  };

  const nextImage = () => {
    let newIndex = imageIndexRef.current + 1;
    if (newIndex > imagesRef.current.length - 1) newIndex = 0;

    setImageIndex(newIndex);
    imageIndexRef.current = newIndex;
    getImage();
  };

  const prevImage = () => {
    let newIndex = imageIndexRef.current - 1;
    if (newIndex < 0) newIndex = imagesRef.current.length - 1;

    setImageIndex(newIndex);
    imageIndexRef.current = newIndex;
    getImage();
  };

  const deleteImage = () => {
    window.electron.ipcRenderer.sendMessage(DELETE_IMAGE, {
      directory: directoryRef.current,
      filename: imagesRef.current[imageIndexRef.current]
    });
  };

  const extension =
    images.length > 0 ? images[imageIndex].split('.').pop() : null;

  const showUploadButton = !directory || emptyMessage;

  return (
    <div className="app">
      {emptyMessage && (
        <Heading as="h2" size="2xl" className="empty">
          All images deleted in this folder
        </Heading>
      )}

      {directory && (
        <div className="preview">
          {image && (
            <Image src={`data:image/${extension};base64,${image}`} alt="" />
          )}
        </div>
      )}

      {showUploadButton && <UploadButton onChange={chooseFolder} />}
    </div>
  );
}

export default App;
