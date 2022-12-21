import PubSub from 'pubsub-js';
import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, Flex } from '@chakra-ui/react';
import { useStateCallback } from 'hooks/useStateCallback';
import { ChooseDirectory } from './ChooseDirectory';
import { DirectoryList } from './DirectoryList';
import { DirectoryContent } from './DirectoryContent';
import {
  ScreenT,
  AppContext,
  GET_FOLDER_CONTENTS,
  GET_IMAGE,
  DELETE_IMAGE
} from './_data';
import 'global.scss';

function App() {
  const [screen, setScreen] = useState<ScreenT>('chooseDirectory');
  const [directoryPath, setDirectoryPath] = useState('');
  const [directories, setDirectories] = useStateCallback<string[]>([]);
  const [images, setImages] = useStateCallback<string[]>([]);

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
  }, []);

  return (
    <ChakraProvider>
      <AppContext.Provider
        value={{
          screen,
          setScreen,
          directoryPath,
          setDirectoryPath,
          directories,
          setDirectories,
          images,
          setImages
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
