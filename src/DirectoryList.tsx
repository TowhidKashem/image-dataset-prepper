import { SimpleGrid, Flex, Heading, Icon } from '@chakra-ui/react';
import { FcOpenedFolder } from 'react-icons/fc';
import { BreadCrumbs } from 'common/BreadCrumbs';

export function DirectoryList({
  directories,
  directory
}: {
  directories: string[];
  directory: string;
}) {
  return (
    <Flex flexDirection="column" padding="2rem" minHeight="100vh">
      <BreadCrumbs path={directory} />

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
    </Flex>
  );
}
