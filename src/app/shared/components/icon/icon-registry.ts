import arrowDown from '../../../../assets/icons/public/arrow-down.svg';
import arrowLeft from '../../../../assets/icons/public/arrow-left.svg';
import arrowRight from '../../../../assets/icons/public/arrow-right.svg';
import arrowUp from '../../../../assets/icons/public/arrow-up.svg';
import checkCircle from '../../../../assets/icons/public/check-circle.svg';
import chevronLeft from '../../../../assets/icons/public/chevron-left.svg';
import chevronRight from '../../../../assets/icons/public/chevron-right.svg';
import close from '../../../../assets/icons/public/close.svg';
import code from '../../../../assets/icons/public/code.svg';
import dots from '../../../../assets/icons/public/dots.svg';
import download from '../../../../assets/icons/public/download.svg';
import errorCircle from '../../../../assets/icons/public/error-circle.svg';
import globe from '../../../../assets/icons/public/globe.svg';
import hamburger from '../../../../assets/icons/public/hamburger.svg';
import infoCircle from '../../../../assets/icons/public/info-circle.svg';
import link from '../../../../assets/icons/public/link.svg';
import linkedin from '../../../../assets/icons/public/linkedin.svg';
import magnifer from '../../../../assets/icons/public/magnifer.svg';
import mail from '../../../../assets/icons/public/mail.svg';
import moon from '../../../../assets/icons/public/moon.svg';
import share from '../../../../assets/icons/public/share.svg';
import suitcase from '../../../../assets/icons/public/suitcase.svg';
import sun from '../../../../assets/icons/public/sun.svg';
import user from '../../../../assets/icons/public/user.svg';
import warningCircle from '../../../../assets/icons/public/warning-circle.svg';
import whatsapp from '../../../../assets/icons/public/whatsapp.svg';
import x from '../../../../assets/icons/public/x.svg';
import chevronDown from '../../../../assets/icons/public/chevron-down.svg';
import expand from '../../../../assets/icons/public/expand.svg';
import eye from '../../../../assets/icons/public/eye.svg';
import forward from '../../../../assets/icons/public/forward.svg';
import pause from '../../../../assets/icons/public/pause.svg';
import play from '../../../../assets/icons/public/play.svg';
import rewind from '../../../../assets/icons/public/rewind.svg';
import volume from '../../../../assets/icons/public/volume.svg';
import volumeMute from '../../../../assets/icons/public/volume-mute.svg';
import { normalizeSvg } from '../../utils/normalize-svg';

export const ICONS = {
  'arrow-down': normalizeSvg(arrowDown),
  'arrow-left': normalizeSvg(arrowLeft),
  'arrow-right': normalizeSvg(arrowRight),
  'arrow-up': normalizeSvg(arrowUp),
  'check-circle': normalizeSvg(checkCircle),
  'chevron-left': normalizeSvg(chevronLeft),
  'chevron-right': normalizeSvg(chevronRight),
  close: normalizeSvg(close),
  code: normalizeSvg(code),
  dots: normalizeSvg(dots),
  download: normalizeSvg(download),
  'error-circle': normalizeSvg(errorCircle),
  globe: normalizeSvg(globe),
  hamburger: normalizeSvg(hamburger),
  'info-circle': normalizeSvg(infoCircle),
  link: normalizeSvg(link),
  linkedin: normalizeSvg(linkedin),
  magnifer: normalizeSvg(magnifer),
  mail: normalizeSvg(mail),
  moon: normalizeSvg(moon),
  share: normalizeSvg(share),
  suitcase: normalizeSvg(suitcase),
  sun: normalizeSvg(sun),
  user: normalizeSvg(user),
  'warning-circle': normalizeSvg(warningCircle),
  whatsapp: normalizeSvg(whatsapp),
  x: normalizeSvg(x),
  'chevron-down': normalizeSvg(chevronDown),
  expand: normalizeSvg(expand),
  eye: normalizeSvg(eye),
  forward: normalizeSvg(forward),
  pause: normalizeSvg(pause),
  play: normalizeSvg(play),
  rewind: normalizeSvg(rewind),
  volume: normalizeSvg(volume),
  'volume-mute': normalizeSvg(volumeMute),
} as const;

export type IconName = keyof typeof ICONS;

export function toIconName(code: string): IconName | null {
  const lower = code.toLowerCase();
  return lower in ICONS ? (lower as IconName) : null;
}
