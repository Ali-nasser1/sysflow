import { CATALOG, GROUPS, type GroupId } from '@sysflow/schema';
import { useMemo, useState } from 'react';
import { DND_TYPE } from '../dnd';
import { ICONS } from '../icons';
import { useStore } from '../store';

const initialOpen = Object.fromEntries(GROUPS.map((g) => [g.id, g.id === 'edge'])) as Record<
  GroupId,
  boolean
>;

export function Palette() {
  const addNode = useStore((s) => s.addNode);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(initialOpen);
  const q = query.trim().toLowerCase();

  const groups = useMemo(
    () =>
      GROUPS.map((g) => ({
        ...g,
        items: CATALOG.filter(
          (c) =>
            c.group === g.id &&
            (!q || c.label.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)),
        ),
      })).filter((g) => !q || g.items.length > 0),
    [q],
  );

  return (
    <aside className="side palette" aria-label="Components">
      <input
        className="search"
        type="search"
        aria-label="Search components"
        placeholder={`Search ${CATALOG.length} components`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {groups.length === 0 && <p className="empty">No component matches “{query}”.</p>}
      {groups.map((g) => {
        const expanded = q ? true : open[g.id];
        return (
          <section key={g.id}>
            <button
              className="group-h"
              aria-expanded={expanded}
              onClick={() => setOpen((o) => ({ ...o, [g.id]: !o[g.id] }))}
            >
              <span>{g.label}</span>
              <span>
                {g.items.length} {expanded ? '▾' : '▸'}
              </span>
            </button>
            {expanded && (
              <ul className="pal-list">
                {g.items.map((c) => {
                  const Icon = ICONS[c.icon];
                  return (
                    <li
                      key={c.type}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData(DND_TYPE, c.type);
                        e.dataTransfer.effectAllowed = 'move';
                      }}
                    >
                      <button
                        className="pal-item"
                        title={c.description}
                        onClick={() => addNode(c.type)}
                      >
                        <span className="badge" style={{ background: c.color }}>
                          {Icon && <Icon size={16} aria-hidden />}
                        </span>
                        {c.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        );
      })}
    </aside>
  );
}
