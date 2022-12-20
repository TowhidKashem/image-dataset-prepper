import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, useToast } from '@chakra-ui/react';
import { ChooseDirectory } from './ChooseDirectory';
import { DirectoryList } from './DirectoryList';
import { DirectoryContent } from './DirectoryContent';
import {
  AppContext,
  GET_FOLDER_CONTENTS,
  GET_IMAGE,
  DELETE_IMAGE,
  TOAST_DURATION
} from './_data';
import 'global.scss';

function App() {
  const toast = useToast();

  const [directories, setDirectories] = useState<string[]>([]);
  const [directory, setDirectory] = useState('');

  const [images, setImages] = useState<string[]>([]);
  const [image, setImage] = useState('');

  const [emptyMessage, setEmptyMessage] = useState(false);

  const directoriesRef = useRef<string[]>([]);
  const directoryRef = useRef('');
  const imagesRef = useRef<string[]>([]);
  const imageIndexRef = useRef(0);

  useEffect(() => {
    window.electron.ipcRenderer.once(GET_FOLDER_CONTENTS, getFolderContents);
    window.electron.ipcRenderer.on(GET_IMAGE, (base64) => setImage(base64));
    window.electron.ipcRenderer.on(DELETE_IMAGE, deleteImage);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getFolderContents = ({ contents, args }) => {
    if (args.root) {
      setDirectories(contents);
      directoriesRef.current = contents;
    } else {
      setImages(contents);
      imagesRef.current = contents;
      getImage(); // get the first image
    }
  };

  const deleteImage = (response) => {
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
  };

  const getComponent = (): React.ReactNode => {
    if (directories.length) return <DirectoryList />;
    if (directory) return <DirectoryContent />;
    return <ChooseDirectory />;
  };

  return (
    <AppContext.Provider
      value={{
        directories,
        directory
      }}
    >
      {getComponent()}
    </AppContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ChakraProvider>
    <App />
  </ChakraProvider>
);
