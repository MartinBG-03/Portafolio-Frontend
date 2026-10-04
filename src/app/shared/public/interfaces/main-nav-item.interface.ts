export interface NavMenuLink {
  readonly label: string;
  readonly path: string;
  readonly queryParams?: Readonly<Record<string, string>>;
}

export interface NavMenuPreview {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly tone: string;
  readonly path: string;
  readonly queryParams?: Readonly<Record<string, string>>;
}

export interface NavMenuAction {
  readonly label: string;
  readonly href: string;
  readonly download?: boolean;
  readonly variant: 'primary' | 'secondary';
}

export interface NavMenuTimelineEntry {
  readonly period: string;
  readonly title: string;
  readonly description: string;
}

export interface NavMenuChipGroup {
  readonly title: string;
  readonly items: readonly string[];
}

export interface NavMenuProjectsPanel {
  readonly kind: 'projects';
  readonly items: readonly NavMenuPreview[];
  readonly imageLabel: string;
  readonly emptyLabel: string;
}

export interface NavMenuStoryPanel {
  readonly kind: 'story';
  readonly photoLabel: string;
  readonly quote: string;
  readonly description: string;
  readonly actions: readonly NavMenuAction[];
}

export interface NavMenuTimelinePanel {
  readonly kind: 'timeline';
  readonly entries: readonly NavMenuTimelineEntry[];
}

export interface NavMenuChipsPanel {
  readonly kind: 'chips';
  readonly groups: readonly NavMenuChipGroup[];
}

export type NavMenuPanel =
  | NavMenuProjectsPanel
  | NavMenuStoryPanel
  | NavMenuTimelinePanel
  | NavMenuChipsPanel;

export interface NavMenuCategory {
  readonly id: string;
  readonly title: string;
  readonly count?: number;
  readonly path: string;
  readonly queryParams?: Readonly<Record<string, string>>;
  readonly more: NavMenuLink;
  readonly panel: NavMenuPanel;
}

export interface NavMenu {
  readonly categories: readonly NavMenuCategory[];
}

export interface MainNavItem {
  readonly id: string;
  readonly label: string;
  readonly path: string;
  readonly exact?: boolean;
  readonly menu?: NavMenu;
}
