const removeStartEndSlash = (path: string): string => {
  if (path.startsWith('/')) path = path.slice(1);
  if (path.endsWith('/')) path = path.slice(0, -1);
  return path;
};

// using the `webkitdirectory` attribute on the file input field lets us choose a folder
// but the actual contents accessible are still the files inside the folder
// and if the folder has several levels of nesting it's not possible to figure out the intended parent that the user wants to see
// so we ask them to select the same folder again but this time using the directory picker window
// the `showDirectoryPicker` API returns the proper directory name but not the absolute path (for security reasons)
// this function glues together the info received from both sources to figure out the absolute path of the intended directory
export const getRootDir = (
  path: string,
  dirName: string
): {
  segments: string[];
  path: string;
} => {
  const [rootPath] = path.split(dirName);
  path = rootPath + dirName;

  return {
    segments: removeStartEndSlash(path).split('/'),
    path
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
