import { useState } from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider, ThemeProvider, theme, Flex } from '@chakra-ui/react';
import { ChooseDirectory } from './ChooseDirectory';
import { DirectoryList } from './DirectoryList';
import { DirectoryContent } from './DirectoryContent';
import { useStateCallback } from './useStateCallback';
import { AppContext } from './_data';

export function App() {
  const [pathSegments, setPathSegments] = useState([]);
  const [directories, setDirectories] = useStateCallback<string[]>([]);
  const [images, setImages] = useStateCallback<string[]>([]);

  return (
    <AppContext.Provider
      value={{
        pathSegments,
        setPathSegments,
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
