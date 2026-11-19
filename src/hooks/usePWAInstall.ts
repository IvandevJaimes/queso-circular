import { useCallback, useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

const INSTALLED_STORAGE_KEY = 'queso-circular-pwa-installed';

function readMobileContext() {
  if (typeof window === 'undefined') {
    return { isMobileDevice: false, isIOS: false, isAndroid: false };
  }

  const ua = window.navigator.userAgent || '';
  const maxTouchPoints = window.navigator.maxTouchPoints || 0;
  const isIOS =
    /iphone|ipad|ipod/i.test(ua) ||
    (/macintosh/i.test(ua) && maxTouchPoints > 1);
  const isAndroid = /android/i.test(ua);
  const isOtherMobile = /mobile|webos|blackberry|iemobile|opera mini/i.test(ua);
  const isMobileViewport = window.matchMedia('(max-width: 767px)').matches;

  return {
    isMobileDevice: isMobileViewport && (isIOS || isAndroid || isOtherMobile),
    isIOS,
    isAndroid,
  };
}

function readStandaloneState(): boolean {
  if (typeof window === 'undefined') return false;
  const nav = window.navigator as NavigatorWithStandalone;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    nav.standalone === true ||
    document.referrer.startsWith('android-app://')
  );
}

function readPersistedInstalled(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(INSTALLED_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

function writePersistedInstalled(installed: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    if (installed) {
      window.localStorage.setItem(INSTALLED_STORAGE_KEY, 'true');
    } else {
      window.localStorage.removeItem(INSTALLED_STORAGE_KEY);
    }
  } catch {
    // Ignorar errores de almacenamiento si está restringido
  }
}

export function usePWAInstall() {
  const [mobileState, setMobileState] = useState(readMobileContext);
  const [isStandalone, setIsStandalone] = useState(readStandaloneState);
  const [isInstalled, setIsInstalled] = useState(
    () => readStandaloneState() || readPersistedInstalled(),
  );
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  useEffect(() => {
    const updateEnvironment = () => {
      setMobileState(readMobileContext());
      const standalone = readStandaloneState();
      setIsStandalone(standalone);
      if (standalone) {
        setIsInstalled(true);
      }
    };

    const viewportMq = window.matchMedia('(max-width: 767px)');
    const standaloneMq = window.matchMedia('(display-mode: standalone)');

    viewportMq.addEventListener('change', updateEnvironment);
    standaloneMq.addEventListener('change', updateEnvironment);
    window.addEventListener('resize', updateEnvironment);

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      writePersistedInstalled(false);
      setIsInstalled(false);
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      writePersistedInstalled(true);
      setIsInstalled(true);
      setDeferredPrompt(null);
      setIsGuideOpen(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      viewportMq.removeEventListener('change', updateEnvironment);
      standaloneMq.removeEventListener('change', updateEnvironment);
      window.removeEventListener('resize', updateEnvironment);
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt,
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const canShowInstallButton =
    mobileState.isMobileDevice && !isStandalone && !isInstalled;

  const triggerInstall = useCallback(async () => {
    if (!canShowInstallButton) return;

    if (deferredPrompt && !mobileState.isIOS) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      if (outcome === 'accepted') {
        writePersistedInstalled(true);
        setIsInstalled(true);
      }
      return;
    }

    setIsGuideOpen(true);
  }, [canShowInstallButton, deferredPrompt, mobileState.isIOS]);

  const closeGuide = useCallback(() => {
    setIsGuideOpen(false);
  }, []);

  return {
    canShowInstallButton,
    isIOS: mobileState.isIOS,
    hasNativePrompt: Boolean(deferredPrompt),
    isGuideOpen,
    triggerInstall,
    closeGuide,
  };
}
