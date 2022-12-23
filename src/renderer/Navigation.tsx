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

const commonProps: BreadcrumbLinkProps = {
  fontSize: 'md',
  fontWeight: '500',
  cursor: 'default',
  color: 'gray.50',
  _hover: {
    textDecoration: 'none'
  }
};

export function Navigation({
  backPath,
  onBackClick
}: {
  backPath: string;
  onBackClick: () => void;
}) {
  const navigate = useNavigate();

  const { pathSegments } = useContext(AppContext);

  return (
    <Flex
      alignItems="center"
      background="rgba(0, 0, 0, 0.2)"
      borderRadius={100}
      marginBottom={8}
      padding={1}
    >
      <Icon
        as={IoChevronBackCircle}
        fontSize={55}
        color="white"
        cursor="pointer"
        _hover={{ opacity: 0.5 }}
        onClick={() => {
          onBackClick();
          navigate(backPath, { replace: true });
        }}
      />

      <Breadcrumb
        marginRight={7}
        marginLeft={5}
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
