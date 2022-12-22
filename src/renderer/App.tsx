import { useEffect, useState } from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import {
  ChakraProvider,
  ThemeProvider,
  theme,
  useColorMode,
  Flex
} from '@chakra-ui/react';
import { useStateCallback } from './hooks/useStateCallback';
import { ChooseDirectory } from './ChooseDirectory';
import { DirectoryList } from './DirectoryList';
import { DirectoryContent } from './DirectoryContent';
import { ScreenT } from './_types';
import { AppContext, topics } from './_data';

export function App() {
  const { colorMode, toggleColorMode } = useColorMode();

  const [screen, setScreen] = useState<ScreenT>('chooseDirectory');
  const [directoryPath, setDirectoryPath] = useState('');
  const [directories, setDirectories] = useStateCallback<string[]>([]);
  const [images, setImages] = useStateCallback<string[]>([]);

  useEffect(() => {
    const { GET_SUB_FOLDERS } = topics;

    // calling IPC exposed from preload script
    // window.electron.ipcRenderer.on('ipc-example', (arg) => {
    //   alert(arg);
    //   console.log(arg);
    // });

    // window.electrons.ipcRenderer.sendMessage('ipc-example', ['ping']);

    // window.electron.ipcRenderer.on(GET_SUB_FOLDERS, ({ contents }) => {
    //   alert('GET_SUB_FOLDERS - xoxo');
    //   // console.log('GET_SUB_FOLDERS:', contents);
    //   // setDirectories(contents, () => setScreen('directoryList'));
    // });
  });

  return (
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
      <ChakraProvider>
        <ThemeProvider theme={theme}>
          <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            padding="2rem"
            minHeight="100vh"
          >
            <MemoryRouter>
              <Routes>
                <Route path="/" element={<ChooseDirectory />} />
                <Route path="/dir" element={<DirectoryList />} />
                <Route path="/dir/content" element={<DirectoryContent />} />
              </Routes>
            </MemoryRouter>
          </Flex>
        </ThemeProvider>
      </ChakraProvider>
    </AppContext.Provider>
  );
}
