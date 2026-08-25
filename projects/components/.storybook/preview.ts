import type { Preview } from '@storybook/angular-vite';
import { applicationConfig } from '@storybook/angular-vite';
import { setCompodocJson } from '@storybook/addon-docs/angular';
import docJson from '../documentation.json';
import { WI_DARK_CLASS } from '../core/src/wi-theme';
import { provideWiDataDisplayI18n } from '../data-display/src/wi-data-display.i18n';
import { provideWiCalendarI18n } from '../forms/src/datepicker/wi-datepicker.i18n';
import { provideWiOverlaysI18n } from '../overlays/src/wi-overlays.i18n';

import {
  createStorybookCalendarI18n,
  createStorybookDataDisplayI18n,
  createStorybookOverlaysI18n,
  setStorybookLocale,
  type StorybookLocale,
} from './locale';

import '../styles/index.css';
import './storybook-theme.css';

setCompodocJson(docJson);

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Tema Wiloc (clase wi-dark en <html>; fondo del canvas vía tokens)',
      toolbar: {
        title: 'Tema',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
    locale: {
      description:
        'Locale de demo (providers provideWi*I18n). No es un diccionario de @wiloc/ui; simula la app.',
      toolbar: {
        title: 'Locale',
        icon: 'globe',
        items: [
          { value: 'es', title: 'ES', right: 'Español' },
          { value: 'en', title: 'EN', right: 'English' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
    locale: 'es',
  },
  decorators: [
    applicationConfig({
      providers: [
        provideWiCalendarI18n(createStorybookCalendarI18n()),
        provideWiDataDisplayI18n(createStorybookDataDisplayI18n()),
        provideWiOverlaysI18n(createStorybookOverlaysI18n()),
      ],
    }),
    (storyFn, context) => {
      const theme = context.globals['theme'] as string;
      const locale = (context.globals['locale'] as StorybookLocale) ?? 'es';

      document.documentElement.classList.toggle(WI_DARK_CLASS, theme === 'dark');
      setStorybookLocale(locale);
      document.documentElement.lang = locale;

      return storyFn();
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      disable: true,
    },
    a11y: {
      test: 'todo',
    },
  },
};

export default preview;
