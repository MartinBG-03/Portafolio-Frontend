import { Component, computed, inject } from '@angular/core';
import { LanguageService } from '../../../../../core/public/services/language.service';
import { formatDate } from '../../../../../core/public/utils/format-date';
import { PbButton } from '../../../../../shared/public/components/pb-button/pb-button';
import { PbSpacedHeading } from '../../../../../shared/public/components/pb-spaced-heading/pb-spaced-heading';
import { PbDocumentCard } from '../../../academy/components/pb-document-card/pb-document-card';
import { ACADEMY_DOCUMENTS } from '../../../academy/data/academy.data';

const LISTED_DOCUMENTS = 3;

@Component({
  selector: 'pb-home-documents',
  imports: [PbSpacedHeading, PbDocumentCard, PbButton],
  templateUrl: './pb-home-documents.html',
  styleUrl: './pb-home-documents.scss',
})
export class PbHomeDocuments {
  private readonly languageService = inject(LanguageService);

  protected readonly t = this.languageService.t;

  protected readonly documents = computed(() => {
    const language = this.languageService.language();
    const documents = this.t().home.documents;

    return ACADEMY_DOCUMENTS.slice(0, LISTED_DOCUMENTS).map((document) => ({
      id: document.id,
      href: document.href,
      title: document.title[language],
      description: document.description[language],
      meta: `${formatDate(document.date, language)} · ${document.pages} ${
        document.pages === 1 ? documents.page : documents.pages
      }`,
    }));
  });
}
