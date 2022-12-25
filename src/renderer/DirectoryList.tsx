import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast, SimpleGrid, Flex, Heading, Icon } from '@chakra-ui/react';
import { FcFolder, FcFile } from 'react-icons/fc';
import { Navigation } from './Navigation';
import { AppContext, channels, toastConfig, ERROR_DURATION } from './_data';
import { sortImages } from './_utils';

const { ipcRenderer } = window.electron;

export function DirectoryList() {
  const navigate = useNavigate();

  const toast = useToast(toastConfig);

  const { directories, images, setPathSegments } = useContext(AppContext);

  const [viewedDirs, setViewedDirs] = useState<string[]>(
    JSON.parse(localStorage.getItem('viewedDirs')) ?? []
  );

  const handleFolderClick = async (
    path: string,
    name: string
  ): Promise<void> => {
    try {
      const { data, error } = await ipcRenderer.invoke<
        ResponseT<DirContentT[]>
      >(channels.LIST_DIR, path);

      if (error) throw error;

      setPathSegments((prevSegments) => [...prevSegments, name]);

      updateHistory(path);

      images.current = sortImages(data);

      navigate('/directoryContent', { replace: true });
    } catch (error) {
      toast({
        description: error.toString(),
        status: 'error',
        duration: ERROR_DURATION
      });
    }
  };

  const updateHistory = (visitedDir: string): void => {
    const newViewedDirs = [...viewedDirs, visitedDir];

    setViewedDirs(newViewedDirs);

    localStorage.setItem('viewedDirs', JSON.stringify(newViewedDirs));
  };

  return (
    <>
      <Navigation
        backPath="/chooseDirectory"
        onClearHistory={() => setViewedDirs([])}
      />

      <SimpleGrid
        spacing={2}
        columns={{
          sm: 2,
          md: 5,
          lg: 8
        }}
        paddingBottom="2rem"
      >
        {directories.map(({ name, path, isDir }) => (
          <Flex
            key={path}
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            padding={3}
            cursor={isDir ? 'pointer' : 'not-allowed'}
            borderRadius={10}
            opacity={viewedDirs.includes(path) ? 0.3 : 1}
            _hover={{
              background: 'rgba(0, 0, 0, 0.3)'
            }}
            onClick={() => isDir && handleFolderClick(path, name)}
          >
            <Icon
              as={isDir ? FcFolder : FcFile}
              fontSize="4rem"
              marginBottom={1}
            />

            <Heading
              as="h6"
              size="xs"
              noOfLines={1}
              color="gray.50"
              maxWidth="100%"
            >
              {name}
            </Heading>
          </Flex>
        ))}
      </SimpleGrid>
    </>
  );
}
