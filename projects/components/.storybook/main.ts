import type { StorybookConfig } from '@storybook/angular-vite';
import tailwindcss from '@tailwindcss/vite';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../icon/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../core/**/*.stories.@(js|jsx|mjs|ts|tsx)',
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
    });
  },
};
export default config;
