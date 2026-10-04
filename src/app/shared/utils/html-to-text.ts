export function htmlToText(html: string | null | undefined): string {
  if (!html) {
    return '';
  }
  const document = new DOMParser().parseFromString(html, 'text/html');
  return (document.body.textContent ?? '').replace(/\s+/g, ' ').trim();
}
