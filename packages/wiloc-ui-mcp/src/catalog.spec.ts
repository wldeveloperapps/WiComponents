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

describe('@wldeveloperapps/ui-mcp catalog', () => {
  it('includes icon and the alpha surface', () => {
    const names = WI_CATALOG.map((item) => item.name);
    expect(names).toContain('icon');
    expect(names).toContain('button');
    expect(names).toContain('table');
    expect(names).toContain('toast');
    expect(names).toContain('breadcrumb');
    expect(names).toContain('datepicker');
    expect(names).toContain('date-range');
    expect(names.length).toBeGreaterThanOrEqual(27);
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
    expect(getCatalogItem('wi-button')?.entryPoint).toBe('@wldeveloperapps/ui/button');
    expect(getCatalogItem('button[wiButton], a[wiButton]')?.name).toBe('button');
  });

  it('documents WiConfirmationService on confirm-dialog and confirm-popup', () => {
    const dialog = getCatalogItem('confirm-dialog');
    const popup = getCatalogItem('confirm-popup');
    expect(dialog).toBeDefined();
    expect(popup).toBeDefined();

    expect(dialog!.exports).toEqual(
      expect.arrayContaining(['WiConfirmationService', 'WiConfirmation', 'WiConfirmationResult']),
    );
    expect(popup!.exports).toEqual(
      expect.arrayContaining(['WiConfirmationService', 'WiConfirmation', 'WiConfirmationResult']),
    );

    expect(dialog!.inputs.map((field) => field.name)).toEqual(expect.arrayContaining(['key']));
    expect(popup!.inputs.map((field) => field.name)).toEqual(expect.arrayContaining(['key']));

    expect(dialog!.example.import).toContain('confirm(');
    expect(dialog!.example.template).toContain('wi-confirm-dialog');
    expect(popup!.example.import).toContain('confirm(');
    expect(popup!.example.template).toContain('wi-confirm-popup');
    expect(popup!.example.import).toContain('target');
  });

  it('documents wi-table public API used by consumer apps', () => {
    const table = getCatalogItem('table');
    expect(table).toBeDefined();
    const inputNames = table!.inputs.map((field) => field.name);
    expect(inputNames).toEqual(
      expect.arrayContaining([
        'columns',
        'data',
        'totalItems',
        'visibleColumnIds',
        'sort',
        'filters',
        'pageIndex',
        'pageSize',
        'showFilters',
        'columnVisibility',
        'showResultCount',
        'compact',
        'trackBy',
        'filterOperators',
        'emptyMessage',
        'ariaLabel',
        'expandRowAriaLabel',
        'collapseRowAriaLabel',
      ]),
    );
    const outputNames = table!.outputs.map((field) => field.name);
    expect(outputNames).toEqual(
      expect.arrayContaining([
        'sortChange',
        'filtersChange',
        'visibleColumnIdsChange',
        'pageIndexChange',
        'pageChange',
      ]),
    );
    expect(table!.exports).toEqual(
      expect.arrayContaining([
        'WiColumnShowFrom',
        'WiTableCellDirective',
        'WiTableRowActionsDirective',
        'WiTableCellContext',
        'wiUpsertColumnFilter',
      ]),
    );
    expect(table!.parts?.map((part) => part.selector)).toEqual(
      expect.arrayContaining([
        '[wiTableSummary]',
        '[wiTableActions]',
        'ng-template[wiTableCell]',
        'ng-template[wiTableRowActions]',
      ]),
    );
    expect(table!.example.template).toContain('[(filters)]');
    expect(table!.example.template).toContain('trackBy="id"');
    expect(table!.example.template).toContain('wiTableSummary');
    expect(table!.example.import).toContain("showFrom: 'always'");
  });

  it('documents wi-otp with public length, not maxLength', () => {
    const otp = getCatalogItem('otp');
    expect(otp).toBeDefined();
    expect(otp!.selector).toBe('wi-otp');
    expect(otp!.entryPoint).toBe('@wldeveloperapps/ui/forms');
    expect(otp!.inputs.map((field) => field.name)).toContain('length');
    expect(otp!.inputs.map((field) => field.name)).not.toContain('maxLength');
    expect(otp!.example.import).toContain('@wldeveloperapps/ui/forms');
    expect(otp!.example.template).toContain('<wi-otp');
    expect(otp!.example.template).toContain('[length]="6"');
    expect(otp!.example.template).not.toContain('maxLength');
  });

  it('documents wi-date-range as a single-input range with public API', () => {
    const range = getCatalogItem('wi-date-range');
    expect(range).toBeDefined();
    expect(range!.name).toBe('date-range');
    expect(getCatalogItem('date-range')?.selector).toBe('wi-date-range');
    expect(range!.entryPoint).toBe('@wldeveloperapps/ui/forms');
    const inputNames = range!.inputs.map((field) => field.name);
    expect(inputNames).toEqual(
      expect.arrayContaining([
        'start',
        'end',
        'showTime',
        'displayFormat',
        'formatDate',
        'placeholder',
        'startTimeLabel',
        'endTimeLabel',
        'clearable',
        'ariaLabel',
      ]),
    );
    expect(inputNames).not.toContain('startPlaceholder');
    expect(inputNames).not.toContain('endPlaceholder');
    expect(range!.outputs.map((field) => field.name)).toContain('touch');
    expect(range!.exports).toEqual(
      expect.arrayContaining([
        'WiDateRangeComponent',
        'formatWiDateRange',
        'provideWiTimeZone',
        'injectWiTimeZoneId',
      ]),
    );
    expect(range!.example.template).toContain('<wi-date-range');
    expect(range!.example.template).toContain('[(start)]');
    expect(range!.example.template).toContain('[(end)]');
    expect(range!.example.template).toContain('displayFormat');
    expect(range!.example.import).toContain('provideWiTimeZone');
    expect(range!.example.template).not.toContain('startPlaceholder');
  });

  it('documents wi-datepicker displayFormat and timezone helpers', () => {
    const picker = getCatalogItem('datepicker');
    expect(picker).toBeDefined();
    expect(picker!.inputs.map((field) => field.name)).toContain('displayFormat');
    expect(picker!.exports).toEqual(
      expect.arrayContaining([
        'provideWiTimeZone',
        'injectWiTimeZoneId',
        'formatWiDate',
        'WiDisplayDateFormat',
      ]),
    );
    expect(picker!.example.template).toContain('displayFormat');
    expect(picker!.example.import).toContain('provideWiTimeZone');
  });

  it('search ranks table above unrelated hits', () => {
    const hits = searchCatalog('table');
    expect(hits[0]?.item.name).toBe('table');
  });

  it('does not leak Spartan types or packages in the public catalog', () => {
    const leaks = findSpartanLeaks(catalogPublicText());
    expect(leaks).toEqual([]);
  });

  it('documents icons registration for official and custom glyphs', () => {
    const icons = getDocTopic('icons');
    expect(icons?.body).toContain('provideWiIcons');
    expect(icons?.body).toContain('@wldeveloperapps/ui/icon/heroicons');
    expect(icons?.body).toContain('WiIconGlyph');
    expect(icons?.body).toContain('brand-mark');
    expect(icons?.body).toContain('WI_HEROICONS_CURATED');
    expect(icons?.body).toContain('tree shaking');
    expect(icons?.body).toContain("No `import … from 'heroicons'`");
    expect(icons?.body).toContain('provideHttpClient');
    expect(icons?.body).toContain('preserveColors');
    expect(icons?.body).toContain('assets/images/gate-open.svg');
    expect(icons?.body).toContain('currentColor');

    const icon = getCatalogItem('icon');
    expect(icon?.inputs.map((field) => field.name)).toEqual(
      expect.arrayContaining(['name', 'src', 'variant', 'size', 'label', 'preserveColors']),
    );
    expect(icon?.example.template).toContain('src="assets/images/gate-open.svg"');
    expect(icon?.example.import).toContain('provideHttpClient');
    expect(icon?.exports).toEqual(expect.arrayContaining(['WiIconGlyph', 'WiSvgNode']));
  });

  it('documents installation without Spartan UI imports', () => {
    const installation = getDocTopic('installation');
    expect(installation?.body).toContain('@wldeveloperapps/ui/styles/tokens.css');
    expect(installation?.body).toContain('wi-dark');
    expect(installation?.body).toContain('@wldeveloperapps/ui/overlays');
    expect(installation?.body).not.toMatch(/@spartan-ng\/helm/);
    expect(installation?.body).toContain('@theme inline');
    expect(installation?.body).toContain('postcss.config.json');
    expect(installation?.body).toContain('wldeveloperapps-ui-0.1.0-alpha.6.tgz');
    expect(installation?.body).toContain('npm.pkg.github.com');
    expect(installation?.body).toContain('@wldeveloperapps/ui/styles/index.css');
    expect(listDocTopics().map((topic) => topic.id)).toEqual(
      expect.arrayContaining([
        'installation',
        'tokens',
        'dark-mode',
        'icons',
        'ssr',
        'i18n',
        'overlays',
      ]),
    );
  });

  it('documents styles file locations and Tailwind theme bridge', () => {
    const tokens = getDocTopic('tokens');
    expect(tokens?.body).toContain('@theme inline');
    expect(tokens?.body).toContain('tokens.css');
    expect(tokens?.body).toContain('postcss.config.json');
    expect(tokens?.body).toContain('WI_DARK_CLASS');
    expect(tokens?.body).not.toMatch(/@spartan-ng\/helm/);
  });

  it('documents Transloco i18n split (JSON vs locale.ts)', () => {
    const i18n = getDocTopic('i18n');
    expect(i18n?.body).toContain('Transloco');
    expect(i18n?.body).toContain('src/assets/i18n');
    expect(i18n?.body).toContain('provideAppWiI18n');
    expect(i18n?.body).toContain('wi.calendar');
    expect(i18n?.body).toContain('ENVIRONMENT_INITIALIZER');
    expect(i18n?.body).not.toMatch(/@spartan-ng\/helm/);
  });

  it('documents nested-scroll connected overlays', () => {
    const overlays = getDocTopic('overlays');
    expect(overlays?.body).toContain('overflow: auto|scroll');
    expect(overlays?.body).toContain('cdkScrollable');
    expect(overlays?.body).toContain('z-index 1000');
    expect(overlays?.body).toContain('1100');
    expect(overlays?.body).toContain('header');
    expect(overlays?.body).toContain('sidebar');
    expect(overlays?.body).not.toMatch(/@spartan-ng\/helm/);
  });
});
