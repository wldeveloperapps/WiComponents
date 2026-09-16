import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideWiDataDisplayI18n } from '@wldeveloperapps/ui/data-display';
import { provideWiCalendarI18n, provideWiTimeZone } from '@wldeveloperapps/ui/forms';
import { provideWiIcons } from '@wldeveloperapps/ui/icon';
import { provideWiOverlaysI18n } from '@wldeveloperapps/ui/overlays';
import {
  calendarOutline,
  funnelOutline,
  homeOutline,
  keyOutline,
  listBulletOutline,
  moonOutline,
  plusOutline,
  squares2x2Outline,
  sunOutline,
  trashOutline,
  userOutline,
  xMarkOutline,
} from '@wldeveloperapps/ui/icon/heroicons';

import { routes } from './app.routes';
import { createCalendarI18n, createDataDisplayI18n, createOverlaysI18n } from './locale';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideWiIcons({
      calendar: { outline: calendarOutline },
      funnel: { outline: funnelOutline },
      home: { outline: homeOutline },
      key: { outline: keyOutline },
      'list-bullet': { outline: listBulletOutline },
      moon: { outline: moonOutline },
      plus: { outline: plusOutline },
      'squares-2x2': { outline: squares2x2Outline },
      sun: { outline: sunOutline },
      trash: { outline: trashOutline },
      user: { outline: userOutline },
      'x-mark': { outline: xMarkOutline },
    }),
    provideWiCalendarI18n(createCalendarI18n()),
    provideWiTimeZone('Europe/Madrid'),
    provideWiDataDisplayI18n(createDataDisplayI18n()),
    provideWiOverlaysI18n(createOverlaysI18n()),
  ],
};
