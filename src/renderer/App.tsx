import { useState, useEffect } from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider, ThemeProvider, theme, Flex } from '@chakra-ui/react';
import { ChooseDirectory } from './ChooseDirectory';
import { DirectoryList } from './DirectoryList';
import { DirectoryContent } from './DirectoryContent';
import { useStateCallback } from './useStateCallback';
import { AppContext, EnvVarsT, channels } from './_data';

const { ipcRenderer } = window.electron;

export function App() {
  const [envVars, setEnvVars] = useState<EnvVarsT>(null);
  const [pathSegments, setPathSegments] = useState<string[]>([]);
  const [directories, setDirectories] = useStateCallback<string[]>([]);
  const [images, setImages] = useStateCallback<string[]>([]);

  useEffect(() => {
    const getEnvVars = async (): Promise<void> => {
      const { data } = await ipcRenderer.invoke<ResponseT<EnvVarsT>>(
        channels.GET_ENV_VARS,
        undefined
      );
      setEnvVars(data);
    };
    getEnvVars();
  }, []);

  return (
    <AppContext.Provider
      value={{
        envVars,
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
