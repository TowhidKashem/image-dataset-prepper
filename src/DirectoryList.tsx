import PubSub from 'pubsub-js';
import { useContext, useEffect } from 'react';
import { SimpleGrid, Flex, Heading, Icon } from '@chakra-ui/react';
import { FcOpenedFolder } from 'react-icons/fc';
import { PathNav } from './PathNav';
import { AppContext, GET_FOLDER_CONTENTS } from './_data';
import { getPathInfo } from './_utils';

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
    const getFolderContents = ({ contents, args }: any) => {
      if (args.root) {
        setDirectories(contents, () => {
          setScreen('directoryList');
        });
      } else {
        setImages(contents, () => {
          setDirectories(null);
          setDirectoryPath(args.directory);
          setScreen('directoryContent');
        });
      }
    };

    PubSub.subscribe(GET_FOLDER_CONTENTS, (_topic, payload) => {
      alert('lmaooo');
      getFolderContents(payload);
    });
  }, []);

  const handleFolderClick = (directory: string) => {
    window.electron.ipcRenderer.sendMessage(GET_FOLDER_CONTENTS, {
      directory,
      root: false
    });
  };

  if (screen !== 'directoryList') return null;

  return (
    <>
      <PathNav path={directoryPath} />

      <SimpleGrid spacing={2} columns={{ sm: 2, md: 10 }}>
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
              onClick={() => handleFolderClick(directory)}
            >
              <Icon boxSize="4rem" marginBottom={1} as={FcOpenedFolder} />

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
