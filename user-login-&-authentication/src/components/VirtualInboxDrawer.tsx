import React, { useState, useEffect } from 'react';
import { Mail, Bell, X, Copy, Check, Sparkles, ExternalLink, Clock, Trash2 } from 'lucide-react';
import { VerificationNotification } from '../types';
import { authService } from '../utils/mockAuthService';

interface Props {
  onApplyOtp?: (code: string) => void;
}

export const VirtualInboxDrawer: React.FC<Props> = ({ onApplyOtp }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<VerificationNotification[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = authService.subscribeToNotifications((items) => {
      setNotifications(items);
      // Auto-open drawer gently on new code arrival if not open
      if (items.length > 0 && !items[0].read) {
        setIsOpen(true);
      }
    });
    return unsub;
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleApply = (code: string) => {
    if (onApplyOtp) {
      onApplyOtp(code);
    }
  };

  const handleClear = () => {
    authService.clearAllNotifications();
  };

  return (
    <div id="virtual-inbox-root" className="fixed bottom-4 right-4 z-50">
      {/* Floating trigger button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="relative group flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-slate-900 text-white shadow-xl hover:bg-slate-800 transition-all border border-slate-700/80 cursor-pointer"
        >
          <div className="relative">
            <Mail className="w-4 h-4 text-indigo-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </div>
          <span className="text-xs font-semibold">Security Inbox</span>
          {notifications.length > 0 && notifications[0].code && (
            <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
              OTP: {notifications[0].code}
            </span>
          )}
        </button>
      )}

      {/* Expanded Inbox Panel */}
      {isOpen && (
        <div className="w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col text-xs transition-all animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* Header */}
          <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-xs text-white">Virtual Security Inbox</h4>
                <p className="text-[10px] text-slate-400">Preview simulated verification codes & links</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={handleClear}
                  title="Clear all"
                  className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-3 max-h-80 overflow-y-auto space-y-2.5 divide-y divide-slate-100 dark:divide-slate-800/80">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-slate-400">
                <Mail className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                <p className="font-medium text-xs">No verification codes sent yet</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Sign in or initiate password recovery to generate a live OTP or magic link.
                </p>
              </div>
            ) : (
              notifications.map((notif) => {
                const isExpired = Date.now() > notif.expiresAt;
                return (
                  <div key={notif.id} className="pt-2 first:pt-0">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        To: {notif.recipient}
                      </span>
                      <span className="flex items-center gap-1 text-[10px]">
                        <Clock className="w-3 h-3" />
                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/60">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                          {notif.purpose === 'mfa_login' ? '2-Factor Authentication' : 'Password Recovery'}
                        </span>
                        {isExpired ? (
                          <span className="text-[10px] text-rose-500 font-semibold">Expired</span>
                        ) : (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Valid for 5m</span>
                        )}
                      </div>

                      {notif.type === 'otp' && notif.code && (
                        <div className="flex items-center justify-between mt-1">
                          <span className="font-mono text-xl font-bold tracking-widest text-slate-900 dark:text-white">
                            {notif.code}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleCopy(notif.id, notif.code!)}
                              className="px-2 py-1 rounded bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 text-[11px] flex items-center gap-1"
                            >
                              {copiedId === notif.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                              {copiedId === notif.id ? 'Copied' : 'Copy'}
                            </button>

                            {onApplyOtp && (
                              <button
                                type="button"
                                onClick={() => handleApply(notif.code!)}
                                className="px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-[11px] flex items-center gap-1 shadow-sm"
                              >
                                <Sparkles className="w-3 h-3 text-amber-300" />
                                <span>Use Code</span>
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {notif.type === 'magic_link' && notif.linkUrl && (
                        <div className="mt-1 space-y-1">
                          <p className="text-[11px] text-slate-600 dark:text-slate-300">
                            Simulated one-click reset link:
                          </p>
                          <a
                            href={notif.linkUrl}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline break-all"
                          >
                            <ExternalLink className="w-3 h-3 shrink-0" /> Open Password Reset Link
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[10px] text-slate-400">
              Interactive test tool • Auto-catches generated codes and links
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
