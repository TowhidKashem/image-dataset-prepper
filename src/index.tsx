import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, Flex } from '@chakra-ui/react';
import { useStateCallback } from 'hooks/useStateCallback';
import { ChooseDirectory } from './ChooseDirectory';
import { DirectoryList } from './DirectoryList';
import { DirectoryContent } from './DirectoryContent';
import { ScreenT, AppContext, topics } from './_data';
import 'global.scss';

function App() {
  const [screen, setScreen] = useState<ScreenT>('chooseDirectory');
  const [directoryPath, setDirectoryPath] = useState('');
  const [directories, setDirectories] = useStateCallback<string[]>([]);
  const [images, setImages] = useStateCallback<string[]>([]);

  useEffect(() => {
    const { GET_SUB_FOLDERS } = topics;

    window.electron.ipcRenderer.on(GET_SUB_FOLDERS, ({ contents }) => {
      alert('GET_SUB_FOLDERS - xoxo');
      // console.log('GET_SUB_FOLDERS:', contents);
      // setDirectories(contents, () => setScreen('directoryList'));
    });

    return () => {
      window.electron.ipcRenderer.removeAllListeners(GET_SUB_FOLDERS);
    };
  });

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
