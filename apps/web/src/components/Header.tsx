import { useStore, type PanelKey } from '../store';

const PANELS: { key: PanelKey; label: string }[] = [
  { key: 'components', label: 'Components' },
  { key: 'properties', label: 'Properties' },
  { key: 'metrics', label: 'Metrics' },
];

export function Header() {
  const name = useStore((s) => s.name);
  const panels = useStore((s) => s.panels);
  const focus = useStore((s) => s.focus);
  const togglePanel = useStore((s) => s.togglePanel);
  const toggleFocus = useStore((s) => s.toggleFocus);

  return (
    <header className="header">
      <strong>SysFlow</strong>
      <span className="muted">{name}</span>
      <span className="grow" />
      <div className="row" role="group" aria-label="Panels">
        {PANELS.map((p) => {
          const shown = panels[p.key] && !focus;
          return (
            <button
              key={p.key}
              className={`btn${shown ? ' pressed' : ''}`}
              aria-pressed={shown}
              disabled={focus}
              onClick={() => togglePanel(p.key)}
            >
              {p.label}
            </button>
          );
        })}
      </div>
      <button className={`btn${focus ? ' on' : ''}`} aria-pressed={focus} onClick={toggleFocus}>
        {focus ? 'Exit focus · Esc' : 'Focus mode · F'}
      </button>
      <button className="btn" disabled title="Sharing arrives with accounts">
        Share
      </button>
    </header>
  );
}
