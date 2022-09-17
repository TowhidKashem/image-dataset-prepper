import PubSub from 'pubsub-js';
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@chakra-ui/react';
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

  const [directory, setDirectory] = useState<string>(null);
  const directoryRef = useRef<string>(null);

  const [images, setImages] = useState<string[]>([]);
  const imagesRef = useRef<string[]>([]);

  const [imageIndex, setImageIndex] = useState(0);
  const imageIndexRef = useRef(0);

  const [image, setImage] = useState<string>(null);

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

    PubSub.subscribe(GET_ALL_IMAGES, async (topic, payload) => {
      // console.warn('sub:', topic, payload);

      setImages(payload);
      imagesRef.current = payload;

      // setImageIndex(1);
      // imageIndexRef.current = 1;

      getImage(); // get the first image
    });

    PubSub.subscribe(GET_IMAGE, (topic, payload) => {
      // console.warn('sub:', topic, payload);

      setImage(payload);
    });

    PubSub.subscribe(DELETE_IMAGE, (topic, payload) => {
      // console.warn('sub:', topic, payload);

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
      } else {
        alert(payload.error);
      }
    });
  }, []);

  const chooseFolder = (e) => {
    const { path } = e.currentTarget.files[0];
    const segments = path.split('/');
    segments.pop();
    const directory = segments.join('/');

    setDirectory(directory);
    directoryRef.current = directory;

    window.electron.ipcRenderer.sendMessage(GET_ALL_IMAGES, { directory });
  };

  const getImage = () => {
    const imageFile = imagesRef.current[imageIndexRef.current];

    console.warn(GET_IMAGE, {
      imageIndex: imageIndexRef.current,
      imageFile
    });

    if (imageFile) {
      window.electron.ipcRenderer.sendMessage(GET_IMAGE, {
        directory: directoryRef.current,
        filename: imageFile
      });
    }
  };

  const nextImage = () => {
    let newIndex = imageIndexRef.current + 1;
    if (newIndex > imagesRef.current.length - 1) {
      // console.warn('reset back to begining');
      newIndex = 0;
    }

    imageIndexRef.current = newIndex;
    getImage();
  };

  const prevImage = () => {
    let newIndex = imageIndexRef.current - 1;
    if (newIndex < 0) {
      // console.warn('reset back to end');
      newIndex = imagesRef.current.length - 1;
    }

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

  return (
    <div className="app">
      {directory ? (
        <div className="preview">
          {image && (
            <img src={`data:image/${extension};base64,${image}`} alt="" />
          )}
        </div>
      ) : (
        <UploadButton onChange={chooseFolder} />
      )}
    </div>
  );
}

export default App;
