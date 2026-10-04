import { Component } from '@angular/core';
import { PbHomeBento } from '../../components/pb-home-bento/pb-home-bento';
import { PbHomeContact } from '../../components/pb-home-contact/pb-home-contact';
import { PbHomeDocuments } from '../../components/pb-home-documents/pb-home-documents';
import { PbHomeHero } from '../../components/pb-home-hero/pb-home-hero';
import { PbHomeLatest } from '../../components/pb-home-latest/pb-home-latest';
import { PbHomeProcess } from '../../components/pb-home-process/pb-home-process';
import { PbHomeProjects } from '../../components/pb-home-projects/pb-home-projects';
import { PbHomeWhy } from '../../components/pb-home-why/pb-home-why';

@Component({
  selector: 'pb-home-page',
  imports: [
    PbHomeHero,
    PbHomeBento,
    PbHomeProjects,
    PbHomeLatest,
    PbHomeDocuments,
    PbHomeProcess,
    PbHomeWhy,
    PbHomeContact,
  ],
  templateUrl: './home-page.html',
})
export class HomePage {}
