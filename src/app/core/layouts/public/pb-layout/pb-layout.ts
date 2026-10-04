import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PbToastOutlet } from '../../../../shared/public/components/pb-toast-outlet/pb-toast-outlet';
import { PbFooter } from '../components/pb-footer/pb-footer';
import { PbHeader } from '../components/pb-header/pb-header';

@Component({
  selector: 'pb-layout',
  imports: [RouterOutlet, PbHeader, PbFooter, PbToastOutlet],
  templateUrl: './pb-layout.html',
  styleUrl: './pb-layout.scss',
})
export class PbLayout {}
