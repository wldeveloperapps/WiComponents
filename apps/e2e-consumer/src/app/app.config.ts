import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideWiCalendarI18n } from '@wiloc/ui/forms';
import { provideWiIcons } from '@wiloc/ui/icon';
import {
  calendarOutline,
  funnelOutline,
  moonOutline,
  plusOutline,
  sunOutline,
  trashOutline,
} from '@wiloc/ui/icon/heroicons';

import { routes } from './app.routes';
import { createCalendarI18n } from './locale';

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
    }),
    provideWiCalendarI18n(createCalendarI18n()),
  ],
};
