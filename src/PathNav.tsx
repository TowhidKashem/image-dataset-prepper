import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { getPathInfo } from './_utils';

export function PathNav({ path }: { path: string }) {
  const { parentPath, dirName } = getPathInfo(path);

  const commonProps = {
    fontSize: 'lg',
    cursor: 'default',
    _hover: {
      textDecoration: 'none',
    },
  };

  return (
    <Breadcrumb
      marginBottom={8}
      separator={<ChevronRightIcon color="gray.500" />}
    >
      <BreadcrumbItem>
        <BreadcrumbLink {...commonProps}>{parentPath}</BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem isCurrentPage>
        <BreadcrumbLink {...commonProps}>{dirName}</BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  );
}
