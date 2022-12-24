import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Flex,
  Icon,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink
} from '@chakra-ui/react';
import {
  IoChevronBackCircle,
  IoChevronForward,
  IoRefreshCircle
} from 'react-icons/io5';
import { AppContext } from './_data';

export function Navigation({ backPath }: { backPath: string }) {
  const navigate = useNavigate();

  const { pathSegments, setPathSegments } = useContext(AppContext);

  const handleBackClick = (): void => {
    setPathSegments((prevSegments) => {
      const newSegments = [...prevSegments];
      newSegments.pop();
      return newSegments;
    });

    navigate(backPath, { replace: true });
  };

  const iconProps = {
    fontSize: 48,
    color: 'whiteAlpha.900',
    cursor: 'pointer',
    borderRadius: 100,
    _hover: { opacity: 0.5 }
  };

  return (
    <Flex
      alignItems="center"
      height={55}
      marginY="20px"
      paddingX={2}
      paddingY={2}
      borderRadius={100}
      background="rgba(0, 0, 0, 0.4)"
    >
      <Icon as={IoChevronBackCircle} onClick={handleBackClick} {...iconProps} />

      <Breadcrumb
        marginRight={3}
        separator={
          <Icon as={IoChevronForward} fontSize={18} color="gray.500" />
        }
      >
        {pathSegments.map((segment, index) => (
          <BreadcrumbItem key={segment + index.toString()}>
            <BreadcrumbLink
              fontSize="md"
              fontWeight="500"
              color="gray.50"
              cursor="default"
              _hover={{ textDecoration: 'none' }}
            >
              {segment}
            </BreadcrumbLink>
          </BreadcrumbItem>
        ))}
      </Breadcrumb>

      <Icon as={IoRefreshCircle} {...iconProps} />
    </Flex>
  );
}
