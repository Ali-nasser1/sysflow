export const GROUPS = [
  { id: 'edge', label: 'Edge' },
  { id: 'compute', label: 'Compute' },
  { id: 'storage', label: 'Storage' },
  { id: 'messaging', label: 'Messaging' },
  { id: 'processing', label: 'Processing' },
  { id: 'external', label: 'External' },
  { id: 'structure', label: 'Structure' },
] as const;

export type GroupId = (typeof GROUPS)[number]['id'];

export interface ComponentSpec {
  type: string;
  label: string;
  group: GroupId;
  color: string;
  /** lucide-react icon name; the web app maps it to a component */
  icon: string;
  description: string;
  defaults: { replicas: number; capacityRps: number; baseLatencyMs: number };
}

const d = (replicas: number, capacityRps: number, baseLatencyMs: number) => ({
  replicas,
  capacityRps,
  baseLatencyMs,
});

export const CATALOG = [
  {
    type: 'client',
    label: 'Client',
    group: 'edge',
    color: '#8B98A9',
    icon: 'Smartphone',
    description: 'Traffic source with users, request rate and request mix.',
    defaults: d(1, 100000, 0),
  },
  {
    type: 'dns',
    label: 'DNS',
    group: 'edge',
    color: '#4FA3D9',
    icon: 'Signpost',
    description: 'Resolves names; adds lookup latency and TTL caching.',
    defaults: d(1, 50000, 20),
  },
  {
    type: 'cdn',
    label: 'CDN',
    group: 'edge',
    color: '#2FA79B',
    icon: 'Globe',
    description: 'Edge cache that serves static content close to users.',
    defaults: d(1, 80000, 15),
  },
  {
    type: 'waf',
    label: 'WAF',
    group: 'edge',
    color: '#D9647A',
    icon: 'ShieldCheck',
    description: 'Filters malicious traffic before it reaches your servers.',
    defaults: d(1, 40000, 3),
  },
  {
    type: 'rate-limiter',
    label: 'Rate Limiter',
    group: 'edge',
    color: '#C98A1B',
    icon: 'Filter',
    description: 'Caps requests per client and rejects the excess.',
    defaults: d(1, 40000, 1),
  },
  {
    type: 'api-gateway',
    label: 'API Gateway',
    group: 'edge',
    color: '#E8803A',
    icon: 'DoorOpen',
    description: 'Single entry point for auth, routing and throttling.',
    defaults: d(2, 20000, 5),
  },
  {
    type: 'load-balancer',
    label: 'Load Balancer',
    group: 'edge',
    color: '#9B8CFF',
    icon: 'Split',
    description: 'Spreads traffic by round-robin or least-connections.',
    defaults: d(1, 50000, 1),
  },
  {
    type: 'api-server',
    label: 'API Server',
    group: 'compute',
    color: '#FF7A59',
    icon: 'Code',
    description: 'Stateless app server with capacity, latency and replicas.',
    defaults: d(1, 5000, 30),
  },
  {
    type: 'microservice',
    label: 'Microservice',
    group: 'compute',
    color: '#FF8F6B',
    icon: 'Box',
    description: 'A service with its own scaling and downstream dependencies.',
    defaults: d(2, 3000, 40),
  },
  {
    type: 'serverless',
    label: 'Serverless Function',
    group: 'compute',
    color: '#F2994A',
    icon: 'Braces',
    description: 'Scales on demand, with cold starts and concurrency limits.',
    defaults: d(1, 1000, 80),
  },
  {
    type: 'worker',
    label: 'Background Worker',
    group: 'compute',
    color: '#E07B39',
    icon: 'Cog',
    description: 'Pulls jobs from a queue and processes them asynchronously.',
    defaults: d(2, 500, 200),
  },
  {
    type: 'scheduler',
    label: 'Scheduler / Cron',
    group: 'compute',
    color: '#D98E04',
    icon: 'Clock',
    description: 'Triggers jobs on a schedule and creates periodic spikes.',
    defaults: d(1, 100, 5),
  },
  {
    type: 'cache',
    label: 'Cache',
    group: 'storage',
    color: '#FF6B5E',
    icon: 'Zap',
    description: 'In-memory store with hit ratio, TTL and eviction policy.',
    defaults: d(1, 50000, 1),
  },
  {
    type: 'sql-db',
    label: 'SQL Database',
    group: 'storage',
    color: '#5B9BFF',
    icon: 'Database',
    description: 'Primary and replicas with a connection pool and write limits.',
    defaults: d(1, 5000, 12),
  },
  {
    type: 'nosql-db',
    label: 'NoSQL Database',
    group: 'storage',
    color: '#6C7DF2',
    icon: 'Rows3',
    description: 'Horizontally sharded store for high-volume key access.',
    defaults: d(3, 20000, 8),
  },
  {
    type: 'object-storage',
    label: 'Object Storage',
    group: 'storage',
    color: '#3F8EC9',
    icon: 'Archive',
    description: 'Durable storage for files and media, with higher latency.',
    defaults: d(1, 3000, 60),
  },
  {
    type: 'search-index',
    label: 'Search Index',
    group: 'storage',
    color: '#8E7CF0',
    icon: 'Search',
    description: 'Full-text search with indexing lag and query cost.',
    defaults: d(2, 2000, 40),
  },
  {
    type: 'queue',
    label: 'Message Queue',
    group: 'messaging',
    color: '#3FAE5E',
    icon: 'AlignLeft',
    description: 'Buffers work between producers and consumers.',
    defaults: d(1, 20000, 2),
  },
  {
    type: 'event-stream',
    label: 'Event Stream',
    group: 'messaging',
    color: '#34B27B',
    icon: 'Waves',
    description: 'Partitioned log with consumer groups and lag, like Kafka.',
    defaults: d(3, 50000, 5),
  },
  {
    type: 'pubsub',
    label: 'Pub/Sub',
    group: 'messaging',
    color: '#6BBF45',
    icon: 'Radio',
    description: 'Broadcasts each event to many subscribers.',
    defaults: d(1, 30000, 5),
  },
  {
    type: 'notification',
    label: 'Notification Service',
    group: 'messaging',
    color: '#E27D9B',
    icon: 'Bell',
    description: 'Sends push, email and SMS within provider limits.',
    defaults: d(1, 2000, 120),
  },
  {
    type: 'stream-processor',
    label: 'Stream Processor',
    group: 'processing',
    color: '#26A69A',
    icon: 'Activity',
    description: 'Processes events continuously with windowing.',
    defaults: d(2, 10000, 20),
  },
  {
    type: 'batch-processor',
    label: 'Batch / Media Processor',
    group: 'processing',
    color: '#7E57C2',
    icon: 'Layers',
    description: 'Heavy jobs such as video, images and reports.',
    defaults: d(2, 50, 5000),
  },
  {
    type: 'third-party-api',
    label: 'Third-party API',
    group: 'external',
    color: '#B07CD8',
    icon: 'Link2',
    description: 'External service with a latency and failure rate you set.',
    defaults: d(1, 1000, 150),
  },
  {
    type: 'region',
    label: 'Region / Availability Zone',
    group: 'structure',
    color: '#6B7A8F',
    icon: 'BoxSelect',
    description: 'A container that groups components and can fail as a whole.',
    defaults: d(1, 1, 0),
  },
  {
    type: 'custom',
    label: 'Custom Component',
    group: 'structure',
    color: '#5C6B80',
    icon: 'SquarePlus',
    description: 'Define your own capacity, latency and failure rate.',
    defaults: d(1, 1000, 10),
  },
] as const satisfies readonly ComponentSpec[];

export type ComponentType = (typeof CATALOG)[number]['type'];

const BY_TYPE = new Map<string, ComponentSpec>(CATALOG.map((c) => [c.type, c]));

export function getSpec(type: string): ComponentSpec {
  const spec = BY_TYPE.get(type);
  if (!spec) throw new Error(`Unknown component type: ${type}`);
  return spec;
}
