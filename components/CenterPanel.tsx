'use client';

import { forwardRef, useRef } from 'react';
import styles   from '@/styles/NeoStarPanel.module.css';
import { useFlare } from '@/hooks/useFlare';

/* 여러 ref를 한 DOM에 병합 */
function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (value: T | null) =>
    refs.forEach(r => {
      if (typeof r === 'function') r(value);
      else if (r) (r as React.MutableRefObject<T | null>).current = value;
    });
}

const CenterPanel = forwardRef<HTMLElement, { children: React.ReactNode }>(
  function CenterPanel({ children }, ref) {
    const panelRef = useRef<HTMLElement>(null);
    useFlare(ref as React.RefObject<HTMLElement>);

    return (
       <section ref={ref} className={styles.neoStarPanel}>
        <div className={styles.glass}>{children}</div>
      </section>
    );
  }
);

export default CenterPanel;
