import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, useToast } from '@chakra-ui/react';
import { FcImageFile } from 'react-icons/fc';
import { UploadButton } from 'common/UploadButton';
import { DirectoryList } from './DirectoryList';
import { DirectoryContent } from './DirectoryContent';
import 'global.scss';

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

  const [emptyMessage, setEmptyMessage] = useState(false);

  const directoriesRef = useRef<string[]>([]);
  const directoryRef = useRef('');
  const imagesRef = useRef<string[]>([]);
  const imageIndexRef = useRef(0);

  useEffect(() => {
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

  const chooseFolder = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    if (!e.currentTarget.files) return;

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

  if (directories.length) {
    return <DirectoryList directories={directories} directory={directory} />;
  }

  if (directory) {
    return <DirectoryContent />;
  }

  return <UploadButton label="Choose Root Folder" onChange={chooseFolder} />;
}

ReactDOM.createRoot(document.getElementById('root') as HTMLDivElement).render(
  <ChakraProvider>
    <App />
  </ChakraProvider>
);
