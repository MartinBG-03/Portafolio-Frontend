import { Localized } from '../../../core/public/i18n/language';
import {
  AdRichTextTool,
  AdRichTextToolDefinition,
} from '../interfaces/ad-rich-text.interface';

export const AD_RICH_TEXT_TOOL_DEFINITIONS: Readonly<Record<AdRichTextTool, AdRichTextToolDefinition>> = {
  paragraph: {
    key: 'paragraph',
    group: 'block',
    command: 'formatBlock',
    value: '<p>',
    block: 'p',
    glyph: 'P',
  },
  heading2: {
    key: 'heading2',
    group: 'block',
    command: 'formatBlock',
    value: '<h2>',
    block: 'h2',
    glyph: 'H2',
  },
  heading3: {
    key: 'heading3',
    group: 'block',
    command: 'formatBlock',
    value: '<h3>',
    block: 'h3',
    glyph: 'H3',
  },
  bold: { key: 'bold', group: 'inline', command: 'bold', glyph: 'B' },
  italic: { key: 'italic', group: 'inline', command: 'italic', glyph: 'I' },
  underline: {
    key: 'underline',
    group: 'inline',
    command: 'underline',
    glyph: 'U',
  },
  strike: { key: 'strike', group: 'inline', command: 'strikeThrough', glyph: 'S' },
  bulletList: {
    key: 'bulletList',
    group: 'list',
    command: 'insertUnorderedList',
    icon: 'list-bullet',
  },
  numberList: {
    key: 'numberList',
    group: 'list',
    command: 'insertOrderedList',
    icon: 'list-number',
  },
  quote: {
    key: 'quote',
    group: 'list',
    command: 'formatBlock',
    value: '<blockquote>',
    block: 'blockquote',
    icon: 'quote',
  },
  link: { key: 'link', group: 'insert', command: 'createLink', icon: 'link' },
  clear: {
    key: 'clear',
    group: 'insert',
    command: 'removeFormat',
    icon: 'clear-format',
  },
};

export const AD_RICH_TEXT_INLINE_TOOLS: readonly AdRichTextTool[] = [
  'bold',
  'italic',
  'underline',
  'strike',
  'link',
  'clear',
];

export const AD_RICH_TEXT_BASIC_TOOLS: readonly AdRichTextTool[] = [
  'bold',
  'italic',
  'underline',
  'strike',
  'bulletList',
  'numberList',
  'link',
  'clear',
];

export const AD_RICH_TEXT_FULL_TOOLS: readonly AdRichTextTool[] = [
  'paragraph',
  'heading2',
  'heading3',
  'bold',
  'italic',
  'underline',
  'strike',
  'bulletList',
  'numberList',
  'quote',
  'link',
  'clear',
];

export const AD_RICH_TEXT_LINK_PATTERN = /^(https?:\/\/\S+|mailto:\S+)$/i;

export const AD_RICH_TEXT_TOOL_LABELS: Localized<Readonly<Record<AdRichTextTool, string>>> = {
  es: {
    paragraph: 'Texto normal',
    heading2: 'Título grande',
    heading3: 'Título mediano',
    bold: 'Negrita (Ctrl+B)',
    italic: 'Cursiva (Ctrl+I)',
    underline: 'Subrayado (Ctrl+U)',
    strike: 'Tachado',
    bulletList: 'Lista con viñetas',
    numberList: 'Lista numerada',
    quote: 'Cita',
    link: 'Enlace',
    clear: 'Quitar formato',
  },
  en: {
    paragraph: 'Normal text',
    heading2: 'Large heading',
    heading3: 'Medium heading',
    bold: 'Bold (Ctrl+B)',
    italic: 'Italic (Ctrl+I)',
    underline: 'Underline (Ctrl+U)',
    strike: 'Strikethrough',
    bulletList: 'Bulleted list',
    numberList: 'Numbered list',
    quote: 'Quote',
    link: 'Link',
    clear: 'Clear formatting',
  },
};

export const AD_RICH_TEXT_TEXTS: Localized<{
  readonly toolbar: (label: string) => string;
  readonly linkLabel: string;
  readonly linkPlaceholder: string;
  readonly linkError: string;
  readonly applyLink: string;
  readonly removeLink: string;
  readonly cancel: string;
}> = {
  es: {
    toolbar: (label) => `Formato de ${label}`,
    linkLabel: 'Dirección del enlace',
    linkPlaceholder: 'https://...',
    linkError: 'Escribe una dirección que empiece por http://, https:// o mailto:',
    applyLink: 'Aplicar enlace',
    removeLink: 'Quitar enlace',
    cancel: 'Cancelar',
  },
  en: {
    toolbar: (label) => `${label} formatting`,
    linkLabel: 'Link address',
    linkPlaceholder: 'https://...',
    linkError: 'Enter an address that starts with http://, https:// or mailto:',
    applyLink: 'Apply link',
    removeLink: 'Remove link',
    cancel: 'Cancel',
  },
};
