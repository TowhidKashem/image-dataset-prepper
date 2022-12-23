import { useState } from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider, ThemeProvider, theme, Flex } from '@chakra-ui/react';
import { ChooseDirectory } from './ChooseDirectory';
import { DirectoryList } from './DirectoryList';
import { DirectoryContent } from './DirectoryContent';
import { AppContext } from './_data';

export function App() {
  const [dirPath, setDirPath] = useState('');
  const [directories, setDirectories] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);

  return (
    <AppContext.Provider
      value={{
        dirPath,
        setDirPath,
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
