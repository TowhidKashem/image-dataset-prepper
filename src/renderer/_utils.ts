import { ChannelT } from './types/global';

export const removeStartEndSlash = (path: string): string => {
  if (path.startsWith('/')) path = path.slice(1);
  if (path.endsWith('/')) path = path.slice(0, -1);
  return path;
};

export const getDirName = (fileName: string): string =>
  fileName.split('/').pop();

export const getFileExtension = (fileName: string): string =>
  fileName?.split('.').pop() ?? null;

export const isImage = (extension: string): boolean =>
  ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(extension);

export const logger = (
  type: 'pub' | 'sub',
  channel: ChannelT,
  data: Record<string, any>
) => console.warn(`🔥 [${type}]`, channel, data);
