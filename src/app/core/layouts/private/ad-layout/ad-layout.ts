import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { adNavigation } from '../../../private/config/ad-navigation';
import { AdLoadingBar } from '../../../../shared/private/components/ad-loading-bar/ad-loading-bar';
import { AdToastStack } from '../../../../shared/private/components/ad-toast-stack/ad-toast-stack';
import { AdNavbar } from '../components/ad-navbar/ad-navbar';

@Component({
  selector: 'ad-layout',
  imports: [RouterOutlet, AdNavbar, AdToastStack, AdLoadingBar],
  templateUrl: './ad-layout.html',
  styleUrl: './ad-layout.scss',
})
export class AdLayout {
  protected readonly modules = adNavigation;
}
