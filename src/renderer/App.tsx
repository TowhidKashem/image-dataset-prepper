import { useEffect, useState } from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider, ThemeProvider, theme, Flex } from '@chakra-ui/react';
import { ChooseDirectory } from './ChooseDirectory';
import { DirectoryList } from './DirectoryList';
import { DirectoryContent } from './DirectoryContent';
import { AppContext, channels } from './_data';
import { logger } from './_utils';

const { ipcRenderer } = window.electron;

export function App() {
  const [directoryPath, setDirectoryPath] = useState('');
  const [directories, setDirectories] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);

  // channel subscriptions
  useEffect(() => {
    ipcRenderer.on(channels.GET_SUB_FOLDERS, ({ contents, directory }) => {
      setDirectories(contents);
      setDirectoryPath(directory);
      logger('sub', channels.GET_SUB_FOLDERS, { contents, directory });
    });

    ipcRenderer.on(channels.GET_IMAGES, ({ contents, directory }) => {
      setImages(contents);
      setDirectories(null);
      setDirectoryPath(directory);
      logger('sub', channels.GET_IMAGES, { contents, directory });
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
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
            background="gray.700"
          >
            <MemoryRouter>
              <Routes>
                <Route path="/chooseDirectory?" element={<ChooseDirectory />} />
                <Route path="/directoryList" element={<DirectoryList />} />
                <Route
                  path="/directoryContent"
                  element={<DirectoryContent />}
                />
              </Routes>
            </MemoryRouter>
          </Flex>
        </ThemeProvider>
      </ChakraProvider>
    </AppContext.Provider>
  );
}
