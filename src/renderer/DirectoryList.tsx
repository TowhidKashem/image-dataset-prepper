import { useContext, useEffect } from 'react';
import { SimpleGrid, Flex, Heading, Icon } from '@chakra-ui/react';
import { FcOpenedFolder } from 'react-icons/fc';
import { PathNav } from './PathNav';
import { AppContext, topics } from './_data';
import { getPathInfo } from './_utils';

const { GET_SUB_FOLDERS, GET_IMAGES } = topics;

export function DirectoryList() {
  const {
    screen,
    setScreen,
    directoryPath,
    setDirectoryPath,
    directories,
    setDirectories,
    setImages
  } = useContext(AppContext);

  useEffect(() => {
    // window.electron.ipcRenderer.on(GET_IMAGES, ({ contents, args }) => {
    //   console.log('GET_IMAGES:', contents);
    //   setImages(contents, () => {
    //     setDirectories(null);
    //     setDirectoryPath(args.directory);
    //     setScreen('directoryContent');
    //   });
    // });
  }, []);

  if (screen !== 'directoryList') return null;

  return (
    <>
      <PathNav path={directoryPath} />

      <SimpleGrid
        spacing={2}
        columns={{
          sm: 2,
          md: 10
        }}
      >
        {directories.map((directory) => {
          const { dirName } = getPathInfo(directory);

          return (
            <Flex
              key={directory}
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              padding={3}
              _hover={{
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: 5,
                cursor: 'pointer'
              }}
              onClick={() => {
                window.electron.ipcRenderer.sendMessage(GET_IMAGES, {
                  directory
                });
              }}
            >
              <Icon as={FcOpenedFolder} boxSize="4rem" marginBottom={1} />

              <Heading as="h6" size="xs">
                {dirName}
              </Heading>
            </Flex>
          );
        })}
      </SimpleGrid>
    </>
  );
}
