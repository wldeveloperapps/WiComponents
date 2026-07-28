import type { StorybookConfig } from '@storybook/angular-vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mergeConfig } from 'vite';

const componentsRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));

const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../button/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../data-display/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../forms/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../icon/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../core/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../overlays/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
  ],
  framework: {
    name: '@storybook/angular-vite',
    options: {
      compodoc: true,
      compodocArgs: ['-e', 'json', '-d', 'projects/components'],
    },
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      plugins: [tailwindcss()],
      resolve: {
        alias: {
          // Respaldo de exports del package.json fuente (Storybook/Vite).
          // Al añadir un entry: actualizar también package.json exports + tsconfig paths.
          '@wiloc/ui/icon/heroicons': resolve(componentsRoot, 'icon/heroicons/src/public-api.ts'),
          '@wiloc/ui/icon': resolve(componentsRoot, 'icon/src/public-api.ts'),
          '@wiloc/ui/forms': resolve(componentsRoot, 'forms/src/public-api.ts'),
          '@wiloc/ui/data-display': resolve(componentsRoot, 'data-display/src/public-api.ts'),
          '@wiloc/ui/button': resolve(componentsRoot, 'button/src/public-api.ts'),
          '@wiloc/ui/core': resolve(componentsRoot, 'core/src/public-api.ts'),
          '@wiloc/ui/overlays': resolve(componentsRoot, 'overlays/src/public-api.ts'),
        },
      },
    });
  },
};
export default config;
