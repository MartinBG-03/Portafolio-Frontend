import { booleanAttribute, Component, computed, input, output } from '@angular/core';
import { formatFileSize } from '../../../utils/format-file-size';
import { localized } from '../../../utils/localized';
import { AD_MEDIA_KIND_ICONS, AD_MEDIA_LIST_TEXTS } from '../../constants/ad-media.constants';
import { AdMediaActiveChange, AdMediaItem, AdMediaMove } from '../../interfaces/ad-media.interface';
import { AdBadge } from '../ad-badge/ad-badge';
import { AdIcon } from '../ad-icon/ad-icon';
import { AdIconButton } from '../ad-icon-button/ad-icon-button';
import { AdSwitch } from '../ad-switch/ad-switch';

@Component({
  selector: 'ad-media-list',
  imports: [AdIcon, AdIconButton, AdSwitch, AdBadge],
  templateUrl: './ad-media-list.html',
  styleUrl: './ad-media-list.scss',
})
export class AdMediaList {
  readonly items = input.required<readonly AdMediaItem[]>();
  readonly removable = input(true, { transform: booleanAttribute });
  readonly reorderable = input(true, { transform: booleanAttribute });
  readonly toggleable = input(false, { transform: booleanAttribute });
  readonly emptyText = input<string>();

  readonly removed = output<string>();
  readonly moved = output<AdMediaMove>();
  readonly activeChange = output<AdMediaActiveChange>();

  protected readonly texts = localized(AD_MEDIA_LIST_TEXTS);
  protected readonly emptyMessage = computed(() => this.emptyText() ?? this.texts().empty);
  protected readonly icons = AD_MEDIA_KIND_ICONS;
  protected readonly formatSize = formatFileSize;
}
