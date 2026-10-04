import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, EMPTY, Observable, of, switchMap } from 'rxjs';
import { ApiResponse } from '../../../../../core/models/api-response.interface';
import { AD_NAVIGATION_TEXTS } from '../../../../../core/private/i18n/ad-navigation-texts';
import { LanguageService } from '../../../../../core/public/services/language.service';
import { Icon } from '../../../../../shared/components/icon/icon';
import { toIconName } from '../../../../../shared/components/icon/icon-registry';
import { AdBadge } from '../../../../../shared/private/components/ad-badge/ad-badge';
import { AdButton } from '../../../../../shared/private/components/ad-button/ad-button';
import { AdConfirmDialog } from '../../../../../shared/private/components/ad-confirm-dialog/ad-confirm-dialog';
import { AdFormSection } from '../../../../../shared/private/components/ad-form-section/ad-form-section';
import { AdIcon } from '../../../../../shared/private/components/ad-icon/ad-icon';
import { AdMenu } from '../../../../../shared/private/components/ad-menu/ad-menu';
import { AdPageHeader } from '../../../../../shared/private/components/ad-page-header/ad-page-header';
import { AdSwitch } from '../../../../../shared/private/components/ad-switch/ad-switch';
import { AdMenuItem } from '../../../../../shared/private/interfaces/ad-menu.interface';
import { AdToastService } from '../../../../../shared/private/services/ad-toast.service';
import { catchApiError } from '../../../../../shared/utils/catch-api-error';
import { localized } from '../../../../../shared/utils/localized';
import { FooterLinkFormDialog } from '../../components/footer/footer-link-form-dialog/footer-link-form-dialog';
import { GameThemeFormDialog } from '../../components/footer/game-theme-form-dialog/game-theme-form-dialog';
import { GameThemePreview } from '../../components/footer/game-theme-preview/game-theme-preview';
import { SocialLinkFormDialog } from '../../components/footer/social-link-form-dialog/social-link-form-dialog';
import {
  FOOTER_LINK_CONFIRMATIONS,
  FOOTER_ROW_ACTION,
  FOOTER_ROW_ACTION_ITEMS,
  FOOTER_SOCIAL_CONFIRMATIONS,
  FooterConfirmableAction,
} from '../../constants/footer/footer-actions.constants';
import {
  FOOTER_LINK_ERROR_HEADINGS,
  FOOTER_LINK_SUCCESS_FEEDBACK,
  FOOTER_SOCIAL_ERROR_HEADINGS,
  FOOTER_SOCIAL_SUCCESS_FEEDBACK,
  GAME_FEEDBACK_TEXTS,
} from '../../constants/footer/footer-feedback.constants';
import { FOOTER_PAGE_TEXTS } from '../../constants/footer/footer-texts.constants';
import { GAME_THEME_TEXTS } from '../../constants/footer/game-theme.constants';
import { ROUTE_KEY_TEXTS } from '../../constants/footer/route-key.constants';
import {
  SaveFooterLinkRequest,
  SaveSocialLinkRequest,
  UpdateGameThemeRequest,
} from '../../interfaces/footer/footer-request.interface';
import {
  FooterLink,
  GameSettings,
  GameTheme,
  SocialLink,
  SocialPlatformOption,
} from '../../interfaces/footer/footer.interface';
import { FooterLinkService } from '../../services/footer/footer-link.service';
import { FooterGameThemeService } from '../../services/footer/footer-game-theme.service';
import { GameSettingsService } from '../../services/footer/game-settings.service';
import { SocialLinkService } from '../../services/footer/social-link.service';

interface PendingLinkAction {
  readonly action: FooterConfirmableAction;
  readonly link: FooterLink;
}

interface PendingSocialAction {
  readonly action: FooterConfirmableAction;
  readonly social: SocialLink;
}

@Component({
  selector: 'ad-site-footer-page',
  imports: [
    AdPageHeader,
    AdFormSection,
    AdButton,
    AdIcon,
    AdBadge,
    AdMenu,
    AdSwitch,
    AdConfirmDialog,
    Icon,
    FooterLinkFormDialog,
    SocialLinkFormDialog,
    GameThemeFormDialog,
    GameThemePreview,
  ],
  templateUrl: './site-footer-page.html',
  styleUrl: './site-footer-page.scss',
})
export class SiteFooterPage {
  private readonly footerLinkService = inject(FooterLinkService);
  private readonly socialLinkService = inject(SocialLinkService);
  private readonly gameSettingsService = inject(GameSettingsService);
  private readonly gameThemeService = inject(FooterGameThemeService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toast = inject(AdToastService);

  protected readonly language = inject(LanguageService).language;
  protected readonly toIconName = toIconName;

  protected readonly nav = localized(AD_NAVIGATION_TEXTS);
  protected readonly texts = localized(FOOTER_PAGE_TEXTS);
  protected readonly routeKeyTexts = localized(ROUTE_KEY_TEXTS);
  protected readonly gameThemeTexts = localized(GAME_THEME_TEXTS);
  protected readonly rowActionItems = localized(FOOTER_ROW_ACTION_ITEMS);
  private readonly linkConfirmations = localized(FOOTER_LINK_CONFIRMATIONS);
  private readonly socialConfirmations = localized(FOOTER_SOCIAL_CONFIRMATIONS);
  private readonly linkSuccessFeedback = localized(FOOTER_LINK_SUCCESS_FEEDBACK);
  private readonly linkErrorHeadings = localized(FOOTER_LINK_ERROR_HEADINGS);
  private readonly socialSuccessFeedback = localized(FOOTER_SOCIAL_SUCCESS_FEEDBACK);
  private readonly socialErrorHeadings = localized(FOOTER_SOCIAL_ERROR_HEADINGS);
  private readonly gameFeedback = localized(GAME_FEEDBACK_TEXTS);

  private readonly reloadLinksTick = signal(0);
  private readonly reloadSocialsTick = signal(0);
  private readonly reloadGameTick = signal(0);

  protected readonly links = toSignal(
    combineLatest([toObservable(this.reloadLinksTick), toObservable(this.language)]).pipe(
      switchMap(() =>
        this.fetchList(this.footerLinkService.list(), this.linkErrorHeadings().list),
      ),
    ),
    { initialValue: [] as readonly FooterLink[] },
  );

  protected readonly socials = toSignal(
    combineLatest([toObservable(this.reloadSocialsTick), toObservable(this.language)]).pipe(
      switchMap(() =>
        this.fetchList(this.socialLinkService.list(), this.socialErrorHeadings().list),
      ),
    ),
    { initialValue: [] as readonly SocialLink[] },
  );

  protected readonly gameSettings = toSignal(
    combineLatest([toObservable(this.reloadGameTick), toObservable(this.language)]).pipe(
      switchMap(() =>
        this.fetchSingle(this.gameSettingsService.get(), this.gameFeedback().settingsLoadError),
      ),
    ),
    { initialValue: null as GameSettings | null },
  );

  protected readonly gameThemes = toSignal(
    combineLatest([toObservable(this.reloadGameTick), toObservable(this.language)]).pipe(
      switchMap(() =>
        this.fetchList(this.gameThemeService.list(), this.gameFeedback().themesLoadError),
      ),
    ),
    { initialValue: [] as readonly GameTheme[] },
  );

  protected readonly usedRouteKeys = computed(() => this.links().map((link) => link.routeKey));
  protected readonly usedCatalogIds = computed(() => this.socials().map((social) => social.catalogId));

  protected readonly platformOptions = toSignal(
    this.fetchList(this.socialLinkService.getPlatformOptions(), this.socialErrorHeadings().list),
    { initialValue: [] as readonly SocialPlatformOption[] },
  );

  protected readonly linkFormOpen = signal(false);
  protected readonly editingLink = signal<FooterLink | null>(null);

  protected readonly socialFormOpen = signal(false);
  protected readonly editingSocial = signal<SocialLink | null>(null);

  protected readonly themeFormOpen = signal(false);
  protected readonly editingTheme = signal<GameTheme | null>(null);

  protected readonly linkConfirmOpen = signal(false);
  protected readonly pendingLink = signal<PendingLinkAction | null>(null);

  protected readonly socialConfirmOpen = signal(false);
  protected readonly pendingSocial = signal<PendingSocialAction | null>(null);

  protected linkRowActions(link: FooterLink): readonly AdMenuItem[] {
    const items = this.rowActionItems();
    return link.status ? [items.edit, items.delete, items.deactivate] : [items.edit, items.activate];
  }

  protected socialRowActions(social: SocialLink): readonly AdMenuItem[] {
    const items = this.rowActionItems();
    return social.status ? [items.edit, items.delete, items.deactivate] : [items.edit, items.activate];
  }

  protected openCreateLink(): void {
    this.editingLink.set(null);
    this.linkFormOpen.set(true);
  }

  protected openEditLink(link: FooterLink): void {
    this.editingLink.set(link);
    this.linkFormOpen.set(true);
  }

  protected onLinkRowAction(link: FooterLink, key: string): void {
    if (key === FOOTER_ROW_ACTION.edit) {
      this.openEditLink(link);
      return;
    }
    this.pendingLink.set({ action: key as FooterConfirmableAction, link });
    this.linkConfirmOpen.set(true);
  }

  protected saveLink(request: SaveFooterLinkRequest): void {
    const editing = this.editingLink();
    const kind = editing ? 'update' : 'create';
    const operation = editing
      ? this.footerLinkService.update(editing.id, request)
      : this.footerLinkService.create(request);

    this.run(operation).subscribe((response) => {
      if (response.isSuccess) {
        const success = this.linkSuccessFeedback()[kind];
        this.linkFormOpen.set(false);
        this.toast.success(success.heading, success.message(this.routeKeyTexts()[request.routeKey]));
        this.reloadLinksTick.update((tick) => tick + 1);
      } else {
        this.toast.error(this.linkErrorHeadings()[kind], response.message ?? '');
      }
    });
  }

  protected confirmLinkAction(): void {
    const pending = this.pendingLink();
    if (!pending) {
      return;
    }
    const { action, link } = pending;
    const operation =
      action === FOOTER_ROW_ACTION.delete
        ? this.footerLinkService.delete(link.id)
        : this.footerLinkService.changeStatus(link.id, action === FOOTER_ROW_ACTION.activate);

    this.pendingLink.set(null);
    this.run(operation).subscribe((response) => {
      const name = this.routeKeyTexts()[link.routeKey];
      if (response.isSuccess) {
        const success = this.linkSuccessFeedback()[action];
        this.toast.success(success.heading, success.message(name));
        this.reloadLinksTick.update((tick) => tick + 1);
      } else {
        this.toast.error(this.linkErrorHeadings()[action], response.message ?? '');
      }
    });
  }

  protected linkConfirmation() {
    const pending = this.pendingLink();
    return pending ? this.linkConfirmations()[pending.action] : null;
  }

  protected linkConfirmationMessage(): string {
    const pending = this.pendingLink();
    return pending
      ? this.linkConfirmations()[pending.action].message(this.routeKeyTexts()[pending.link.routeKey])
      : '';
  }

  protected openCreateSocial(): void {
    this.editingSocial.set(null);
    this.socialFormOpen.set(true);
  }

  protected openEditSocial(social: SocialLink): void {
    this.editingSocial.set(social);
    this.socialFormOpen.set(true);
  }

  protected onSocialRowAction(social: SocialLink, key: string): void {
    if (key === FOOTER_ROW_ACTION.edit) {
      this.openEditSocial(social);
      return;
    }
    this.pendingSocial.set({ action: key as FooterConfirmableAction, social });
    this.socialConfirmOpen.set(true);
  }

  protected saveSocial(request: SaveSocialLinkRequest): void {
    const editing = this.editingSocial();
    const kind = editing ? 'update' : 'create';
    const operation = editing
      ? this.socialLinkService.update(editing.id, request)
      : this.socialLinkService.create(request);

    const platform = this.platformOptions().find((option) => option.id === request.catalogId);
    const name = platform ? (this.language() === 'en' ? platform.nameEn : platform.nameEs) : '';

    this.run(operation).subscribe((response) => {
      if (response.isSuccess) {
        const success = this.socialSuccessFeedback()[kind];
        this.socialFormOpen.set(false);
        this.toast.success(success.heading, success.message(name));
        this.reloadSocialsTick.update((tick) => tick + 1);
      } else {
        this.toast.error(this.socialErrorHeadings()[kind], response.message ?? '');
      }
    });
  }

  protected confirmSocialAction(): void {
    const pending = this.pendingSocial();
    if (!pending) {
      return;
    }
    const { action, social } = pending;
    const operation =
      action === FOOTER_ROW_ACTION.delete
        ? this.socialLinkService.delete(social.id)
        : this.socialLinkService.changeStatus(social.id, action === FOOTER_ROW_ACTION.activate);

    this.pendingSocial.set(null);
    this.run(operation).subscribe((response) => {
      const name = this.language() === 'en' ? social.platformNameEn : social.platformNameEs;
      if (response.isSuccess) {
        const success = this.socialSuccessFeedback()[action];
        this.toast.success(success.heading, success.message(name));
        this.reloadSocialsTick.update((tick) => tick + 1);
      } else {
        this.toast.error(this.socialErrorHeadings()[action], response.message ?? '');
      }
    });
  }

  protected socialConfirmation() {
    const pending = this.pendingSocial();
    return pending ? this.socialConfirmations()[pending.action] : null;
  }

  protected socialConfirmationMessage(): string {
    const pending = this.pendingSocial();
    if (!pending) {
      return '';
    }
    const name = this.language() === 'en' ? pending.social.platformNameEn : pending.social.platformNameEs;
    return this.socialConfirmations()[pending.action].message(name);
  }

  protected toggleGameVisible(isVisible: boolean): void {
    this.run(this.gameSettingsService.update({ isVisible })).subscribe(
      (response) => {
        if (response.isSuccess) {
          this.toast.success(this.texts().gameSection, this.gameFeedback().settingsUpdated);
          this.reloadGameTick.update((tick) => tick + 1);
        } else {
          this.toast.error(this.gameFeedback().settingsUpdateError, response.message ?? '');
        }
      },
    );
  }

  protected openEditTheme(theme: GameTheme): void {
    this.editingTheme.set(theme);
    this.themeFormOpen.set(true);
  }

  protected saveTheme(request: UpdateGameThemeRequest): void {
    const editing = this.editingTheme();
    if (!editing) {
      return;
    }

    this.run(this.gameThemeService.update(editing.id, request)).subscribe(
      (response) => {
        if (response.isSuccess) {
          this.themeFormOpen.set(false);
          this.toast.success(
            this.texts().gameSection,
            this.gameFeedback().themeUpdated(this.gameThemeTexts()[editing.theme]),
          );
          this.reloadGameTick.update((tick) => tick + 1);
        } else {
          this.toast.error(this.gameFeedback().themeUpdateError, response.message ?? '');
        }
      },
    );
  }

  private run<T>(request: Observable<ApiResponse<T>>): Observable<ApiResponse<T>> {
    return request.pipe(
      catchApiError(this.texts().connectionError, this.language()),
      takeUntilDestroyed(this.destroyRef),
    );
  }

  private fetchList<T>(
    request: Observable<ApiResponse<readonly T[]>>,
    errorHeading: string,
  ): Observable<readonly T[]> {
    return this.run(request).pipe(
      switchMap((response) => {
        if (!response.isSuccess || !response.data) {
          this.toast.error(errorHeading, response.message ?? '');
          return EMPTY;
        }
        return of(response.data);
      }),
    );
  }

  private fetchSingle<T>(request: Observable<ApiResponse<T>>, errorHeading: string): Observable<T | null> {
    return this.run(request).pipe(
      switchMap((response) => {
        if (!response.isSuccess || response.data === undefined) {
          this.toast.error(errorHeading, response.message ?? '');
          return EMPTY;
        }
        return of(response.data);
      }),
    );
  }
}
