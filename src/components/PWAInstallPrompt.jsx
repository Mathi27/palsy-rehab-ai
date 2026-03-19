import React, { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if the user has already dismissed this in the past
    const hasDismissed = localStorage.getItem('pwa_prompt_dismissed');
    
    // Check if it's a mobile device (simple width check)
    const isMobile = window.innerWidth <= 768;

    const handleBeforeInstallPrompt = (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      
      // Only show our custom UI if on mobile and hasn't been dismissed
      if (isMobile && !hasDismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the native install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setShowPrompt(false);
    
    // Once installed or decided, don't show our custom prompt again
    localStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 bg-slate-900 text-white p-4 rounded-xl shadow-2xl flex items-center justify-between animate-fade-in-up">
      <div className="flex flex-col">
        <span className="font-semibold text-sm">Install FaceApp</span>
        <span className="text-xs text-slate-300">Add to home screen for offline use</span>
      </div>
      
      <div className="flex items-center gap-3">
        <button 
          onClick={handleInstallClick}
          className="flex items-center gap-1 bg-medical hover:bg-medical-light hover:text-medical-dark px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
        >
          <Download size={16} />
          Install
        </button>
        <button onClick={handleDismiss} className="text-slate-400 hover:text-white p-1">
          <X size={20} />
        </button>
      </div>
    </div>
  );
}