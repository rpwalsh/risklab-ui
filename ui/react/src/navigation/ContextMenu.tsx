import React, { forwardRef, useState, useEffect, useRef, useCallback, useId } from 'react';

export interface ContextMenuItem {
  type?: 'item' | 'divider' | 'label';
  id?: string;
  label?: React.ReactNode;
  icon?: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
  destructive?: boolean;
  items?: ContextMenuItem[];
  onClick?: (e: React.MouseEvent) => void;
}

export interface ContextMenuProps {
  items: ContextMenuItem[];
  children: React.ReactNode;
  disabled?: boolean;
  onOpen?: (e: MouseEvent) => void;
  onClose?: () => void;
  className?: string;
  style?: React.CSSProperties;
  menuClassName?: string;
  menuStyle?: React.CSSProperties;
  testId?: string;
}

interface MenuPos { x: number; y: number }

function ContextMenuItems({ items, onClose, submenuDepth = 0 }: { items: ContextMenuItem[]; onClose: () => void; submenuDepth?: number }) {
  const [openSubId, setOpenSubId] = useState<string | null>(null);

  return (
    <>
      {items.map((item, idx) => {
        if (item.type === 'divider') {
          return <hr key={idx} style={{ margin: '4px 0', border: 'none', borderTop: '1px solid var(--ui-color-border)', padding: 0 }} />;
        }
        if (item.type === 'label') {
          return (
            <p key={idx} style={{ margin: 0, padding: '4px 12px 2px', fontSize: 'var(--ui-text-xs, 11px)', fontWeight: 600, color: 'var(--ui-color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {item.label}
            </p>
          );
        }
        const hasSubmenu = item.items && item.items.length > 0;
        const id = item.id ?? `ctx-${idx}`;
        return (
          <div
            key={id}
            role="menuitem"
            tabIndex={item.disabled ? -1 : 0}
            aria-haspopup={hasSubmenu ? 'menu' : undefined}
            aria-expanded={hasSubmenu ? openSubId === id : undefined}
            onMouseEnter={() => hasSubmenu && setOpenSubId(id)}
            onMouseLeave={() => hasSubmenu && setOpenSubId(null)}
            onClick={(e) => {
              if (item.disabled || hasSubmenu) return;
              item.onClick?.(e);
              onClose();
            }}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && !item.disabled && !hasSubmenu) {
                item.onClick?.(e as unknown as React.MouseEvent);
                onClose();
              }
            }}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '7px 12px',
              borderRadius: 'var(--ui-radius-sm, 4px)',
              cursor: item.disabled ? 'not-allowed' : 'default',
              userSelect: 'none',
              fontSize: 'var(--ui-text-sm, 14px)',
              color: item.destructive ? 'var(--ui-color-error)' : item.disabled ? 'var(--ui-color-text-disabled)' : 'var(--ui-color-text)',
              opacity: item.disabled ? 0.5 : 1,
              background: openSubId === id ? 'var(--ui-color-surface-variant)' : 'transparent',
              transition: 'background var(--ui-transition-fast)',
              outline: 'none',
            }}
            onFocus={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--ui-color-surface-variant)'; }}
            onBlur={(e) => { (e.currentTarget as HTMLElement).style.background = openSubId === id ? 'var(--ui-color-surface-variant)' : 'transparent'; }}
          >
            <span style={{ width: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '14px' }}>
              {item.icon}
            </span>
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.shortcut && (
              <span style={{ fontSize: 'var(--ui-text-xs, 12px)', color: 'var(--ui-color-text-secondary)', marginLeft: '8px', flexShrink: 0 }}>
                {item.shortcut}
              </span>
            )}
            {hasSubmenu && <span style={{ fontSize: '10px', color: 'var(--ui-color-text-secondary)', marginLeft: '4px' }}>▶</span>}
            {hasSubmenu && openSubId === id && (
              <div
                role="menu"
                style={{
                  position: 'absolute',
                  top: '-4px',
                  left: '100%',
                  marginLeft: '4px',
                  background: 'var(--ui-color-surface, #fff)',
                  borderRadius: 'var(--ui-radius-md, 8px)',
                  boxShadow: 'var(--ui-shadow-lg, 0 10px 30px rgba(0,0,0,0.12))',
                  border: '1px solid var(--ui-color-border)',
                  padding: '4px',
                  minWidth: '180px',
                  zIndex: 1,
                  animation: 'ui-fade-in 0.1s ease',
                }}
              >
                <ContextMenuItems items={item.items!} onClose={onClose} submenuDepth={submenuDepth + 1} />
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

export const ContextMenu = forwardRef<HTMLDivElement, ContextMenuProps>(function ContextMenu(
  { items, children, disabled = false, onOpen, onClose, className, style, menuClassName, menuStyle, testId },
  ref
) {
  const [pos, setPos] = useState<MenuPos | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const uid = useId();

  const close = useCallback(() => { setPos(null); onClose?.(); }, [onClose]);

  useEffect(() => {
    if (!pos) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    const onClick = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) close(); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onClick); };
  }, [pos, close]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    if (disabled) return;
    e.preventDefault();
    // Clamp to viewport
    const menuW = 200, menuH = Math.min(items.length * 36 + 8, 400);
    const x = Math.min(e.clientX, window.innerWidth - menuW - 8);
    const y = Math.min(e.clientY, window.innerHeight - menuH - 8);
    setPos({ x, y });
    onOpen?.(e.nativeEvent);
  }, [disabled, items.length, onOpen]);

  return (
    <div
      ref={ref}
      className={['ui-context-menu', className].filter(Boolean).join(' ')}
      data-testid={testId}
      onContextMenu={handleContextMenu}
      style={{ display: 'contents', ...style }}
    >
      {children}
      {pos && (
        <div
          ref={menuRef}
          id={uid}
          role="menu"
          className={menuClassName}
          aria-label="Context menu"
          style={{
            position: 'fixed',
            left: `${pos.x}px`,
            top: `${pos.y}px`,
            background: 'var(--ui-color-surface, #fff)',
            borderRadius: 'var(--ui-radius-md, 8px)',
            boxShadow: 'var(--ui-shadow-xl, 0 20px 40px rgba(0,0,0,0.15))',
            border: '1px solid var(--ui-color-border)',
            padding: '4px',
            minWidth: '180px',
            zIndex: 'var(--ui-z-tooltip, 1500)',
            animation: 'ui-pop-in 0.12s cubic-bezier(0.34,1.56,0.64,1)',
            ...menuStyle,
          }}
        >
          <ContextMenuItems items={items} onClose={close} />
        </div>
      )}
    </div>
  );
});
