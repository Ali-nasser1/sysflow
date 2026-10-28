export type Status = 'idle' | 'healthy' | 'strained' | 'bottleneck';

export const STATUS_COLOR: Record<Status, string> = {
  idle: '#3A4757',
  healthy: '#3DD68C',
  strained: '#F5B546',
  bottleneck: '#FF6B6B',
};

/** Maps utilization (0..1) to a status. Thresholds are shared by node borders, bars and labels. */
export function statusOf(util: number): Status {
  if (util <= 0) return 'idle';
  if (util < 0.7) return 'healthy';
  if (util < 0.9) return 'strained';
  return 'bottleneck';
}

export const FLOW_COLOR = {
  request: '#6EA8FF',
  hit: '#3DD68C',
  slow: '#F5B546',
  failure: '#FF6B6B',
} as const;
export type FlowKind = keyof typeof FLOW_COLOR;
