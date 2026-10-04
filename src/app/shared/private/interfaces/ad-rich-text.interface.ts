import { AdIconName } from '../components/ad-icon/ad-icon-registry';

export type AdRichTextTool =
  | 'paragraph'
  | 'heading2'
  | 'heading3'
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | 'bulletList'
  | 'numberList'
  | 'quote'
  | 'link'
  | 'clear';

export type AdRichTextToolGroup = 'block' | 'inline' | 'list' | 'insert';

export interface AdRichTextToolDefinition {
  readonly key: AdRichTextTool;
  readonly group: AdRichTextToolGroup;
  readonly command: string;
  readonly value?: string;
  readonly block?: string;
  readonly icon?: AdIconName;
  readonly glyph?: string;
}
