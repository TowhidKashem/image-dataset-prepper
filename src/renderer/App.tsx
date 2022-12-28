import { useState, useRef } from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider, Flex } from '@chakra-ui/react';
import { ChooseDirectory } from './ChooseDirectory';
import { DirectoryList } from './DirectoryList';
import { DirectoryContent } from './DirectoryContent';
import { useStateCallback } from './useStateCallback';
import { AppContext } from './_data';

export function App() {
  const images = useRef<DirContentT[]>([]);

  const [pathSegments, setPathSegments] = useState<string[]>([]);
  const [directories, setDirectories] = useStateCallback<DirContentT[]>([]);
  const [visitedDirs, setVisitedDirs] = useState<string[]>(
    JSON.parse(localStorage.getItem('visitedDirs')) ?? []
  );

  return (
    <AppContext.Provider
      value={{
        images,
        pathSegments,
        setPathSegments,
        directories,
        setDirectories,
        visitedDirs,
        setVisitedDirs
      }}
    >
      <ChakraProvider>
        <Flex
          flexDirection="column"
          alignItems="center"
          minHeight="100vh"
          paddingX={3}
          background="gray.700"
        >
          <MemoryRouter>
            <Routes>
              <Route path="/chooseDirectory?" element={<ChooseDirectory />} />
              <Route path="/directoryList" element={<DirectoryList />} />
              <Route path="/directoryContent" element={<DirectoryContent />} />
            </Routes>
          </MemoryRouter>
        </Flex>
      </ChakraProvider>
    </AppContext.Provider>
  );
}
