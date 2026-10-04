import { environment } from '../../../../../core/config/environment.generated';

export function devLogFileUrl(path: string | null | undefined): string | null {
  if (!path) {
    return null;
  }

  const origin = new URL(environment.apiBaseUrl).origin;
  return `${origin}/media/${path.replace(/^\/+/, '')}`;
}
