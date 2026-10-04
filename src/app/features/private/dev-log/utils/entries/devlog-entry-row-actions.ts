import { AdMenuItem } from '../../../../../shared/private/interfaces/ad-menu.interface';
import { DevLogEntryRowActionItems } from '../../constants/entries/devlog-entry-actions.constants';
import { DevLogEntrySummary } from '../../interfaces/entries/devlog-entry.interface';

export function devLogEntryRowActions(
  entry: DevLogEntrySummary,
  items: DevLogEntryRowActionItems,
): readonly AdMenuItem[] {
  if (!entry.status) {
    return [items.feature, items.edit, items.activate];
  }

  return [items.feature, items.edit, items.delete, items.deactivate];
}
