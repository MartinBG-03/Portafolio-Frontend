import { AdAlertTone } from '../components/ad-alert/ad-alert';

export interface AdToastOptions {
  readonly tone: AdAlertTone;
  readonly heading: string;
  readonly message: string;
  readonly duration?: number;
}

export interface AdToast {
  readonly id: number;
  readonly tone: AdAlertTone;
  readonly heading: string;
  readonly message: string;
}
