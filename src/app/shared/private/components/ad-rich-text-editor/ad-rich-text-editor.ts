import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  booleanAttribute,
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  Injector,
  input,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { localized } from '../../../utils/localized';
import {
  AD_RICH_TEXT_FULL_TOOLS,
  AD_RICH_TEXT_LINK_PATTERN,
  AD_RICH_TEXT_TEXTS,
  AD_RICH_TEXT_TOOL_DEFINITIONS,
  AD_RICH_TEXT_TOOL_LABELS,
} from '../../constants/ad-rich-text.constants';
import {
  AdRichTextTool,
  AdRichTextToolDefinition,
} from '../../interfaces/ad-rich-text.interface';
import { AdTooltipDirective } from '../../directives/ad-tooltip.directive';
import { AdButton } from '../ad-button/ad-button';
import { adFieldLabelId, AdFieldControl } from '../ad-form-field/ad-field-control';
import { AdFormField } from '../ad-form-field/ad-form-field';
import { AdIcon } from '../ad-icon/ad-icon';

const STATE_COMMANDS: Readonly<Partial<Record<AdRichTextTool, string>>> = {
  bold: 'bold',
  italic: 'italic',
  underline: 'underline',
  strike: 'strikeThrough',
  bulletList: 'insertUnorderedList',
  numberList: 'insertOrderedList',
};

const LINK_TARGET = '_blank';
const LINK_REL = 'noopener noreferrer';

@Component({
  selector: 'ad-rich-text-editor',
  imports: [AdFormField, AdIcon, AdButton, AdTooltipDirective],
  templateUrl: './ad-rich-text-editor.html',
  styleUrl: './ad-rich-text-editor.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AdRichTextEditor), multi: true },
  ],
  host: {
    '(document:selectionchange)': 'refreshState()',
  },
})
export class AdRichTextEditor extends AdFieldControl<string> {
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);

  readonly tools = input<readonly AdRichTextTool[]>(AD_RICH_TEXT_FULL_TOOLS);
  readonly singleLine = input(false, { transform: booleanAttribute });
  readonly minRows = input(6);

  protected readonly texts = localized(AD_RICH_TEXT_TEXTS);
  protected readonly toolLabels = localized(AD_RICH_TEXT_TOOL_LABELS);
  protected readonly labelId = computed(() => adFieldLabelId(this.controlId));
  protected readonly linkInputId = `${this.controlId}-link`;

  protected readonly definitions = computed(() =>
    this.tools().map((tool) => AD_RICH_TEXT_TOOL_DEFINITIONS[tool]),
  );
  protected readonly active = signal<ReadonlySet<AdRichTextTool>>(new Set());
  protected readonly empty = signal(true);
  protected readonly focused = signal(false);

  protected readonly linkOpen = signal(false);
  protected readonly linkUrl = signal('');
  protected readonly linkError = signal<string | null>(null);
  protected readonly editingLink = signal(false);

  private readonly editor = viewChild<ElementRef<HTMLDivElement>>('editor');
  private savedRange: Range | null = null;

  constructor() {
    super();
    afterNextRender(() => this.render(this.value()));
  }

  override writeValue(value: string | null): void {
    super.writeValue(value);
    this.render(value);
  }

  protected startsGroup(index: number): boolean {
    const definitions = this.definitions();
    return index > 0 && definitions[index].group !== definitions[index - 1].group;
  }

  protected isActive(tool: AdRichTextTool): boolean {
    return this.active().has(tool);
  }

  protected apply(definition: AdRichTextToolDefinition): void {
    if (this.isDisabled()) {
      return;
    }

    this.element()?.focus();

    if (definition.key === 'link') {
      this.openLink();
      return;
    }

    if (definition.command === 'formatBlock') {
      const toggleOff = definition.key !== 'paragraph' && this.isActive(definition.key);
      this.exec('formatBlock', toggleOff ? '<p>' : definition.value);
    } else {
      this.exec(definition.command, definition.value);
      if (definition.key === 'clear') {
        this.exec('unlink');
      }
    }

    this.sync();
  }

  protected onInput(): void {
    this.sync();
  }

  protected onFocus(): void {
    this.focused.set(true);
    if (!this.singleLine()) {
      this.exec('defaultParagraphSeparator', 'p');
    }
  }

  protected onBlur(): void {
    this.focused.set(false);
    this.touch();
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (this.singleLine() && event.key === 'Enter') {
      event.preventDefault();
    }
  }

  protected onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const text = event.clipboardData?.getData('text/plain') ?? '';
    this.exec('insertText', this.singleLine() ? text.replace(/\s*\n\s*/g, ' ') : text);
    this.sync();
  }

  protected setLinkUrl(value: string): void {
    this.linkUrl.set(value);
    this.linkError.set(null);
  }

  protected applyLink(): void {
    const url = this.linkUrl().trim();
    if (!AD_RICH_TEXT_LINK_PATTERN.test(url)) {
      this.linkError.set(this.texts().linkError);
      return;
    }

    this.restoreRange();
    const selection = this.document.getSelection();
    if (!selection || selection.isCollapsed) {
      const anchor = this.document.createElement('a');
      anchor.href = url;
      anchor.textContent = url;
      this.exec('insertHTML', anchor.outerHTML);
    } else {
      this.exec('createLink', url);
    }

    this.closeLink();
    this.sync();
  }

  protected removeLink(): void {
    this.restoreRange();
    this.exec('unlink');
    this.closeLink();
    this.sync();
  }

  protected closeLink(): void {
    this.linkOpen.set(false);
    this.linkError.set(null);
    this.savedRange = null;
  }

  protected refreshState(): void {
    const editor = this.element();
    const selection = this.document.getSelection();
    if (!editor || !selection?.anchorNode || !editor.contains(selection.anchorNode)) {
      return;
    }

    const active = new Set<AdRichTextTool>();
    for (const [tool, command] of Object.entries(STATE_COMMANDS)) {
      if (this.document.queryCommandState(command)) {
        active.add(tool as AdRichTextTool);
      }
    }

    const block = this.document.queryCommandValue('formatBlock').toLowerCase();
    for (const definition of this.definitions()) {
      if (definition.block && definition.block === block) {
        active.add(definition.key);
      }
    }

    if (this.anchorAtSelection()) {
      active.add('link');
    }

    this.active.set(active);
  }

  private openLink(): void {
    const selection = this.document.getSelection();
    const editor = this.element();
    this.savedRange =
      editor && selection && selection.rangeCount > 0 && editor.contains(selection.anchorNode)
        ? selection.getRangeAt(0).cloneRange()
        : null;

    const anchor = this.anchorAtSelection();
    this.editingLink.set(anchor !== null);
    this.linkUrl.set(anchor?.getAttribute('href') ?? '');
    this.linkError.set(null);
    this.linkOpen.set(true);

    afterNextRender(() => this.document.getElementById(this.linkInputId)?.focus(), {
      injector: this.injector,
    });
  }

  private restoreRange(): void {
    this.element()?.focus();
    const selection = this.document.getSelection();
    if (this.savedRange && selection) {
      selection.removeAllRanges();
      selection.addRange(this.savedRange);
    }
  }

  private anchorAtSelection(): HTMLAnchorElement | null {
    const node = this.document.getSelection()?.anchorNode ?? null;
    const element = node instanceof Element ? node : (node?.parentElement ?? null);
    const anchor = element?.closest('a') ?? null;
    return anchor && this.element()?.contains(anchor) ? anchor : null;
  }

  private exec(command: string, value?: string): void {
    this.document.execCommand(command, false, value);
  }

  private sync(): void {
    const editor = this.element();
    if (!editor) {
      return;
    }
    editor.querySelectorAll('a').forEach((anchor) => {
      anchor.setAttribute('target', LINK_TARGET);
      anchor.setAttribute('rel', LINK_REL);
    });

    const isEmpty = (editor.textContent ?? '').trim() === '';
    this.empty.set(isEmpty);
    this.commit(isEmpty ? '' : editor.innerHTML);
    this.refreshState();
  }

  private element(): HTMLDivElement | null {
    return this.editor()?.nativeElement ?? null;
  }

  private render(value: string | null): void {
    const editor = this.element();
    if (!editor) {
      return;
    }
    const html = value ?? '';
    if (editor.innerHTML !== html) {
      editor.innerHTML = html;
    }
    this.empty.set((editor.textContent ?? '').trim() === '');
  }
}
