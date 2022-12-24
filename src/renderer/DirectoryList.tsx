import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SimpleGrid, Flex, Heading, Icon } from '@chakra-ui/react';
import { FcFolder } from 'react-icons/fc';
import { Navigation } from './Navigation';
import { AppContext, channels } from './_data';
import { getDirName } from './_utils';

const { ipcRenderer } = window.electron;

export function DirectoryList() {
  const navigate = useNavigate();

  const { directories, setDirectories, setImages, setPathSegments } =
    useContext(AppContext);

  const handleFolderClick = async (path: string) => {
    try {
      const { data, error } = await ipcRenderer.invoke<Res<string[]>>(
        channels.LIST_DIR,
        path
      );

      if (error) throw error;

      setPathSegments((prevSegments) => [...prevSegments, getDirName(path)]);

      setImages(data, () => {
        navigate('/directoryContent', { replace: true });
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navigation
        backPath="/"
        onBackClick={() => {
          setDirectories(null);
          setImages(null);
          setPathSegments(null);
        }}
      />

      <SimpleGrid
        spacing={2}
        columns={{
          sm: 2,
          md: 5,
          lg: 8
        }}
      >
        {directories.map((dirPath) => (
          <Flex
            key={dirPath}
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            padding={3}
            _hover={{
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: 10,
              cursor: 'pointer'
            }}
            onClick={() => handleFolderClick(dirPath)}
          >
            <Icon as={FcFolder} fontSize="4rem" marginBottom={1} />

            <Heading color="gray.50" as="h6" size="xs">
              {getDirName(dirPath)}
            </Heading>
          </Flex>
        ))}
      </SimpleGrid>
    </>
  );
}
