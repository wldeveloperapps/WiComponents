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
import { applyStorybookPalette, STORYBOOK_PALETTES } from './palettes';

import '../styles/index.css';
import './storybook-theme.css';
import './palettes/iiot.css';

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
    palette: {
      description:
        'Paleta de producto (data-wi-palette en <html>). Simula otra app; no es API de los componentes.',
      toolbar: {
        title: 'Paleta',
        icon: 'paintbrush',
        items: STORYBOOK_PALETTES.map((palette) => ({
          value: palette.id,
          title: palette.title,
          right: palette.right,
        })),
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
    locale: 'es',
    palette: STORYBOOK_PALETTES[0].id,
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
      const palette = (context.globals['palette'] as string) ?? STORYBOOK_PALETTES[0].id;

      document.documentElement.classList.toggle(WI_DARK_CLASS, theme === 'dark');
      applyStorybookPalette(palette);
      setStorybookLocale(locale);
      document.documentElement.lang = locale;

      return storyFn();
    },
  ],
  parameters: {
    options: {
      storySort: {
        order: ['Documentation', ['Instalación', 'Tema', 'I18n', 'MCP'], 'Foundation', '*'],
      },
    },
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
