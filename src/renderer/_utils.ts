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

export const sortImages = (images: DirContentT[]): DirContentT[] =>
  images.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });
