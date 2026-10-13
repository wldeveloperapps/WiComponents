import { describe, expect, it } from 'vitest';

import { createServer } from './server.js';

const READ_ONLY = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
};

describe('wiloc-ui MCP tools', () => {
  it('advertises every catalog tool as read-only for Cursor Ask mode', () => {
    const server = createServer() as unknown as {
      _registeredTools: Record<string, { annotations?: typeof READ_ONLY }>;
    };

    const tools = Object.entries(server._registeredTools);
    expect(tools.map(([name]) => name).sort()).toEqual([
      'wi_docs',
      'wi_list',
      'wi_search',
      'wi_usage',
      'wi_view',
    ]);

    for (const [, tool] of tools) {
      expect(tool.annotations).toEqual(READ_ONLY);
    }
  });
});
