import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';

export function PathNav({ path }: { path: string }) {
  const segments = path.split('/');
  segments.pop();

  const curDir = segments[segments.length - 1];

  const commonProps = {
    fontSize: 'lg',
    cursor: 'default',
    _hover: {
      textDecoration: 'none'
    }
  };

  return (
    <Breadcrumb
      marginBottom={8}
      separator={<ChevronRightIcon color="gray.500" />}
    >
      <BreadcrumbItem>
        <BreadcrumbLink {...commonProps}>{segments.join('/')}</BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem isCurrentPage>
        <BreadcrumbLink {...commonProps}>{curDir}</BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  );
}
