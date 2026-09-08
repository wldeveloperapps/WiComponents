import { hlm } from '../../core/src/hlm';

describe('hlm', () => {
  it('lets later utilities win conflicts', () => {
    const merged = hlm('py-4 gap-2 overflow-hidden', 'p-0 gap-0 overflow-visible');
    expect(merged).toContain('p-0');
    expect(merged).toContain('gap-0');
    expect(merged).toContain('overflow-visible');
    expect(merged).not.toContain('py-4');
    expect(merged).not.toContain('gap-2');
    expect(merged).not.toContain('overflow-hidden');
  });

  it('keeps structural classes that do not conflict', () => {
    const merged = hlm('wi-card flex rounded-control-lg border bg-surface py-4', 'p-0');
    expect(merged).toContain('wi-card');
    expect(merged).toContain('flex');
    expect(merged).toContain('rounded-control-lg');
    expect(merged).toContain('border');
    expect(merged).toContain('bg-surface');
    expect(merged).toContain('p-0');
    expect(merged).not.toContain('py-4');
  });
});
