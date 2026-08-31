import type { Meta, StoryObj } from '@storybook/angular-vite';

/**
 * Smoke test visual de tokens Tailwind + tema `.wi-dark`.
 * Usa el selector de Tema en la toolbar de Storybook.
 */
const meta: Meta = {
  title: 'Foundation/Tokens',
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj;

export const SemanticColors: Story = {
  render: () => ({
    template: `
      <div class="min-h-40 space-y-4 bg-background p-6 text-on-background">
        <p class="text-sm text-on-surface-variant">
          Tokens semánticos (<code class="text-xs">--wi-color-*</code>). Cambia el tema en la toolbar.
        </p>
        <div class="flex flex-wrap gap-3">
          <div class="rounded-control bg-primary px-4 py-2 text-sm text-on-primary">primary</div>
          <div class="rounded-control bg-secondary px-4 py-2 text-sm text-on-secondary">secondary</div>
          <div class="rounded-control bg-surface-container-lowest px-4 py-2 text-sm text-on-surface">surface-container-lowest</div>
          <div class="rounded-control bg-surface-container-low px-4 py-2 text-sm text-on-surface">surface-container-low</div>
          <div class="rounded-control bg-surface-container px-4 py-2 text-sm text-on-surface">surface-container</div>
          <div class="rounded-control bg-surface-variant px-4 py-2 text-sm text-on-surface-variant">surface-variant</div>
          <div class="rounded-control bg-inverse-surface px-4 py-2 text-sm text-inverse-on-surface">inverse-surface</div>
          <div class="rounded-control bg-error px-4 py-2 text-sm text-on-error">error</div>
          <div class="rounded-control bg-warning px-4 py-2 text-sm text-on-warning">warning</div>
          <div class="rounded-control bg-success px-4 py-2 text-sm text-on-success">success</div>
        </div>
        <div class="h-control-md w-48 rounded-control border border-outline bg-surface"></div>
      </div>
    `,
  }),
};
