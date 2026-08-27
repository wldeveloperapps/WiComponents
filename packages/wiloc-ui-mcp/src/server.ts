import { McpServer } from '@modelcontextprotocol/server';
import * as z from 'zod/v4';

import {
  WI_CATALOG,
  WI_ENTRY_POINTS,
  WI_PACKAGE_VERSION,
  getCatalogItem,
  listCatalog,
  searchCatalog,
  summarizeItem,
} from './catalog.js';
import { getDocTopic, listDocTopics } from './docs.js';
import type { WiCatalogKind } from './types.js';

function json(data: unknown) {
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }],
  };
}

function textError(message: string) {
  return {
    content: [{ type: 'text' as const, text: message }],
    isError: true as const,
  };
}

export function createServer(): McpServer {
  const server = new McpServer({
    name: 'wiloc-ui',
    version: WI_PACKAGE_VERSION,
  });

  server.registerTool(
    'wi_list',
    {
      description:
        'Lista el catálogo público de @wiloc/ui (componentes, patterns o entry points). Usar antes de inventar imports o markup. No expone Spartan.',
      inputSchema: z.object({
        kind: z
          .enum(['components', 'patterns', 'entry-points', 'all'])
          .default('all')
          .describe('Qué listar'),
      }),
    },
    async ({ kind }) => {
      if (kind === 'entry-points') {
        return json({ version: WI_PACKAGE_VERSION, entryPoints: WI_ENTRY_POINTS });
      }

      const catalogKind: WiCatalogKind | 'all' =
        kind === 'components' ? 'component' : kind === 'patterns' ? 'pattern' : 'all';

      return json({
        version: WI_PACKAGE_VERSION,
        kind,
        items: listCatalog(catalogKind).map(summarizeItem),
      });
    },
  );

  server.registerTool(
    'wi_search',
    {
      description:
        'Busca en el catálogo público de @wiloc/ui por nombre, selector, entry point o texto de ejemplo.',
      inputSchema: z.object({
        query: z.string().min(1).describe('Texto a buscar, p. ej. table, toast, confirmación'),
        limit: z.number().int().min(1).max(25).default(10),
      }),
    },
    async ({ query, limit }) => {
      const hits = searchCatalog(query, limit);
      return json({
        query,
        hits: hits.map(({ item, score }) => ({ score, ...summarizeItem(item) })),
      });
    },
  );

  server.registerTool(
    'wi_view',
    {
      description:
        'Detalle de un componente o pattern de @wiloc/ui: API, variantes, a11y y ejemplo. Identificar por name (button) o selector (wi-button).',
      inputSchema: z.object({
        name: z.string().min(1).describe('Nombre o selector, p. ej. button o wi-table'),
      }),
    },
    async ({ name }) => {
      const item = getCatalogItem(name);
      if (!item) {
        const known = WI_CATALOG.map((entry) => entry.name).join(', ');
        return textError(`No hay "${name}" en @wiloc/ui. Catálogo: ${known}`);
      }
      return json(item);
    },
  );

  server.registerTool(
    'wi_usage',
    {
      description:
        'Snippet canónico de import y template para un componente @wiloc/ui. No usar Spartan ni rutas internas.',
      inputSchema: z.object({
        name: z.string().min(1).describe('Nombre o selector, p. ej. select o wi-dialog'),
      }),
    },
    async ({ name }) => {
      const item = getCatalogItem(name);
      if (!item) {
        return textError(`No hay "${name}" en @wiloc/ui. Usa wi_search o wi_list.`);
      }
      return json({
        name: item.name,
        entryPoint: item.entryPoint,
        import: item.example.import,
        template: item.example.template,
        status: item.status,
      });
    },
  );

  server.registerTool(
    'wi_docs',
    {
      description:
        'Temas transversales de @wiloc/ui: instalación, tokens, dark-mode, icons, ssr, i18n, forms. Sin name lista los temas.',
      inputSchema: z.object({
        topic: z
          .string()
          .optional()
          .describe('id del tema (installation, tokens, dark-mode, icons, ssr, i18n, forms)'),
      }),
    },
    async ({ topic }) => {
      if (!topic) {
        return json({ version: WI_PACKAGE_VERSION, topics: listDocTopics() });
      }
      const doc = getDocTopic(topic);
      if (!doc) {
        const ids = listDocTopics()
          .map((item) => item.id)
          .join(', ');
        return textError(`Tema desconocido "${topic}". Temas: ${ids}`);
      }
      return json(doc);
    },
  );

  return server;
}
