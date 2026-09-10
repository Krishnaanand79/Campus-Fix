import React, { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  '735008695489-1hs70a8oolcfu9mmqf7u9k66d6nivhut.apps.googleusercontent.com';

export const GoogleAuthButton = ({
  onSuccess,
  onError,
  text = 'continue_with', // 'signin_with' | 'signup_with' | 'continue_with'
  disabled = false,
  role = 'USER',
}) => {
  const buttonRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    let checkInterval = null;

    const initGsi = () => {
      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: async (response) => {
              if (response?.credential) {
                setLoading(true);
                try {
                  await onSuccess(response.credential, role);
                } catch (err) {
                  if (onError) onError(err.message || 'Google authentication failed');
                } finally {
                  setLoading(false);
                }
              } else {
                if (onError) onError('No credential received from Google');
              }
            },
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          if (buttonRef.current) {
            buttonRef.current.innerHTML = ''; // Clean previous rendering
            window.google.accounts.id.renderButton(buttonRef.current, {
              type: 'standard',
              theme: 'filled_black',
              size: 'large',
              text: text,
              shape: 'rectangular',
              logo_alignment: 'left',
              width: buttonRef.current.offsetWidth || 340,
            });
          }

          setSdkReady(true);
          if (checkInterval) clearInterval(checkInterval);
        } catch (err) {
          console.error('Google Sign-In initialization error:', err);
        }
      }
    };

    if (window.google?.accounts?.id) {
      initGsi();
    } else {
      checkInterval = setInterval(() => {
        if (window.google?.accounts?.id) {
          initGsi();
        }
      }, 300);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [text, role, onSuccess, onError]);

  // Fallback click handler if button is clicked directly or via custom trigger
  const handleCustomTrigger = () => {
    if (disabled || loading) return;
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    } else if (onError) {
      onError('Google Identity Services is initializing. Please try again in a moment.');
    }
  };

  return (
    <div className="w-full relative flex flex-col items-center justify-center">
      {/* Container for Google's official rendering */}
      <div
        ref={buttonRef}
        className={`w-full flex justify-center min-h-[44px] transition-opacity duration-200 ${
          disabled || loading ? 'opacity-60 pointer-events-none' : 'opacity-100'
        }`}
      />

      {/* Modern fallback button shown if GIS script is loading */}
      {!sdkReady && (
        <button
          type="button"
          onClick={handleCustomTrigger}
          disabled={disabled || loading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-700/80 bg-slate-900/80 hover:bg-slate-800/80 text-white font-medium text-xs shadow-md transition-all cursor-pointer"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          )}
          <span>
            {loading
              ? 'Connecting to Google...'
              : text === 'signup_with'
              ? 'Sign up with Google'
              : 'Sign in with Google'}
          </span>
        </button>
      )}

      {loading && (
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm rounded-xl flex items-center justify-center gap-2 text-xs text-indigo-300 font-semibold z-10">
          <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
          <span>Verifying Google account...</span>
        </div>
      )}
    </div>
  );
};
