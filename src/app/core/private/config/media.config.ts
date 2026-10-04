import { MediaFileType } from '../../models/media-file.interface';
import { AdMediaKind } from '../../../shared/private/interfaces/ad-media.interface';

export const MEDIA_ENDPOINTS = {
  upload: 'media',
} as const;

export const MEDIA_UPLOAD_FIELD = 'file';

export const MEDIA_KIND_BY_TYPE: Readonly<Record<MediaFileType, AdMediaKind>> = {
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
  FILE: 'file',
};

export const MEDIA_ACCEPT = {
  image: '.jpg,.jpeg,.png,.gif,.webp,.avif',
  any: '.jpg,.jpeg,.png,.gif,.webp,.avif,.mp4,.webm,.ogv,.mov,.mp3,.wav,.ogg,.m4a,.aac,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip',
} as const;
