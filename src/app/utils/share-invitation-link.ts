import { environment } from 'src/environments/environment';

export function buildShareLink(id: string): string {
  return `${environment.homepage}invitation?id=${id}`;
}
