import { useCallback, useEffect, useRef, useState } from 'react';

export function usePrintMode(defaultDelay = 0) {
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const exportTimerRef = useRef(null);

  const closePrint = useCallback(() => {
    setIsPrintOpen(false);
  }, []);

  const openPrint = useCallback((delay = defaultDelay) => {
    if (exportTimerRef.current != null) {
      window.clearTimeout(exportTimerRef.current);
    }

    if (delay > 0) {
      exportTimerRef.current = window.setTimeout(() => {
        setIsPrintOpen(true);
        exportTimerRef.current = null;
      }, delay);
      return;
    }

    setIsPrintOpen(true);
  }, [defaultDelay]);

  useEffect(() => () => {
    if (exportTimerRef.current != null) {
      window.clearTimeout(exportTimerRef.current);
    }
  }, []);

  return {
    closePrint,
    isPrintOpen,
    openPrint,
  };
}
