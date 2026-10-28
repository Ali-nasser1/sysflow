import { ReactFlowProvider } from '@xyflow/react';
import { useEffect } from 'react';
import { FlowCanvas } from './components/FlowCanvas';
import { Header } from './components/Header';
import { MetricsBar } from './components/MetricsBar';
import { Palette } from './components/Palette';
import { PropertiesPanel } from './components/PropertiesPanel';
import { Toolbar } from './components/Toolbar';
import { useStore } from './store';

export default function App() {
  const panels = useStore((s) => s.panels);
  const focus = useStore((s) => s.focus);
  const toggleFocus = useStore((s) => s.toggleFocus);
  const setFocus = useStore((s) => s.setFocus);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (
        (e.target as HTMLElement | null)?.closest(
          'input, textarea, select, [contenteditable="true"]',
        )
      )
        return;
      if (e.key === 'f' || e.key === 'F') toggleFocus();
      else if (e.key === 'Escape') setFocus(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggleFocus, setFocus]);

  const showLeft = !focus && panels.components;
  const showRight = !focus && panels.properties;
  const showBottom = !focus && panels.metrics;

  return (
    <ReactFlowProvider>
      <div
        className="app"
        style={{
          gridTemplateColumns: `${showLeft ? '220px' : '0'} minmax(0, 1fr) ${showRight ? '280px' : '0'}`,
          gridTemplateRows: `56px minmax(0, 1fr) ${showBottom ? 'auto' : '0'}`,
        }}
      >
        <Header />
        {showLeft && <Palette />}
        <main className="workspace">
          <Toolbar />
          <FlowCanvas />
          {focus && (
            <>
              <button
                className="edge-tab left"
                aria-label="Show panels"
                onClick={() => setFocus(false)}
              >
                ›
              </button>
              <button
                className="edge-tab right"
                aria-label="Show panels"
                onClick={() => setFocus(false)}
              >
                ‹
              </button>
            </>
          )}
        </main>
        {showRight && <PropertiesPanel />}
        {showBottom && <MetricsBar />}
      </div>
    </ReactFlowProvider>
  );
}
