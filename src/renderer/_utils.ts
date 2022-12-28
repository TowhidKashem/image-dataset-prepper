export const removeStartEndSlash = (path: string): string => {
  if (path.startsWith('/')) path = path.slice(1);
  if (path.endsWith('/')) path = path.slice(0, -1);
  return path;
};

export const sortImages = (images: DirContentT[]): DirContentT[] =>
  images.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });

export const isValidImage = ({
  path,
  extension
}: {
  path?: string;
  extension?: string;
}): boolean => {
  const fileExt = extension || path.split('.').pop();
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(
    fileExt.toLocaleLowerCase()
  );
};
