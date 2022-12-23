import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SimpleGrid, Flex, Heading, Icon } from '@chakra-ui/react';
import { FcFolder } from 'react-icons/fc';
import { Navigation } from './Navigation';
import { AppContext, channels } from './_data';
import { getDirName, logger } from './_utils';

const { ipcRenderer } = window.electron;

export function DirectoryList() {
  const navigate = useNavigate();

  const { directories, setDirectories, setImages, setDirPath } =
    useContext(AppContext);

  const handleFolderClick = async (dirPath: string) => {
    try {
      const images = await ipcRenderer.invoke(channels.GET_IMAGES, dirPath);

      setImages(images);
      setDirectories(null);
      setDirPath(dirPath);
      logger('sub', channels.GET_IMAGES, { images, dirPath });

      navigate('/directoryContent', { replace: true });
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
          setDirPath(null);
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
        {directories?.map((dirPath) => (
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
