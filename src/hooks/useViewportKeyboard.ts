import type { CSSProperties } from 'react';
import { useKeyboardHeight, useVisualViewport } from 'react-simplikit';

const KEYBOARD_THRESHOLD_PX = 80;

export function scrollFieldIntoView(element: HTMLElement | null): void {
  if (!element || typeof window === 'undefined') return;
  if (!window.matchMedia('(max-width: 767px)').matches) return;

  window.setTimeout(() => {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    });
  }, 240);
}

export function useViewportKeyboard() {
  const { keyboardHeight } = useKeyboardHeight({ immediate: true });
  const { viewport } = useVisualViewport();

  const isKeyboardOpen = keyboardHeight > KEYBOARD_THRESHOLD_PX;

  const viewportOverlayStyle: CSSProperties | undefined = viewport
    ? {
        top: `${viewport.offsetTop}px`,
        height: `${viewport.height}px`,
        bottom: 'auto',
      }
    : undefined;

  const getPanelMaxHeightStyle = (offsetPx = 28): CSSProperties => ({
    maxHeight: viewport
      ? `${Math.max(220, viewport.height - offsetPx)}px`
      : '90dvh',
  });

  const getExpandedFrameStyle = (marginPx = 16): CSSProperties | undefined =>
    viewport
      ? {
          top: `${viewport.offsetTop + marginPx}px`,
          left: `${viewport.offsetLeft + marginPx}px`,
          width: `${Math.max(240, viewport.width - marginPx * 2)}px`,
          height: `${Math.max(220, viewport.height - marginPx * 2)}px`,
          bottom: 'auto',
          right: 'auto',
        }
      : undefined;

  return {
    keyboardHeight,
    isKeyboardOpen,
    viewport,
    viewportOverlayStyle,
    getPanelMaxHeightStyle,
    getExpandedFrameStyle,
  };
}
