import React, { forwardRef, useState, useEffect, useRef, useCallback, useMemo } from 'react';

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  shortcut?: string[];
  group?: string;
  keywords?: string[];
  disabled?: boolean;
  onSelect?: () => void;
  href?: string;
}

export interface CommandGroup {
  label: string;
  items: CommandItem[];
}

export interface CommandPaletteProps {
  open?: boolean;
  onClose?: () => void;
  commands: CommandItem[];
  placeholder?: string;
  emptyMessage?: string;
  maxResults?: number;
  groups?: boolean;
  recentItems?: string[];
  onSearch?: (query: string) => void;
  renderItem?: (item: CommandItem, isActive: boolean) => React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  testId?: string;
}

function scoreMatch(item: CommandItem, query: string): number {
  const q = query.toLowerCase();
  const label = item.label.toLowerCase();
  const keywords = (item.keywords ?? []).join(' ').toLowerCase();
  const desc = (item.description ?? '').toLowerCase();
  if (label === q) return 100;
  if (label.startsWith(q)) return 80;
  if (label.includes(q)) return 60;
  if (keywords.includes(q)) return 40;
  if (desc.includes(q)) return 20;
  return 0;
}

export const CommandPalette = forwardRef<HTMLDivElement, CommandPaletteProps>(function CommandPalette(
  {
    open = false,
    onClose,
    commands,
    placeholder = 'Type a command or search...',
    emptyMessage = 'No results found.',
    maxResults = 20,
    groups = true,
    recentItems = [],
    onSearch,
    renderItem,
    footer,
    className,
    style,
    testId,
  },
  ref
) {
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) {
      const recents = recentItems
        .map(id => commands.find(c => c.id === id))
        .filter((c): c is CommandItem => !!c);
      return recents.length ? recents : commands.slice(0, maxResults);
    }
    return commands
      .map(c => ({ item: c, score: scoreMatch(c, query) }))
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults)
      .map(r => r.item);
  }, [query, commands, maxResults, recentItems]);

  const groupedItems = useMemo((): Array<{ heading: string | null; items: CommandItem[] }> => {
    if (!groups) return [{ heading: null, items: filtered }];
    const map = new Map<string, CommandItem[]>();
    for (const item of filtered) {
      const key = item.group ?? 'Other';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return Array.from(map.entries()).map(([heading, items]) => ({ heading, items }));
  }, [filtered, groups]);

  const flatItems = useMemo(() => groupedItems.flatMap(g => g.items), [groupedItems]);

  useEffect(() => { if (open) { setTimeout(() => inputRef.current?.focus(), 50); setQuery(''); setActiveIdx(0); } }, [open]);

  useEffect(() => {
    const el = listRef.current?.querySelectorAll('[role="option"]')[activeIdx];
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIdx]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, flatItems.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      const item = flatItems[activeIdx];
      if (item && !item.disabled) {
        item.onSelect?.();
        if (item.href && typeof window !== 'undefined') window.location.href = item.href;
        onClose?.();
      }
    } else if (e.key === 'Escape') { onClose?.(); }
  }, [flatItems, activeIdx, onClose]);

  if (!open) return null;

  let flatIdx = -1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
      className="ui-command-palette-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      <div
        ref={ref}
        className={['ui-command-palette', className].filter(Boolean).join(' ')}
        data-testid={testId}
        {...(style ? { style } : undefined)}
      >
        {/* Search input */}
        <div className="ui-command-palette__search">
          <span className="ui-command-palette__search-icon">🔍</span>
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={true}
            aria-autocomplete="list"
            aria-controls="ui-command-list"
            value={query}
            placeholder={placeholder}
            className="ui-command-palette__input"
            onChange={(e) => { setQuery(e.target.value); setActiveIdx(0); onSearch?.(e.target.value); }}
            onKeyDown={handleKeyDown}
          />
          <kbd className="ui-command-palette__kbd">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <ul
          ref={listRef}
          id="ui-command-list"
          role="listbox"
          aria-label="Commands"
          className="ui-command-palette__list"
        >
          {filtered.length === 0 ? (
            <li className="ui-command-palette__empty">
              {emptyMessage}
            </li>
          ) : (
            groupedItems.map((group) => (
              <React.Fragment key={group.heading ?? '_'}>
                {group.heading && (
                  <li role="presentation" className="ui-command-palette__group-heading">
                    {group.heading}
                  </li>
                )}
                {group.items.map((item) => {
                  flatIdx++;
                  const isActive = flatIdx === activeIdx;
                  const idx = flatIdx;
                  return renderItem ? (
                    <li key={item.id} role="option" aria-selected={isActive} aria-disabled={item.disabled}>
                      {renderItem(item, isActive)}
                    </li>
                  ) : (
                    <li
                      key={item.id}
                      role="option"
                      aria-selected={isActive}
                      aria-disabled={item.disabled}
                      onMouseEnter={() => setActiveIdx(idx)}
                      onClick={() => { if (!item.disabled) { item.onSelect?.(); if (item.href && typeof window !== 'undefined') window.location.href = item.href; onClose?.(); } }}
                      className={['ui-command-palette__item', isActive && 'ui-command-palette__item--active', item.disabled && 'ui-command-palette__item--disabled'].filter(Boolean).join(' ')}
                    >
                      {item.icon && <span className="ui-command-palette__item-icon">{item.icon}</span>}
                      <div className="ui-command-palette__item-text">
                        <p className={['ui-command-palette__item-label', isActive && 'ui-command-palette__item-label--active'].filter(Boolean).join(' ')}>
                          {item.label}
                        </p>
                        {item.description && (
                          <p className="ui-command-palette__item-description">
                            {item.description}
                          </p>
                        )}
                      </div>
                      {item.shortcut && (
                        <span className="ui-command-palette__shortcuts">
                          {item.shortcut.map((k, ki) => (
                            <kbd key={ki} className="ui-command-palette__shortcut-key">
                              {k}
                            </kbd>
                          ))}
                        </span>
                      )}
                    </li>
                  );
                })}
              </React.Fragment>
            ))
          )}
        </ul>

        {footer && (
          <div className="ui-command-palette__footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
});
