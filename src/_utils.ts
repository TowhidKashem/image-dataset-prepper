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
    dirName
  };
};
