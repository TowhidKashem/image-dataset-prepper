export const getPathInfo = (
  path: string
): {
  parentPath: string;
  dirName: string;
} => {
  const segments = path.split('/');
  const dirName = segments.pop();

  return {
    parentPath: segments.join('/'),
    dirName,
  };
};

export const getFileExtension = (fileName: string): string =>
  fileName.split('.').pop();

export const isImage = (extension: string): boolean =>
  ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(extension);
