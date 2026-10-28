import { z } from 'zod';
import { CATALOG } from './catalog';

const types = CATALOG.map((c) => c.type) as [string, ...string[]];

export const NodeConfig = z.object({
  replicas: z.number().int().min(1).max(1000),
  capacityRps: z.number().positive(),
  baseLatencyMs: z.number().min(0),
  failureRate: z.number().min(0).max(1).default(0),
});
export type NodeConfig = z.infer<typeof NodeConfig>;

export const DesignNode = z.object({
  id: z.string().min(1),
  type: z.enum(types),
  label: z.string().min(1).max(60),
  position: z.object({ x: z.number(), y: z.number() }),
  config: NodeConfig,
});
export type DesignNode = z.infer<typeof DesignNode>;

export const DesignEdge = z.object({
  id: z.string().min(1),
  source: z.string().min(1),
  target: z.string().min(1),
  label: z.string().max(40).optional(),
  latencyMs: z.number().min(0).default(1),
  timeoutMs: z.number().positive().default(3000),
  retries: z.number().int().min(0).max(10).default(0),
});
export type DesignEdge = z.infer<typeof DesignEdge>;

export const Design = z
  .object({
    version: z.literal(1),
    name: z.string().min(1).max(80),
    nodes: z.array(DesignNode),
    edges: z.array(DesignEdge),
  })
  .superRefine((design, ctx) => {
    const ids = new Set<string>();
    for (const n of design.nodes) {
      if (ids.has(n.id)) ctx.addIssue({ code: 'custom', message: `Duplicate node id: ${n.id}` });
      ids.add(n.id);
    }
    for (const e of design.edges) {
      for (const end of [e.source, e.target]) {
        if (!ids.has(end)) {
          ctx.addIssue({ code: 'custom', message: `Edge ${e.id} references missing node ${end}` });
        }
      }
    }
  });
export type Design = z.infer<typeof Design>;
