import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import PubSub from 'pubsub-js';
import { ChakraProvider, Flex } from '@chakra-ui/react';
import { ChooseDirectory } from './ChooseDirectory';
import { DirectoryList } from './DirectoryList';
import { DirectoryContent } from './DirectoryContent';
import { useStateCallback } from './hooks/useStateCallback';
import {
  ScreenT,
  AppContext,
  GET_FOLDER_CONTENTS,
  GET_IMAGE,
  DELETE_IMAGE
} from './_data';
import 'global.scss';

// useEffect(() => {
//   PubSub.subscribe(GET_IMAGE, (_, payload) => {
//     console.warn('mma', payload);
//   });
// }, []);

// PubSub.subscribe('MY TOPIC', mySubscriber);

function App() {
  const [screen, setScreen] = useState<ScreenT>('chooseDirectory');
  const [directories, setDirectories] = useStateCallback<string[]>([]);
  const [directory, setDirectory] = useState('');

  // const [images, setImages] = useState<string[]>([]);
  // const [image, setImage] = useState('');

  // const [emptyMessage, setEmptyMessage] = useState(false);

  // const directoriesRef = useRef<string[]>([]);
  // const imagesRef = useRef<string[]>([]);
  // const imageIndexRef = useRef(0);

  useEffect(() => {
    window.electron.ipcRenderer.once(GET_FOLDER_CONTENTS, (response) =>
      PubSub.publish(GET_FOLDER_CONTENTS, response)
    );
    window.electron.ipcRenderer.on(GET_IMAGE, (response) =>
      PubSub.publish(GET_IMAGE, response)
    );
    window.electron.ipcRenderer.on(DELETE_IMAGE, (response) =>
      PubSub.publish(DELETE_IMAGE, response)
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // const getComponent = (): React.ReactNode => {
  //   if (directories.length) return
  //   if (directory) return ;
  //   return ;
  // };

  return (
    <ChakraProvider>
      <AppContext.Provider
        value={{
          screen,
          setScreen,
          directory,
          setDirectory,
          directories,
          setDirectories
        }}
      >
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          padding="2rem"
          minHeight="100vh"
        >
          <ChooseDirectory />
          <DirectoryList />
          <DirectoryContent />
        </Flex>
      </AppContext.Provider>
    </ChakraProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
