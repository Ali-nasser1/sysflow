import { Handle, Position, type NodeProps } from '@xyflow/react';
import { getSpec } from '@sysflow/schema';
import type { CSSProperties } from 'react';
import { ICONS } from '../icons';
import { STATUS_COLOR, statusOf } from '../status';
import type { FlowNode } from '../store';

export function ComponentNode({ data, selected }: NodeProps<FlowNode>) {
  const spec = getSpec(data.type);
  const Icon = ICONS[spec.icon] ?? ICONS['SquarePlus'];
  const status = statusOf(data.util);
  const pct = Math.round(data.util * 100);
  const sub =
    status === 'idle' ? 'idle' : status === 'healthy' ? `${pct}% util` : `${pct}% · ${status}`;

  return (
    <div
      className={`node${selected ? ' is-selected' : ''}`}
      data-status={status}
      style={{ '--status': STATUS_COLOR[status] } as CSSProperties}
    >
      <Handle type="target" position={Position.Left} />
      <div className="node-head">
        <span className="badge" style={{ background: spec.color }}>
          {Icon && <Icon size={16} aria-hidden />}
        </span>
        <b>{data.label}</b>
      </div>
      <span className="node-sub">{sub}</span>
      {status !== 'idle' && (
        <div className="bar">
          <span style={{ width: `${Math.min(100, pct)}%` }} />
        </div>
      )}
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
