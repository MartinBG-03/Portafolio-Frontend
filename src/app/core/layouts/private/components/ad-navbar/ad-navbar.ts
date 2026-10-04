import {
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map } from 'rxjs';
import { siteConfig } from '../../../../config/site.config';
import { AD_NAVIGATION_TEXTS } from '../../../../private/i18n/ad-navigation-texts';
import { ThemeService } from '../../../../public/services/theme.service';
import { localized } from '../../../../../shared/utils/localized';
import { PbLanguageSwitch } from '../../../../../shared/public/components/pb-language-switch/pb-language-switch';
import { PbThemeToggle } from '../../../../../shared/public/components/pb-theme-toggle/pb-theme-toggle';
import { adProfile } from '../../../../private/config/ad-profile';
import { findAdModule } from '../../../../private/config/ad-navigation';
import { AuthService } from '../../../../private/services/auth.service';
import { AdNavModule } from '../../../../../shared/private/interfaces/ad-nav.interface';
import { AdIcon } from '../../../../../shared/private/components/ad-icon/ad-icon';
import { AdTooltipDirective } from '../../../../../shared/private/directives/ad-tooltip.directive';

const LOGO_FOR_LIGHT_MODE = 'images/admin/logos/logo-oscuro.png';
const LOGO_FOR_DARK_MODE = 'images/public/logos/logo-light.png';

@Component({
  selector: 'ad-navbar',
  imports: [
    RouterLink,
    RouterLinkActive,
    AdIcon,
    AdTooltipDirective,
    PbLanguageSwitch,
    PbThemeToggle,
  ],
  templateUrl: './ad-navbar.html',
  styleUrl: './ad-navbar.scss',
  host: {
    '(document:keydown.escape)': 'collapse()',
  },
})
export class AdNavbar {
  private readonly router = inject(Router);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly themeService = inject(ThemeService);
  private readonly authService = inject(AuthService);

  readonly modules = input.required<readonly AdNavModule[]>();

  protected readonly siteName = siteConfig.name;
  protected readonly texts = localized(AD_NAVIGATION_TEXTS);
  protected readonly logo = computed(() =>
    this.themeService.isDark() ? LOGO_FOR_DARK_MODE : LOGO_FOR_LIGHT_MODE,
  );

  protected readonly displayName = computed(() => {
    const user = this.authService.currentUser();
    return user ? `${user.firstName} ${user.lastName}` : adProfile.name;
  });
  protected readonly photo = computed(() => this.authService.currentUser()?.profilePhotoUrl ?? adProfile.photo);
  protected readonly initials = computed(() =>
    this.displayName()
      .split(/\s+/)
      .map((word) => word.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase(),
  );

  protected readonly profileMenuOpen = signal(false);

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  protected readonly activePath = computed(() => findAdModule(this.url())?.path ?? null);

  private readonly openPath = signal<string | null>(null);

  protected readonly openModule = computed(() =>
    this.modules().find((module) => module.path === this.openPath()),
  );

  constructor() {
    effect(() => {
      const url = this.url();
      const module = findAdModule(url);
      const childPath = url.split(/[?#]/)[0].split('/')[3];
      untracked(() => this.openPath.set(module?.path ?? null));
      afterNextRender(
        () =>
          this.host.nativeElement
            .querySelector<HTMLElement>(`.ad-navbar__child-link[data-path="${childPath}"]`)
            ?.scrollIntoView({ block: 'nearest', inline: 'center' }),
        { injector: this.injector },
      );
    });
  }

  protected expand(path: string): void {
    this.openPath.set(path);
    afterNextRender(
      () => this.host.nativeElement.querySelector<HTMLElement>('.ad-navbar__child-link')?.focus(),
      { injector: this.injector },
    );
  }

  protected collapse(): void {
    this.profileMenuOpen.set(false);

    const path = this.openPath();
    if (path === null) {
      return;
    }
    this.openPath.set(null);
    afterNextRender(
      () =>
        this.host.nativeElement
          .querySelector<HTMLElement>(`.ad-navbar__module[data-path="${path}"]`)
          ?.focus(),
      { injector: this.injector },
    );
  }

  protected toggleProfileMenu(): void {
    this.profileMenuOpen.update((open) => !open);
  }

  protected logout(): void {
    this.profileMenuOpen.set(false);
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
