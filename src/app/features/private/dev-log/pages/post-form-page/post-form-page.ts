import { Component, computed, DestroyRef, effect, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { MediaUploadService } from '../../../../../core/private/services/media-upload.service';
import { MEDIA_ACCEPT } from '../../../../../core/private/config/media.config';
import { ApiResponse } from '../../../../../core/models/api-response.interface';
import { MediaFile } from '../../../../../core/models/media-file.interface';
import { LanguageService } from '../../../../../core/public/services/language.service';
import { AdChipGroup } from '../../../../../shared/private/components/ad-chip-group/ad-chip-group';
import { AdConfirmDialog } from '../../../../../shared/private/components/ad-confirm-dialog/ad-confirm-dialog';
import { AdDateField } from '../../../../../shared/private/components/ad-date-field/ad-date-field';
import { AdFormField } from '../../../../../shared/private/components/ad-form-field/ad-form-field';
import { AdSwitch } from '../../../../../shared/private/components/ad-switch/ad-switch';
import { AdFilePicker } from '../../../../../shared/private/components/ad-file-picker/ad-file-picker';
import { AdFormRow } from '../../../../../shared/private/components/ad-form-row/ad-form-row';
import { AdFormSection } from '../../../../../shared/private/components/ad-form-section/ad-form-section';
import { AdMediaList } from '../../../../../shared/private/components/ad-media-list/ad-media-list';
import { AdPageHeader } from '../../../../../shared/private/components/ad-page-header/ad-page-header';
import { AdRadioGroup } from '../../../../../shared/private/components/ad-radio-group/ad-radio-group';
import { AdRichTextEditor } from '../../../../../shared/private/components/ad-rich-text-editor/ad-rich-text-editor';
import { AdTextField } from '../../../../../shared/private/components/ad-text-field/ad-text-field';
import { AdTextareaField } from '../../../../../shared/private/components/ad-textarea-field/ad-textarea-field';
import { AdWizard } from '../../../../../shared/private/components/ad-wizard/ad-wizard';
import { AdWizardStepContent } from '../../../../../shared/private/components/ad-wizard/ad-wizard-step';
import { AD_RICH_TEXT_FULL_TOOLS } from '../../../../../shared/private/constants/ad-rich-text.constants';
import { AdMediaActiveChange, AdMediaItem, AdMediaMove } from '../../../../../shared/private/interfaces/ad-media.interface';
import { AdOption } from '../../../../../shared/private/interfaces/ad-option.interface';
import { AdWizardStep } from '../../../../../shared/private/interfaces/ad-wizard.interface';
import { AdToastService } from '../../../../../shared/private/services/ad-toast.service';
import { catchApiError } from '../../../../../shared/utils/catch-api-error';
import { localized } from '../../../../../shared/utils/localized';
import { IsoDate, todayIso } from '../../../../../shared/utils/iso-date';
import { DevlogTitleCard } from '../../components/entries/devlog-title-card/devlog-title-card';
import {
  DevlogResourceItemDialog,
  DevLogResourceItemDetail,
} from '../../components/entries/devlog-resource-item-dialog/devlog-resource-item-dialog';
import {
  DEVLOG_ENTRY_FORM_MESSAGES,
  DEVLOG_ENTRY_FORM_TEXTS,
  DEVLOG_ENTRY_LIMITS,
  DEVLOG_MEDIA_ACCEPT,
  DEVLOG_MEDIA_KIND_BY_TYPE,
  DEVLOG_TITLE_DESIGN_OPTIONS,
} from '../../constants/entries/devlog-entry-form.constants';
import {
  DEVLOG_ENTRY_ERROR_HEADINGS,
  DEVLOG_ENTRY_SUCCESS_FEEDBACK,
  DEVLOG_ENTRY_UPLOAD_FEEDBACK,
} from '../../constants/entries/devlog-entry-feedback.constants';
import { SaveDevLogEntryRequest, DevLogEntryMediaRequest } from '../../interfaces/entries/devlog-entry-request.interface';
import {
  DevLogCategoryOption,
  DevLogEntry,
  DevLogMediaType,
  DevLogTitleDesign,
} from '../../interfaces/entries/devlog-entry.interface';
import { DevLogEntryService } from '../../services/entries/devlog-entry.service';
import { devLogFileUrl } from '../../utils/entries/devlog-file-url';

interface DevLogMediaFormItem {
  readonly key: string;
  readonly type: DevLogMediaType;
  readonly titleEs: string;
  readonly titleEn: string;
  readonly bodyEs: string | null;
  readonly bodyEn: string | null;
  readonly filePath: string;
  readonly fileName: string;
  readonly contentType: string | null;
  readonly sizeBytes: number | null;
  readonly previewUrl: string;
  readonly existingId: number | null;
  readonly active: boolean;
}

type DevLogEntryTextField =
  | 'titleEs'
  | 'titleEn'
  | 'descriptionEs'
  | 'descriptionEn'
  | 'bodyEs'
  | 'bodyEn'
  | 'coverImagePath'
  | 'listCoverImagePath'
  | 'categoryIds'
  | 'displayDate';

function requiredNonEmptyArray(control: AbstractControl): ValidationErrors | null {
  return Array.isArray(control.value) && control.value.length > 0 ? null : { required: true };
}

function moveItem(
  items: readonly DevLogMediaFormItem[],
  key: string,
  offset: -1 | 1,
): DevLogMediaFormItem[] {
  const index = items.findIndex((item) => item.key === key);
  const target = index + offset;
  if (index === -1 || target < 0 || target >= items.length) {
    return [...items];
  }
  const copy = [...items];
  [copy[index], copy[target]] = [copy[target], copy[index]];
  return copy;
}

const POSTS_LIST_ROUTE = '/admin/dev-log/posts';

@Component({
  selector: 'ad-post-form-page',
  imports: [
    ReactiveFormsModule,
    AdPageHeader,
    AdWizard,
    AdWizardStepContent,
    AdFormSection,
    AdFormRow,
    AdTextField,
    AdTextareaField,
    AdChipGroup,
    AdRadioGroup,
    AdDateField,
    AdFormField,
    AdSwitch,
    AdRichTextEditor,
    AdFilePicker,
    AdMediaList,
    AdConfirmDialog,
    DevlogTitleCard,
    DevlogResourceItemDialog,
  ],
  templateUrl: './post-form-page.html',
  styleUrl: './post-form-page.scss',
})
export class PostFormPage {
  private readonly entryService = inject(DevLogEntryService);
  private readonly mediaUpload = inject(MediaUploadService);
  private readonly toast = inject(AdToastService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly language = inject(LanguageService).language;

  readonly id = input<string>();

  protected readonly texts = localized(DEVLOG_ENTRY_FORM_TEXTS);
  private readonly messages = localized(DEVLOG_ENTRY_FORM_MESSAGES);
  private readonly uploadFeedback = localized(DEVLOG_ENTRY_UPLOAD_FEEDBACK);
  private readonly successFeedback = localized(DEVLOG_ENTRY_SUCCESS_FEEDBACK);
  private readonly errorHeadings = localized(DEVLOG_ENTRY_ERROR_HEADINGS);
  private readonly titleDesignOptionsByLanguage = localized(DEVLOG_TITLE_DESIGN_OPTIONS);

  protected readonly limits = DEVLOG_ENTRY_LIMITS;
  protected readonly richTextTools = AD_RICH_TEXT_FULL_TOOLS;
  protected readonly mediaAccept = {
    document: DEVLOG_MEDIA_ACCEPT.document,
    image: MEDIA_ACCEPT.image,
    video: DEVLOG_MEDIA_ACCEPT.video,
    audio: DEVLOG_MEDIA_ACCEPT.audio,
  } as const;

  private readonly entryId = computed(() => {
    const raw = this.id();
    const parsed = raw ? Number(raw) : null;
    return parsed && Number.isFinite(parsed) ? parsed : null;
  });

  protected readonly entry = signal<DevLogEntry | null>(null);
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly categoryOptions = signal<readonly DevLogCategoryOption[]>([]);

  protected readonly heading = computed(() =>
    this.entryId() !== null ? this.texts().editHeading : this.texts().createHeading,
  );

  protected readonly steps = computed<readonly AdWizardStep[]>(() => {
    const t = this.texts();
    return [
      { key: 'general', label: t.stepGeneral },
      { key: 'content', label: t.stepContent },
      { key: 'cover', label: t.stepCover },
      { key: 'media', label: t.stepMedia },
    ];
  });

  protected readonly activeStep = signal('general');
  protected readonly linear = computed(() => this.entryId() === null);
  protected readonly titleDesignOptions = this.titleDesignOptionsByLanguage;

  protected readonly categoryChipOptions = computed<readonly AdOption[]>(() => {
    const language = this.language();
    return this.categoryOptions().map((option) => ({
      value: option.id,
      label: language === 'en' ? option.nameEn : option.nameEs,
    }));
  });

  protected readonly form = new FormGroup({
    titleEs: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(DEVLOG_ENTRY_LIMITS.titleMaxLength)],
    }),
    titleEn: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(DEVLOG_ENTRY_LIMITS.titleMaxLength)],
    }),
    descriptionEs: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(DEVLOG_ENTRY_LIMITS.descriptionMaxLength),
      ],
    }),
    descriptionEn: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(DEVLOG_ENTRY_LIMITS.descriptionMaxLength),
      ],
    }),
    categoryIds: new FormControl<number[]>([], { nonNullable: true, validators: [requiredNonEmptyArray] }),
    displayDate: new FormControl<IsoDate | null>(todayIso(), Validators.required),
    isFeatured: new FormControl(false, { nonNullable: true }),
    bodyEs: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    bodyEn: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    coverImagePath: new FormControl<string | null>(null, Validators.required),
    coverFileName: new FormControl<string | null>(null),
    listCoverImagePath: new FormControl<string | null>(null, Validators.required),
    listCoverFileName: new FormControl<string | null>(null),
    titleDesign: new FormControl<DevLogTitleDesign>('left', { nonNullable: true }),
  });

  private readonly submitted = signal(false);
  private savedSuccessfully = false;
  private leaveSubject: Subject<boolean> | null = null;

  protected readonly confirmLeaveOpen = signal(false);

  protected readonly coverImageUrl = signal<string | null>(null);
  protected readonly coverUploading = signal(false);
  protected readonly listCoverImageUrl = signal<string | null>(null);
  protected readonly listCoverUploading = signal(false);

  protected readonly documents = signal<readonly DevLogMediaFormItem[]>([]);
  protected readonly images = signal<readonly DevLogMediaFormItem[]>([]);
  protected readonly videos = signal<readonly DevLogMediaFormItem[]>([]);
  protected readonly audios = signal<readonly DevLogMediaFormItem[]>([]);

  protected readonly documentItems = computed(() => this.documents().map(this.toMediaItem));
  protected readonly imageItems = computed(() => this.images().map(this.toMediaItem));
  protected readonly videoItems = computed(() => this.videos().map(this.toMediaItem));
  protected readonly audioItems = computed(() => this.audios().map(this.toMediaItem));

  protected readonly mediaUploading = signal<DevLogMediaType | null>(null);
  protected readonly pendingMedia = signal<{ type: DevLogMediaType; file: MediaFile } | null>(null);
  protected readonly resourceDialogOpen = signal(false);

  private readonly titleEsValue = toSignal(this.form.controls.titleEs.valueChanges, {
    initialValue: this.form.controls.titleEs.value,
  });
  private readonly titleEnValue = toSignal(this.form.controls.titleEn.valueChanges, {
    initialValue: this.form.controls.titleEn.value,
  });
  private readonly categoryIdsValue = toSignal(this.form.controls.categoryIds.valueChanges, {
    initialValue: this.form.controls.categoryIds.value,
  });
  private readonly titleDesignValue = toSignal(this.form.controls.titleDesign.valueChanges, {
    initialValue: this.form.controls.titleDesign.value,
  });
  private readonly displayDateValue = toSignal(this.form.controls.displayDate.valueChanges, {
    initialValue: this.form.controls.displayDate.value,
  });

  protected readonly previewTitle = computed(() =>
    this.language() === 'en' ? this.titleEnValue() : this.titleEsValue(),
  );
  protected readonly previewDate = computed(() => this.displayDateValue() ?? todayIso());
  protected readonly previewCategories = computed(() => {
    const ids = this.categoryIdsValue();
    if (ids.length === 0) {
      return [];
    }
    const language = this.language();
    const option = this.categoryOptions().find((candidate) => candidate.id === ids[0]);
    return option
      ? [{ id: option.id, label: language === 'en' ? option.nameEn : option.nameEs }]
      : [];
  });
  protected readonly previewButtonsPosition = computed(() => this.titleDesignValue());

  private nextKey = 0;

  constructor() {
    this.run(this.entryService.getCategoryOptions()).subscribe((response) => {
      if (response.isSuccess && response.data) {
        this.categoryOptions.set(response.data);
      } else {
        this.toast.error(this.errorHeadings().categories, response.message ?? '');
      }
    });

    effect(() => {
      const id = this.entryId();
      if (id === null) {
        this.reset(null);
        return;
      }

      this.loading.set(true);
      this.run(this.entryService.getById(id)).subscribe((response) => {
        this.loading.set(false);
        if (!response.isSuccess || !response.data) {
          this.toast.error(this.errorHeadings().get, response.message ?? '');
          this.router.navigateByUrl(POSTS_LIST_ROUTE);
          return;
        }
        this.entry.set(response.data);
        this.reset(response.data);
      });
    });
  }

  protected errorOf(field: DevLogEntryTextField): string | null {
    const control = this.form.controls[field];
    if (control.valid || !(control.touched || this.submitted())) {
      return null;
    }
    if (control.hasError('required')) {
      return this.messages().required;
    }
    if (control.hasError('maxlength')) {
      return this.messages().maxLength(control.getError('maxlength').requiredLength);
    }
    return null;
  }

  protected readonly validateStep = (key: string): boolean => {
    if (key === 'general') {
      const controls = [
        this.form.controls.titleEs,
        this.form.controls.titleEn,
        this.form.controls.descriptionEs,
        this.form.controls.descriptionEn,
        this.form.controls.categoryIds,
        this.form.controls.displayDate,
      ];
      controls.forEach((control) => control.markAsTouched());
      return controls.every((control) => control.valid);
    }
    if (key === 'content') {
      const controls = [this.form.controls.bodyEs, this.form.controls.bodyEn];
      controls.forEach((control) => control.markAsTouched());
      return controls.every((control) => control.valid);
    }
    if (key === 'cover') {
      const controls = [this.form.controls.coverImagePath, this.form.controls.listCoverImagePath];
      controls.forEach((control) => control.markAsTouched());
      return controls.every((control) => control.valid);
    }
    return true;
  };

  protected onCancel(): void {
    this.leaveList();
  }

  protected onFinish(): void {
    this.submitted.set(true);
    this.form.markAllAsTouched();
    const controls = this.form.controls;

    if (
      controls.titleEs.invalid ||
      controls.titleEn.invalid ||
      controls.descriptionEs.invalid ||
      controls.descriptionEn.invalid ||
      controls.categoryIds.invalid ||
      controls.displayDate.invalid
    ) {
      this.activeStep.set('general');
      return;
    }
    if (controls.bodyEs.invalid || controls.bodyEn.invalid) {
      this.activeStep.set('content');
      return;
    }
    if (controls.coverImagePath.invalid || controls.listCoverImagePath.invalid) {
      this.activeStep.set('cover');
      return;
    }

    const request = this.toRequest();
    const id = this.entryId();
    const kind = id !== null ? 'update' : 'create';
    const operation = id !== null ? this.entryService.update(id, request) : this.entryService.create(request);

    this.saving.set(true);
    this.run(operation).subscribe((response) => {
      this.saving.set(false);
      if (!response.isSuccess) {
        this.toast.error(this.errorHeadings()[kind], response.message ?? '');
        return;
      }

      const success = this.successFeedback()[kind];
      const savedName = this.language() === 'en' ? request.titleEn : request.titleEs;
      this.toast.success(success.heading, success.message(savedName));
      this.leaveList();
    });
  }

  protected onCoverSelected(files: readonly File[]): void {
    const file = files[0];
    if (!file) {
      return;
    }

    this.coverUploading.set(true);
    this.mediaUpload
      .upload(file)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response) => {
        this.coverUploading.set(false);
        if (!response.isSuccess || !response.data) {
          this.toast.error(
            this.uploadFeedback().failedHeading,
            response.message ?? this.uploadFeedback().failedMessage(file.name),
          );
          return;
        }

        this.form.controls.coverImagePath.setValue(response.data.path);
        this.form.controls.coverFileName.setValue(response.data.fileName);
        this.coverImageUrl.set(response.data.url);
      });
  }

  protected onListCoverSelected(files: readonly File[]): void {
    const file = files[0];
    if (!file) {
      return;
    }

    this.listCoverUploading.set(true);
    this.mediaUpload
      .upload(file)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response) => {
        this.listCoverUploading.set(false);
        if (!response.isSuccess || !response.data) {
          this.toast.error(
            this.uploadFeedback().failedHeading,
            response.message ?? this.uploadFeedback().failedMessage(file.name),
          );
          return;
        }

        this.form.controls.listCoverImagePath.setValue(response.data.path);
        this.form.controls.listCoverFileName.setValue(response.data.fileName);
        this.listCoverImageUrl.set(response.data.url);
      });
  }

  protected onFilesSelected(type: DevLogMediaType, files: readonly File[]): void {
    const file = files[0];
    if (!file) {
      return;
    }

    this.mediaUploading.set(type);
    this.mediaUpload
      .upload(file)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response) => {
        this.mediaUploading.set(null);
        if (!response.isSuccess || !response.data) {
          this.toast.error(
            this.uploadFeedback().failedHeading,
            response.message ?? this.uploadFeedback().failedMessage(file.name),
          );
          return;
        }

        this.pendingMedia.set({ type, file: response.data });
        this.resourceDialogOpen.set(true);
      });
  }

  protected onResourceSaved(detail: DevLogResourceItemDetail): void {
    const pending = this.pendingMedia();
    this.pendingMedia.set(null);
    if (!pending) {
      return;
    }

    const item: DevLogMediaFormItem = {
      key: this.newKeyValue(),
      type: pending.type,
      titleEs: detail.titleEs,
      titleEn: detail.titleEn,
      bodyEs: detail.bodyEs,
      bodyEn: detail.bodyEn,
      filePath: pending.file.path,
      fileName: pending.file.fileName,
      contentType: pending.file.contentType,
      sizeBytes: pending.file.size,
      previewUrl: pending.file.url,
      existingId: null,
      active: true,
    };

    this.sectionSignal(pending.type).update((items) => [...items, item]);
  }

  protected onItemRemoved(type: DevLogMediaType, key: string): void {
    this.sectionSignal(type).update((items) => items.filter((item) => item.key !== key));
  }

  protected onItemActiveChanged(type: DevLogMediaType, change: AdMediaActiveChange): void {
    this.sectionSignal(type).update((items) =>
      items.map((item) => (item.key === change.key ? { ...item, active: change.active } : item)),
    );
  }

  protected onItemMoved(type: DevLogMediaType, move: AdMediaMove): void {
    this.sectionSignal(type).update((items) => moveItem(items, move.key, move.offset));
  }

  protected onLeaveDialogOpenChange(open: boolean): void {
    this.confirmLeaveOpen.set(open);
    if (!open) {
      queueMicrotask(() => this.resolveLeave(false));
    }
  }

  protected confirmLeave(): void {
    this.resolveLeave(true);
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.savedSuccessfully || this.form.pristine) {
      return true;
    }
    this.leaveSubject = new Subject<boolean>();
    this.confirmLeaveOpen.set(true);
    return this.leaveSubject.asObservable();
  }

  private resolveLeave(result: boolean): void {
    const subject = this.leaveSubject;
    if (!subject) {
      return;
    }
    this.leaveSubject = null;
    subject.next(result);
    subject.complete();
  }

  private leaveList(): void {
    this.savedSuccessfully = true;
    this.router.navigateByUrl(POSTS_LIST_ROUTE);
  }

  private readonly toMediaItem = (item: DevLogMediaFormItem): AdMediaItem => ({
    key: item.key,
    name: item.type === 'document' || item.type === 'audio' ? item.fileName : item.titleEs,
    url: item.previewUrl,
    kind: DEVLOG_MEDIA_KIND_BY_TYPE[item.type],
    size: item.sizeBytes ?? undefined,
    active: item.active,
  });

  private sectionSignal(type: DevLogMediaType) {
    switch (type) {
      case 'document':
        return this.documents;
      case 'image':
        return this.images;
      case 'video':
        return this.videos;
      case 'audio':
        return this.audios;
    }
  }

  private newKeyValue(): string {
    this.nextKey += 1;
    return `media-${this.nextKey}`;
  }

  private reset(entry: DevLogEntry | null): void {
    this.submitted.set(false);
    this.activeStep.set('general');
    this.pendingMedia.set(null);
    this.resourceDialogOpen.set(false);

    this.form.reset({
      titleEs: entry?.titleEs ?? '',
      titleEn: entry?.titleEn ?? '',
      descriptionEs: entry?.descriptionEs ?? '',
      descriptionEn: entry?.descriptionEn ?? '',
      categoryIds: [...(entry?.categoryIds ?? [])],
      displayDate: entry ? todayIso(new Date(entry.displayDate)) : todayIso(),
      isFeatured: entry?.isFeatured ?? false,
      bodyEs: entry?.bodyEs ?? '',
      bodyEn: entry?.bodyEn ?? '',
      coverImagePath: entry?.coverImagePath ?? null,
      coverFileName: entry?.coverFileName ?? null,
      listCoverImagePath: entry?.listCoverImagePath ?? null,
      listCoverFileName: entry?.listCoverFileName ?? null,
      titleDesign: entry?.titleDesign ?? 'left',
    });

    this.coverImageUrl.set(devLogFileUrl(entry?.coverImagePath ?? null));
    this.listCoverImageUrl.set(devLogFileUrl(entry?.listCoverImagePath ?? null));

    this.documents.set(this.bucket(entry, 'document'));
    this.images.set(this.bucket(entry, 'image'));
    this.videos.set(this.bucket(entry, 'video'));
    this.audios.set(this.bucket(entry, 'audio'));
  }

  private bucket(entry: DevLogEntry | null, type: DevLogMediaType): DevLogMediaFormItem[] {
    return (entry?.media ?? [])
      .filter((item) => item.type === type)
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((item) => ({
        key: this.newKeyValue(),
        type,
        titleEs: item.titleEs,
        titleEn: item.titleEn,
        bodyEs: item.bodyEs ?? null,
        bodyEn: item.bodyEn ?? null,
        filePath: item.filePath,
        fileName: item.fileName,
        contentType: item.contentType ?? null,
        sizeBytes: item.sizeBytes ?? null,
        previewUrl: devLogFileUrl(item.filePath) ?? '',
        existingId: item.id,
        active: item.status,
      }));
  }

  private toRequest(): SaveDevLogEntryRequest {
    const value = this.form.getRawValue();
    const media: DevLogEntryMediaRequest[] = [
      ...this.documents(),
      ...this.images(),
      ...this.videos(),
      ...this.audios(),
    ].map((item, index) => ({
      id: item.existingId,
      type: item.type,
      titleEs: item.titleEs,
      titleEn: item.titleEn,
      bodyEs: item.bodyEs,
      bodyEn: item.bodyEn,
      filePath: item.filePath,
      fileName: item.fileName,
      contentType: item.contentType,
      sizeBytes: item.sizeBytes,
      sortOrder: index,
      status: item.active,
    }));

    return {
      titleEs: value.titleEs.trim(),
      titleEn: value.titleEn.trim(),
      descriptionEs: value.descriptionEs.trim(),
      descriptionEn: value.descriptionEn.trim(),
      bodyEs: value.bodyEs,
      bodyEn: value.bodyEn,
      titleDesign: value.titleDesign,
      displayDate: value.displayDate!,
      isFeatured: value.isFeatured,
      coverImagePath: value.coverImagePath!,
      coverFileName: value.coverFileName!,
      listCoverImagePath: value.listCoverImagePath!,
      listCoverFileName: value.listCoverFileName!,
      categoryIds: value.categoryIds,
      media,
    };
  }

  private run<T>(request: Observable<ApiResponse<T>>): Observable<ApiResponse<T>> {
    return request.pipe(
      catchApiError(this.texts().connectionError, this.language()),
      takeUntilDestroyed(this.destroyRef),
    );
  }
}
