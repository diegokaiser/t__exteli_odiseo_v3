import {
  UAParser,
  type IBrowser,
  type ICPU,
  type IDevice,
  type IEngine,
  type IOS,
} from 'ua-parser-js';

export type UserData = {
  ua: string;
  browser: IBrowser;
  os: IOS;
  device: IDevice;
  engine: IEngine;
  cpu: ICPU;
  locale?: string;
  platform?: string;
  timeZone?: string;
  screen?: { width: number; height: number; pixelRatio: number };
  touchPoints?: number;
};

export const getUserData = (): UserData | null => {
  if (typeof window === 'undefined') return null;

  const parser = new UAParser(window.navigator.userAgent);

  return {
    ua: window.navigator.userAgent,
    browser: parser.getBrowser(),
    os: parser.getOS(),
    device: parser.getDevice(),
    engine: parser.getEngine(),
    cpu: parser.getCPU(),
    locale: window.navigator.language,
    platform: window.navigator.platform,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screen: {
      width: window.screen.width,
      height: window.screen.height,
      pixelRatio: window.devicePixelRatio ?? 1,
    },
    touchPoints: window.navigator.maxTouchPoints ?? 0,
  };
};
