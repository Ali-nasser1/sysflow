import { Background, BackgroundVariant, ReactFlow, useReactFlow } from '@xyflow/react';
import { useCallback, useEffect, type CSSProperties, type DragEvent } from 'react';
import { DND_TYPE } from '../dnd';
import { FLOW_COLOR } from '../status';
import { useStore } from '../store';
import { ComponentNode } from './ComponentNode';

const nodeTypes = { component: ComponentNode };
const LEGEND = [
  ['request', 'request'],
  ['hit', 'cache hit'],
  ['slow', 'slow / queued'],
  ['failure', 'failure'],
] as const;

export function FlowCanvas() {
  const nodes = useStore((s) => s.nodes);
  const edges = useStore((s) => s.edges);
  const onNodesChange = useStore((s) => s.onNodesChange);
  const onEdgesChange = useStore((s) => s.onEdgesChange);
  const onConnect = useStore((s) => s.onConnect);
  const addNode = useStore((s) => s.addNode);
  const running = useStore((s) => s.running);
  const speed = useStore((s) => s.speed);
  const focus = useStore((s) => s.focus);
  const panels = useStore((s) => s.panels);
  const { screenToFlowPosition, fitView } = useReactFlow();

  // Re-center the graph whenever the available space changes (panels hidden/shown, focus mode).
  const layoutKey = `${focus}-${panels.components}-${panels.properties}-${panels.metrics}`;
  useEffect(() => {
    const id = requestAnimationFrame(() => void fitView({ padding: 0.12, duration: 200 }));
    return () => cancelAnimationFrame(id);
  }, [layoutKey, fitView]);

  const onDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const type = e.dataTransfer.getData(DND_TYPE);
      if (type) addNode(type, screenToFlowPosition({ x: e.clientX, y: e.clientY }));
    },
    [addNode, screenToFlowPosition],
  );

  return (
    <div className="canvas-panel">
      <div
        className="canvas"
        data-running={running}
        style={{ '--speed': speed } as CSSProperties}
        onDrop={onDrop}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          colorMode="dark"
          fitView
          fitViewOptions={{ padding: 0.12 }}
          minZoom={0.3}
        >
          <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#252C38" />
        </ReactFlow>
      </div>
      <div className="legend">
        <span>Flow color:</span>
        {LEGEND.map(([kind, label]) => (
          <span key={kind}>
            <span style={{ color: FLOW_COLOR[kind] }}>●</span> {label}
          </span>
        ))}
        <span className="grow" />
        <span>{focus ? 'Press Esc to exit focus mode' : 'Drag components from the left'}</span>
      </div>
    </div>
  );
}
