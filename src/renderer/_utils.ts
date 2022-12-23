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

  segments.pop();
  segments.pop();

  return {
    segments,
    path: segments.join('/')
  };
};

export const getDirName = (fileName: string): string =>
  fileName.split('/').pop();

export const getFileExtension = (fileName: string): string =>
  fileName?.split('.').pop() ?? null;

export const isImage = (extension: string): boolean =>
  ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(extension);
