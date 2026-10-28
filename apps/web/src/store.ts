import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
} from '@xyflow/react';
import { getSpec, type NodeConfig } from '@sysflow/schema';
import { create } from 'zustand';
import { DEMO_EDGES, DEMO_NODES } from './demo';
import { FLOW_COLOR } from './status';

export type NodeData = {
  type: string;
  label: string;
  config: NodeConfig;
  /** Utilization 0..1. Comes from the simulation engine once it is connected. */
  util: number;
  [key: string]: unknown;
};
export type FlowNode = Node<NodeData, 'component'>;

export type PanelKey = 'components' | 'properties' | 'metrics';
export const SCENARIOS = [
  { id: 'spike', label: 'Traffic spike' },
  { id: 'node-down', label: 'Node down' },
  { id: 'slow-db', label: 'Slow DB' },
  { id: 'cold-cache', label: 'Cold cache' },
] as const;
export type ScenarioId = (typeof SCENARIOS)[number]['id'];
export type Speed = 0.5 | 1 | 2;

interface State {
  name: string;
  nodes: FlowNode[];
  edges: Edge[];
  panels: Record<PanelKey, boolean>;
  focus: boolean;
  running: boolean;
  speed: Speed;
  scenario: ScenarioId;
  load: number;
  togglePanel: (key: PanelKey) => void;
  toggleFocus: () => void;
  setFocus: (focus: boolean) => void;
  setRunning: (running: boolean) => void;
  setSpeed: (speed: Speed) => void;
  setScenario: (scenario: ScenarioId) => void;
  setLoad: (load: number) => void;
  onNodesChange: (changes: NodeChange<FlowNode>[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (type: string, position?: { x: number; y: number }) => void;
  updateConfig: (id: string, patch: Partial<NodeConfig>) => void;
  updateLabel: (id: string, label: string) => void;
}

let counter = 0;

export const useStore = create<State>((set, get) => ({
  name: 'URL Shortener',
  nodes: DEMO_NODES,
  edges: DEMO_EDGES,
  panels: { components: true, properties: true, metrics: true },
  focus: false,
  running: true,
  speed: 1,
  scenario: 'spike',
  load: 62,
  togglePanel: (key) => set((s) => ({ panels: { ...s.panels, [key]: !s.panels[key] } })),
  toggleFocus: () => set((s) => ({ focus: !s.focus })),
  setFocus: (focus) => set({ focus }),
  setRunning: (running) => set({ running }),
  setSpeed: (speed) => set({ speed }),
  setScenario: (scenario) => set({ scenario }),
  setLoad: (load) => set({ load }),
  onNodesChange: (changes) => set({ nodes: applyNodeChanges(changes, get().nodes) }),
  onEdgesChange: (changes) => set({ edges: applyEdgeChanges(changes, get().edges) }),
  onConnect: (c) =>
    set({
      edges: addEdge(
        {
          ...c,
          animated: true,
          data: { flow: 'request' },
          style: { stroke: FLOW_COLOR.request, strokeWidth: 2.5 },
        },
        get().edges,
      ),
    }),
  addNode: (type, position) => {
    const spec = getSpec(type);
    counter += 1;
    const offset = (get().nodes.length % 8) * 28;
    const node: FlowNode = {
      id: `${type}-${counter}`,
      type: 'component',
      position: position ?? { x: 60 + offset, y: 60 + offset },
      data: { type, label: spec.label, config: { ...spec.defaults, failureRate: 0 }, util: 0 },
    };
    set({
      nodes: [...get().nodes.map((n) => ({ ...n, selected: false })), { ...node, selected: true }],
    });
  },
  updateConfig: (id, patch) =>
    set({
      nodes: get().nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, config: { ...n.data.config, ...patch } } } : n,
      ),
    }),
  updateLabel: (id, label) =>
    set({
      nodes: get().nodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, label } } : n)),
    }),
}));

export const selectSelectedNode = (s: State): FlowNode | undefined =>
  s.nodes.find((n) => n.selected);
