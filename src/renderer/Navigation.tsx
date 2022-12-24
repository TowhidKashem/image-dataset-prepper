import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useDisclosure,
  Flex,
  Icon,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogBody
} from '@chakra-ui/react';
import {
  IoChevronBackCircle,
  IoChevronForward,
  IoRefreshCircle
} from 'react-icons/io5';
import { AppContext } from './_data';

export function Navigation({
  backPath,
  onClearHistory
}: {
  backPath: string;
  onClearHistory?: () => void;
}) {
  const navigate = useNavigate();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { pathSegments, setPathSegments } = useContext(AppContext);

  const handleBackClick = (): void => {
    setPathSegments((prevSegments) => {
      const newSegments = [...prevSegments];
      newSegments.pop();
      return newSegments;
    });

    navigate(backPath, { replace: true });
  };

  const handleClearHistory = (): void => {
    localStorage.removeItem('viewedDirs');
    onClearHistory && onClearHistory();
    onClose();
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
      paddingX={1}
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

      <Icon as={IoRefreshCircle} onClick={onOpen} {...iconProps} />

      <AlertDialog
        leastDestructiveRef={null}
        isOpen={isOpen}
        onClose={onClose}
        size="sm"
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Browsing History
            </AlertDialogHeader>

            <AlertDialogBody fontSize="md">
              Are you really sure?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onClose}>Cancel</Button>
              <Button
                colorScheme="red"
                marginLeft={3}
                onClick={handleClearHistory}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
}
