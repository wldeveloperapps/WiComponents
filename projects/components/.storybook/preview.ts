import type { Preview } from '@storybook/angular-vite';
import { setCompodocJson } from '@storybook/addon-docs/angular';
import docJson from '../documentation.json';
import { WI_DARK_CLASS } from '../core/src/wi-theme';

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
  },
  initialGlobals: {
    theme: 'light',
  },
  decorators: [
    (storyFn, context) => {
      const theme = context.globals['theme'] as string;
      document.documentElement.classList.toggle(WI_DARK_CLASS, theme === 'dark');
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
