import { useCallback, useContext, useEffect } from 'react';
import PubSub from 'pubsub-js';
import { SimpleGrid, Flex, Heading, Icon } from '@chakra-ui/react';
import { FcOpenedFolder } from 'react-icons/fc';
import { PathNav } from './PathNav';
import {
  AppContext,
  GET_FOLDER_CONTENTS
  // GET_IMAGE,
  // DELETE_IMAGE,
  // TOAST_DURATION
} from './_data';

export function DirectoryList() {
  const { screen, setScreen, directory, directories, setDirectories } =
    useContext(AppContext);

  const getFolderContents = useCallback(
    ({ contents, args }: { contents: any; args: any }) => {
      if (args.root) {
        setDirectories(contents, () => {
          setScreen('directoryList');
        });
      } else {
        // setImages(contents);
        // imagesRef.current = contents;
        // getImage(); // get the first image
        // setCommand('GET_NEXT_IMAGE');
      }
    },
    [setDirectories, setScreen]
  );

  useEffect(() => {
    PubSub.subscribe(GET_FOLDER_CONTENTS, (_, payload) => {
      console.log('⭐️', { event: GET_FOLDER_CONTENTS, payload });

      getFolderContents(payload);
    });
  }, [getFolderContents]);

  if (screen !== 'directoryList') return null;

  return (
    <>
      <PathNav path={directory} />

      <SimpleGrid columns={{ sm: 2, md: 10 }} spacing={2}>
        {directories.map((directory) => (
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
          >
            <Icon boxSize="4rem" marginBottom={1} as={FcOpenedFolder} />

            <Heading as="h6" size="xs">
              {directory}
            </Heading>
          </Flex>
        ))}
      </SimpleGrid>
    </>
  );
}
