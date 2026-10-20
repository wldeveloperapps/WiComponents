import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const skillDir = resolve(dirname(fileURLToPath(import.meta.url)), '../skill');

function readSkill(name: string): string {
  return readFileSync(resolve(skillDir, name), 'utf8');
}

describe('consumer skill shipped with the MCP package', () => {
  it('teaches the agent to read the catalog before writing UI', () => {
    const skill = readSkill('SKILL.md');

    expect(skill).toContain('name: wiloc-ui');
    expect(skill).toContain('wi_search');
    expect(skill).toContain('wi_view');
    expect(skill).toContain('wi_usage');
    expect(skill).toContain('wi_docs');
    expect(skill).toContain('@wldeveloperapps/ui/');
    expect(skill).toContain('@spartan-ng/brain');
    expect(skill).toContain('provideWiIcons');
  });

  it('ships a Cursor rule that loads the skill on templates', () => {
    const rule = readSkill('wiloc-ui.mdc');
    const pkg = JSON.parse(
      readFileSync(resolve(skillDir, '../package.json'), 'utf8'),
    ) as { files?: string[] };

    expect(rule).toContain('skill `wiloc-ui`');
    expect(rule).toContain('**/*.html');
    expect(rule).toContain('**/*.component.ts');
    expect(pkg.files).toContain('skill');
  });

  it('shows the same files on the Storybook agent page', () => {
    const page = readFileSync(
      resolve(skillDir, '../../../projects/components/src/docs/Agent.mdx'),
      'utf8',
    );

    expect(page).toContain(readSkill('SKILL.md').trim());
    expect(page).toContain(readSkill('wiloc-ui.mdc').trim());
  });
});
