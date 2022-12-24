import { useState, useEffect, useRef } from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider, Flex } from '@chakra-ui/react';
import { ChooseDirectory } from './ChooseDirectory';
import { DirectoryList } from './DirectoryList';
import { DirectoryContent } from './DirectoryContent';
import { useStateCallback } from './useStateCallback';
import { AppContext, AppDataT, channels } from './_data';

const { ipcRenderer } = window.electron;

export function App() {
  const [appData, setAppData] = useState<AppDataT>(null);
  const [pathSegments, setPathSegments] = useState<string[]>([]);
  const [directories, setDirectories] = useStateCallback<DirContentT[]>([]);

  const images = useRef<string[]>([]);

  useEffect(() => {
    const getAppData = async (): Promise<void> => {
      const { data } = await ipcRenderer.invoke<ResponseT<AppDataT>>(
        channels.GET_APP_DATA,
        undefined
      );
      setAppData(data);
    };
    getAppData();
  }, []);

  return (
    <AppContext.Provider
      value={{
        appData,
        pathSegments,
        setPathSegments,
        directories,
        setDirectories,
        images
      }}
    >
      <ChakraProvider>
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
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
