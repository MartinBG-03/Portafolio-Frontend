const XML_PROLOG_AND_COMMENTS = /<\?xml[\s\S]*?\?>|<!--[\s\S]*?-->/g;
const ROOT_TAG = /<svg\b[^>]*>/;
const FIXED_SIZE_ATTRIBUTES = /\s(?:width|height)="[^"]*"/g;
const HEX_PAINT_ATTRIBUTES = /\b(fill|stroke)="#[0-9a-fA-F]{3,8}"/g;

export function normalizeSvg(svg: string): string {
  return svg
    .replace(XML_PROLOG_AND_COMMENTS, '')
    .replace(ROOT_TAG, (rootTag) =>
      rootTag.replace(FIXED_SIZE_ATTRIBUTES, '').replace('<svg', '<svg width="1em" height="1em"'),
    )
    .replace(HEX_PAINT_ATTRIBUTES, '$1="currentColor"')
    .trim();
}
