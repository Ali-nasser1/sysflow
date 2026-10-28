import { SCENARIOS, useStore, type Speed } from '../store';

const SPEEDS: Speed[] = [0.5, 1, 2];

export function Toolbar() {
  const running = useStore((s) => s.running);
  const speed = useStore((s) => s.speed);
  const scenario = useStore((s) => s.scenario);
  const setRunning = useStore((s) => s.setRunning);
  const setSpeed = useStore((s) => s.setSpeed);
  const setScenario = useStore((s) => s.setScenario);

  return (
    <div className="toolbar">
      <div className="seg" role="group" aria-label="Simulation speed">
        {SPEEDS.map((s) => (
          <button
            key={s}
            className={`btn${speed === s ? ' on' : ''}`}
            aria-pressed={speed === s}
            onClick={() => setSpeed(s)}
          >
            {s}×
          </button>
        ))}
      </div>
      <button className="btn" disabled title="Needs the simulation engine">
        Restart
      </button>
      <button className="btn" disabled title="Needs the simulation engine">
        Step
      </button>
      <button className="btn pri" onClick={() => setRunning(!running)}>
        {running ? 'Stop' : 'Run'}
      </button>
      <span className="grow" />
      <div className="row" role="group" aria-label="Scenario">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            className={`btn${scenario === s.id ? ' on' : ''}`}
            aria-pressed={scenario === s.id}
            onClick={() => setScenario(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
