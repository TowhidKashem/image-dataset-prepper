import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast, SimpleGrid, Flex, Heading, Icon } from '@chakra-ui/react';
import { FcFolder } from 'react-icons/fc';
import { Navigation } from './Navigation';
import { AppContext, channels, toastConfig } from './_data';
import { getDirName } from './_utils';

const { ipcRenderer } = window.electron;

export function DirectoryList() {
  const navigate = useNavigate();

  const toast = useToast(toastConfig);

  const { directories, images, setPathSegments } = useContext(AppContext);

  const handleFolderClick = async (path: string) => {
    try {
      const { data, error } = await ipcRenderer.invoke<ResponseT<string[]>>(
        channels.LIST_DIR,
        path
      );

      if (error) throw error;

      setPathSegments((prevSegments) => [...prevSegments, getDirName(path)]);

      images.current = data;

      navigate('/directoryContent', { replace: true });
    } catch (error) {
      toast({
        description: error.toString(),
        status: 'error'
      });
    }
  };

  return (
    <>
      <Navigation backPath="/chooseDirectory" />

      <SimpleGrid
        flex={1}
        spacing={2}
        columns={{
          sm: 2,
          md: 5,
          lg: 8
        }}
        paddingBottom="2rem"
      >
        {directories.map((dirPath) => (
          <Flex
            key={dirPath}
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            padding={3}
            cursor="pointer"
            borderRadius={10}
            _hover={{
              background: 'rgba(0, 0, 0, 0.3)'
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
