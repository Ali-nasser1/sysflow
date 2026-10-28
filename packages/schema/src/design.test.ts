import { describe, expect, it } from 'vitest';
import { CATALOG, Design, GROUPS, getSpec } from './index';

const node = (id: string, type = 'api-server') => ({
  id,
  type,
  label: id,
  position: { x: 0, y: 0 },
  config: { replicas: 1, capacityRps: 100, baseLatencyMs: 5 },
});

describe('catalog', () => {
  it('has 26 unique components', () => {
    expect(CATALOG).toHaveLength(26);
    expect(new Set(CATALOG.map((c) => c.type)).size).toBe(26);
  });
  it('only uses declared groups', () => {
    const groups = new Set<string>(GROUPS.map((g) => g.id));
    for (const c of CATALOG) expect(groups.has(c.group)).toBe(true);
  });
  it('throws on unknown types', () => {
    expect(() => getSpec('nope')).toThrow();
  });
});

describe('Design', () => {
  it('accepts a valid design and fills edge defaults', () => {
    const parsed = Design.parse({
      version: 1,
      name: 'Demo',
      nodes: [node('a'), node('b', 'cache')],
      edges: [{ id: 'e1', source: 'a', target: 'b' }],
    });
    expect(parsed.edges[0]?.timeoutMs).toBe(3000);
    expect(parsed.nodes[0]?.config.failureRate).toBe(0);
  });
  it('rejects edges that point to missing nodes', () => {
    const r = Design.safeParse({
      version: 1,
      name: 'Bad',
      nodes: [node('a')],
      edges: [{ id: 'e1', source: 'a', target: 'ghost' }],
    });
    expect(r.success).toBe(false);
  });
  it('rejects duplicate node ids and unknown types', () => {
    expect(
      Design.safeParse({ version: 1, name: 'x', nodes: [node('a'), node('a')], edges: [] }).success,
    ).toBe(false);
    expect(
      Design.safeParse({ version: 1, name: 'x', nodes: [node('a', 'banana')], edges: [] }).success,
    ).toBe(false);
  });
});
