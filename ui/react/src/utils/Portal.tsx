import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export interface PortalProps {
  container?: Element | (() => Element) | null;
  children: React.ReactNode;
  disablePortal?: boolean;
}

export function Portal({ container, children, disablePortal = false }: PortalProps) {
  const [mountNode, setMountNode] = useState<Element | null>(null);

  useEffect(() => {
    if (disablePortal) return;
    const target = typeof container === 'function' ? container() : container ?? document.body;
    setMountNode(target);
  }, [container, disablePortal]);

  if (disablePortal) return <>{children}</>;
  if (!mountNode) return null;
  return createPortal(children, mountNode);
}
