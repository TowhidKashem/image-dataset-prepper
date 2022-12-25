export const removeStartEndSlash = (path: string): string => {
  if (path.startsWith('/')) path = path.slice(1);
  if (path.endsWith('/')) path = path.slice(0, -1);
  return path;
};

export const getRootFileDir = (
  path: string
): {
  segments: string[];
  path: string;
} => {
  const segments = path.split('/');

  // when a folder is selected through a file input field the first file in the folder
  // is automatically selected, so remove it to get the folder path
  segments.pop();

  return {
    segments,
    path: segments.join('/')
  };
};

export const sortImages = (images: DirContentT[]): DirContentT[] =>
  images.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });

export const isImage = ({
  path,
  extension
}: {
  path?: string;
  extension?: string;
}): boolean => {
  const VALID_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
  const fileExtension = extension || path.split('.').pop();

  return VALID_EXTENSIONS.includes(fileExtension.toLocaleLowerCase());
};
