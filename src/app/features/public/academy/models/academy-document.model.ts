import { Localized } from '../../../../core/public/i18n/language';

export interface AcademyDocument {
  readonly id: string;
  readonly date: string;
  readonly pages: number;
  readonly href: string;
  readonly title: Localized;
  readonly description: Localized;
}
