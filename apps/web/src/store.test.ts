import { beforeEach, describe, expect, it } from 'vitest';
import { statusOf } from './status';
import { useStore } from './store';

const initial = useStore.getState();
beforeEach(() => useStore.setState(initial, true));

describe('panels and focus mode', () => {
  it('toggles each panel independently', () => {
    useStore.getState().togglePanel('metrics');
    expect(useStore.getState().panels).toEqual({
      components: true,
      properties: true,
      metrics: false,
    });
  });
  it('focus mode keeps the panel choices so they come back on exit', () => {
    useStore.getState().togglePanel('properties');
    useStore.getState().toggleFocus();
    expect(useStore.getState().focus).toBe(true);
    useStore.getState().setFocus(false);
    expect(useStore.getState().panels.properties).toBe(false);
    expect(useStore.getState().panels.components).toBe(true);
  });
});

describe('graph editing', () => {
  it('adds a selected node with catalog defaults', () => {
    const before = useStore.getState().nodes.length;
    useStore.getState().addNode('cache');
    const nodes = useStore.getState().nodes;
    expect(nodes).toHaveLength(before + 1);
    const added = nodes[nodes.length - 1];
    expect(added?.selected).toBe(true);
    expect(added?.data.config.replicas).toBe(1);
    expect(nodes.filter((n) => n.selected)).toHaveLength(1);
  });
  it('updates a node config without touching others', () => {
    useStore.getState().updateConfig('db', { replicas: 3 });
    const { nodes } = useStore.getState();
    expect(nodes.find((n) => n.id === 'db')?.data.config.replicas).toBe(3);
    expect(nodes.find((n) => n.id === 'lb')?.data.config.replicas).toBe(1);
  });
});

describe('statusOf', () => {
  it('maps utilization to status', () => {
    expect([0, 0.5, 0.82, 1].map(statusOf)).toEqual(['idle', 'healthy', 'strained', 'bottleneck']);
  });
});
