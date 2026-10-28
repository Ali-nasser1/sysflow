import { DEMO_METRICS } from '../demo';
import { useStore } from '../store';

export function MetricsBar() {
  const load = useStore((s) => s.load);
  const setLoad = useStore((s) => s.setLoad);
  const users = (load * 4000).toLocaleString('en-US');

  return (
    <footer className="metrics">
      <div>
        <label htmlFor="load" className="load-label">
          <span>Load</span>
          <span className="mono">{users} users</span>
        </label>
        <input
          id="load"
          type="range"
          min={0}
          max={100}
          value={load}
          onChange={(e) => setLoad(Number(e.target.value))}
        />
      </div>
      {DEMO_METRICS.map((m) => (
        <div className="metric" key={m.label}>
          <small>{m.label}</small>
          <b className={`tone-${m.tone}`}>{m.value}</b>
          <span>{m.note}</span>
        </div>
      ))}
      <p className="demo-note">
        Demo values. They become live when the simulation engine is connected.
      </p>
    </footer>
  );
}
