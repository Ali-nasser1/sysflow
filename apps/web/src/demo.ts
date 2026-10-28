import { MarkerType, type Edge } from '@xyflow/react';
import { getSpec } from '@sysflow/schema';
import { FLOW_COLOR, type FlowKind } from './status';
import type { FlowNode } from './store';

const mk = (
  id: string,
  type: string,
  x: number,
  y: number,
  util: number,
  label?: string,
): FlowNode => {
  const spec = getSpec(type);
  return {
    id,
    type: 'component',
    position: { x, y },
    data: { type, label: label ?? spec.label, config: { ...spec.defaults, failureRate: 0 }, util },
  };
};

const link = (id: string, source: string, target: string, flow: FlowKind, label?: string): Edge => {
  const color = FLOW_COLOR[flow];
  return {
    id,
    source,
    target,
    label,
    animated: true,
    data: { flow },
    style: { stroke: color, strokeWidth: 2.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color },
    labelStyle: { fill: color, fontFamily: 'JetBrains Mono, monospace', fontSize: 10 },
    labelBgStyle: { fill: '#0F1822', stroke: color },
    labelBgPadding: [8, 4],
    labelBgBorderRadius: 99,
  };
};

/** Sample "URL shortener" design with illustrative utilization values (no engine yet). */
export const DEMO_NODES: FlowNode[] = [
  mk('clients', 'client', 0, 219, 0.01, 'Clients'),
  mk('lb', 'load-balancer', 216, 219, 0.38),
  mk('api-a', 'api-server', 452, 35, 0.61, 'API Server A'),
  mk('api-b', 'api-server', 452, 219, 0.82, 'API Server B'),
  mk('api-c', 'api-server', 452, 403, 0.59, 'API Server C'),
  mk('cache', 'cache', 712, 105, 0.46),
  mk('db', 'sql-db', 712, 335, 1, 'Database'),
];

export const DEMO_EDGES: Edge[] = [
  link('e1', 'clients', 'lb', 'request', 'HTTPS'),
  link('e2', 'lb', 'api-a', 'request', 'least-conn'),
  link('e3', 'lb', 'api-b', 'request'),
  link('e4', 'lb', 'api-c', 'request'),
  link('e5', 'api-a', 'cache', 'hit'),
  link('e6', 'api-b', 'cache', 'hit', '71% hit'),
  link('e7', 'api-b', 'db', 'failure', 'queue 1,240'),
  link('e8', 'api-c', 'db', 'slow'),
];

export const DEMO_METRICS = [
  { label: 'p95 latency', value: '840 ms', note: '+720 ms vs baseline', tone: 'bad' },
  { label: 'Throughput', value: '11.9k req/s', note: 'of 12.4k offered', tone: 'ok' },
  { label: 'Error rate', value: '4.2%', note: 'Timeouts at database', tone: 'warn' },
  { label: 'Queue depth', value: '1,240', note: 'Database, growing', tone: 'bad' },
] as const;
