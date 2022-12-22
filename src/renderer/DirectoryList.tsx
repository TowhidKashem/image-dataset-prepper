import { useContext } from 'react';
import { SimpleGrid, Flex, Heading, Icon } from '@chakra-ui/react';
import { FcOpenedFolder } from 'react-icons/fc';
import { PathNav } from './PathNav';
import { AppContext, channels } from './_data';
import { getPathInfo } from './_utils';

export function DirectoryList() {
  const { screen, directoryPath, directories } = useContext(AppContext);

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
                window.electron.ipcRenderer.sendMessage(channels.GET_IMAGES, {
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
