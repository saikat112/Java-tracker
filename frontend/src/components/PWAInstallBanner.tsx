'use client';
import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallBanner() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check iOS
    const ios = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
    setIsIOS(ios);

    // Check if dismissed before
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) return;

    if (ios) {
      // Show iOS instructions after 3 seconds
      setTimeout(() => setShow(true), 3000);
    }

    // Listen for install prompt (Android/Chrome)
    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShow(true), 2000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (prompt) {
      await prompt.prompt();
      const { outcome } = await prompt.userChoice;
      if (outcome === 'accepted') setShow(false);
    }
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!show || isInstalled) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 max-w-lg mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 flex items-center gap-3">
        <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xl font-bold">₹</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-sm">Install ExpenseTracker</p>
          {isIOS ? (
            <p className="text-gray-400 text-xs mt-0.5">
              Tap <span className="font-semibold">Share</span> then <span className="font-semibold">Add to Home Screen</span>
            </p>
          ) : (
            <p className="text-gray-400 text-xs mt-0.5">Add to home screen for the best experience</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {!isIOS && (
            <button onClick={handleInstall}
              className="flex items-center gap-1.5 bg-violet-600 text-white text-xs font-bold px-3 py-2 rounded-xl active:scale-95 transition">
              <Download size={13} /> Install
            </button>
          )}
          <button onClick={handleDismiss}
            className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition">
            <X size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
