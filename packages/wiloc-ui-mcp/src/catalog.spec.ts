import { describe, expect, it } from 'vitest';

import {
  WI_CATALOG,
  catalogPublicText,
  findSpartanLeaks,
  getCatalogItem,
  listCatalog,
  searchCatalog,
} from './catalog.js';
import { getDocTopic, listDocTopics } from './docs.js';

describe('@wiloc/ui-mcp catalog', () => {
  it('includes icon and the alpha surface', () => {
    const names = WI_CATALOG.map((item) => item.name);
    expect(names).toContain('icon');
    expect(names).toContain('button');
    expect(names).toContain('table');
    expect(names).toContain('toast');
    expect(names.length).toBeGreaterThanOrEqual(26);
  });

  it('marks picklist, file-upload and stepper as patterns', () => {
    expect(getCatalogItem('picklist')?.kind).toBe('pattern');
    expect(getCatalogItem('file-upload')?.kind).toBe('pattern');
    expect(getCatalogItem('stepper')?.kind).toBe('pattern');
    expect(getCatalogItem('button')?.kind).toBe('component');
    expect(listCatalog('pattern').every((item) => item.kind === 'pattern')).toBe(true);
  });

  it('resolves by selector', () => {
    expect(getCatalogItem('wi-table')?.name).toBe('table');
    expect(getCatalogItem('wi-button')?.entryPoint).toBe('@wiloc/ui/button');
  });

  it('search ranks table above unrelated hits', () => {
    const hits = searchCatalog('table');
    expect(hits[0]?.item.name).toBe('table');
  });

  it('does not leak Spartan types or packages in the public catalog', () => {
    const leaks = findSpartanLeaks(catalogPublicText());
    expect(leaks).toEqual([]);
  });

  it('documents installation without Spartan UI imports', () => {
    const installation = getDocTopic('installation');
    expect(installation?.body).toContain('@wiloc/ui/styles/tokens.css');
    expect(installation?.body).toContain('wi-dark');
    expect(installation?.body).toContain('@wiloc/ui/overlays');
    expect(installation?.body).not.toMatch(/@spartan-ng\/helm/);
    expect(listDocTopics().map((topic) => topic.id)).toEqual(
      expect.arrayContaining(['installation', 'tokens', 'dark-mode', 'icons', 'ssr']),
    );
  });
});
