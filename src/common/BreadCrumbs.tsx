import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';

export function BreadCrumbs({ path }: { path: string }) {
  const segments = path.split('/');
  segments.pop();

  const curDir = segments[segments.length - 1];

  return (
    <Breadcrumb
      marginBottom={8}
      separator={<ChevronRightIcon color="gray.500" />}
    >
      <BreadcrumbItem>
        <BreadcrumbLink href="#">{segments.join('/')}</BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem isCurrentPage>
        <BreadcrumbLink href="#">{curDir}</BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  );
}
