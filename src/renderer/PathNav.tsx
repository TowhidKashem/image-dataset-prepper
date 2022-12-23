import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Flex,
  Icon,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbLinkProps
} from '@chakra-ui/react';
import { IoChevronBackCircle, IoChevronForward } from 'react-icons/io5';
import { AppContext } from './_data';
import { removeStartEndSlash } from './_utils';

export function PathNav({ onBackClick }: { onBackClick: () => void }) {
  const navigate = useNavigate();

  const { directoryPath } = useContext(AppContext);

  const pathSegments = removeStartEndSlash(directoryPath).split('/');

  const commonProps: BreadcrumbLinkProps = {
    fontSize: 'md',
    fontWeight: 'medium',
    cursor: 'default',
    color: 'gray.50',
    _hover: {
      textDecoration: 'none'
    }
  };

  return (
    <Flex
      background="#333"
      style={{
        border: '1px solid gray',
        background: 'rgba(0, 0, 0, 0.2)'
      }}
      marginBottom={8}
      padding={1}
      borderRadius={100}
      alignItems="center"
    >
      <Icon
        as={IoChevronBackCircle}
        fontSize={55}
        color="white"
        cursor="pointer"
        _hover={{ opacity: 0.5 }}
        onClick={() => {
          navigate(-1);
          onBackClick();
        }}
      />

      <Breadcrumb
        marginRight={20}
        marginLeft={10}
        separator={
          <Icon as={IoChevronForward} fontSize={18} color="gray.500" />
        }
      >
        {pathSegments.map((segment, index) => (
          <BreadcrumbItem key={segment + index.toString()}>
            <BreadcrumbLink {...commonProps}>{segment}</BreadcrumbLink>
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
    </Flex>
  );
}
