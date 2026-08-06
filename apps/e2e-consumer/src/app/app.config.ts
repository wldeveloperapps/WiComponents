import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideWiDataDisplayI18n } from '@wiloc/ui/data-display';
import { provideWiCalendarI18n } from '@wiloc/ui/forms';
import { provideWiIcons } from '@wiloc/ui/icon';
import { provideWiOverlaysI18n } from '@wiloc/ui/overlays';
import {
  calendarOutline,
  funnelOutline,
  moonOutline,
  plusOutline,
  sunOutline,
  trashOutline,
  xMarkOutline,
} from '@wiloc/ui/icon/heroicons';

import { routes } from './app.routes';
import { createCalendarI18n, createDataDisplayI18n, createOverlaysI18n } from './locale';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideWiIcons({
      calendar: { outline: calendarOutline },
      funnel: { outline: funnelOutline },
      moon: { outline: moonOutline },
      plus: { outline: plusOutline },
      sun: { outline: sunOutline },
      trash: { outline: trashOutline },
      'x-mark': { outline: xMarkOutline },
    }),
    provideWiCalendarI18n(createCalendarI18n()),
    provideWiDataDisplayI18n(createDataDisplayI18n()),
    provideWiOverlaysI18n(createOverlaysI18n()),
  ],
};
