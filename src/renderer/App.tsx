import { useEffect, useState } from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider, ThemeProvider, theme, Flex } from '@chakra-ui/react';
import { ChooseDirectory } from './ChooseDirectory';
import { DirectoryList } from './DirectoryList';
import { DirectoryContent } from './DirectoryContent';
import { AppContext, channels } from './_data';

export function App() {
  const [directoryPath, setDirectoryPath] = useState('');
  const [directories, setDirectories] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);

  // channel subscriptions
  useEffect(() => {
    window.electron.ipcRenderer.on(channels.GET_SUB_FOLDERS, ({ contents }) => {
      console.warn('[sub][GET_SUB_FOLDERS]:', contents);
      setDirectories(contents as string[]);
    });

    window.electron.ipcRenderer.on(
      channels.GET_IMAGES,
      ({ contents, args }) => {
        console.warn('[sub][GET_IMAGES]:', contents);
        setImages(contents as string[]);
        setDirectories(null);
        setDirectoryPath(args.directory);
      }
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
