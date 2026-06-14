import React, { useEffect, useRef } from 'react';
import { toPng } from 'html-to-image';
import '../../css/PrintView.css';

const EXPORT_ORIENTATION = 'landscape';

function createSafeFileName(title) {
  return title
    .replace(/print preview/i, '')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase() || 'travel-log';
}

function waitForImages(node) {
  const images = Array.from(node.querySelectorAll('img'));
  const pendingImages = images.filter((image) => !image.complete);

  if (pendingImages.length === 0) {
    return Promise.resolve();
  }

  return Promise.all(pendingImages.map((image) => new Promise((resolve) => {
    image.addEventListener('load', resolve, { once: true });
    image.addEventListener('error', resolve, { once: true });
  })));
}

function PrintModal({
  children,
  onClose,
  open,
  title,
}) {
  const contentRef = useRef(null);
  const hasExportedRef = useRef(false);

  useEffect(() => {
    if (!open) {
      hasExportedRef.current = false;
      return;
    }

    if (hasExportedRef.current) {
      return;
    }

    hasExportedRef.current = true;

    const exportImage = async () => {
      const printView = contentRef.current?.querySelector('.print-view');

      if (!printView) {
        onClose();
        return;
      }

      document.body.classList.add('print-orientation-landscape');

      try {
        await waitForImages(printView);

        const dataUrl = await toPng(printView, {
          backgroundColor: '#ffffff',
          cacheBust: true,
          pixelRatio: 2,
        });
        const link = document.createElement('a');

        link.href = dataUrl;
        link.download = `${createSafeFileName(title)}-${EXPORT_ORIENTATION}.png`;
        link.click();
      } finally {
        document.body.classList.remove('print-orientation-landscape', 'print-orientation-portrait');
        onClose();
      }
    };

    window.requestAnimationFrame(() => {
      exportImage();
    });
  }, [onClose, open, title]);

  if (!open) {
    return null;
  }

  return (
    <div className="print-export-capture" aria-hidden="true">
      <div ref={contentRef} className="print-export-content">
        {children}
      </div>
    </div>
  );
}

export default React.memo(PrintModal);
