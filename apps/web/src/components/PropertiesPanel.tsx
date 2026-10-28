import { getSpec } from '@sysflow/schema';
import { useId } from 'react';
import { ICONS } from '../icons';
import { statusOf } from '../status';
import { selectSelectedNode, useStore } from '../store';

function NumberField(props: {
  label: string;
  value: number;
  min: number;
  onChange: (n: number) => void;
}) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{props.label}</label>
      <input
        id={id}
        type="number"
        min={props.min}
        value={props.value}
        onChange={(e) => {
          const n = e.target.valueAsNumber;
          if (Number.isFinite(n) && n >= props.min) props.onChange(n);
        }}
      />
    </div>
  );
}

export function PropertiesPanel() {
  const node = useStore(selectSelectedNode);
  const updateConfig = useStore((s) => s.updateConfig);
  const updateLabel = useStore((s) => s.updateLabel);
  const nameId = useId();

  if (!node) {
    return (
      <aside className="side props" aria-label="Properties">
        <p className="empty">Select a component to edit its properties.</p>
      </aside>
    );
  }

  const spec = getSpec(node.data.type);
  const Icon = ICONS[spec.icon];
  const { config } = node.data;
  const pct = Math.round(node.data.util * 100);

  return (
    <aside className="side props" aria-label="Properties">
      <div className="props-head">
        <span className="badge" style={{ background: spec.color }}>
          {Icon && <Icon size={16} aria-hidden />}
        </span>
        <div className="field grow">
          <label htmlFor={nameId} className="sr-only">
            Name
          </label>
          <input
            id={nameId}
            value={node.data.label}
            onChange={(e) => updateLabel(node.id, e.target.value)}
          />
        </div>
      </div>
      <p className="muted small">{spec.description}</p>
      <NumberField
        label="Replicas"
        min={1}
        value={config.replicas}
        onChange={(n) => updateConfig(node.id, { replicas: Math.round(n) })}
      />
      <NumberField
        label="Max throughput per node (req/s)"
        min={1}
        value={config.capacityRps}
        onChange={(n) => updateConfig(node.id, { capacityRps: n })}
      />
      <NumberField
        label="Base latency (ms)"
        min={0}
        value={config.baseLatencyMs}
        onChange={(n) => updateConfig(node.id, { baseLatencyMs: n })}
      />
      {statusOf(node.data.util) === 'bottleneck' && (
        <div className="insight">
          <strong>Bottleneck detected</strong>
          <p>
            {node.data.label} is at {pct}% utilization. Adding replicas or putting a cache in front
            of it spreads the load.
          </p>
          <button
            className="btn full"
            onClick={() => updateConfig(node.id, { replicas: config.replicas + 1 })}
          >
            Add a replica
          </button>
        </div>
      )}
    </aside>
  );
}
