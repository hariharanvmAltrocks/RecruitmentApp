// Components/ConfirmationPopup.tsx
// ─────────────────────────────────────────────────────────────────────────────
// 3 popup types:
//  1. "submit"     → Submit confirm popup (OK → submit, Cancel → close popup)
//  2. "cancel"     → "Are you sure you want to leave?" popup
//  3. "validation" → Shows missing fields list
//  4. "success"    → Submit success popup
// ─────────────────────────────────────────────────────────────────────────────

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle, CheckCircle2, XCircle, LogOut, Send, X, ShieldAlert,
} from 'lucide-react';

export type PopupType = 'submit' | 'cancel' | 'validation' | 'success';

export interface ValidationError {
  field: string;
  message: string;
}

interface ConfirmationPopupProps {
  type:             PopupType;
  open:             boolean;
  validationErrors?: ValidationError[];   // only for "validation" type
  successMessage?:  string;               // only for "success" type
  onConfirm?:       () => void;           // OK button
  onClose:          () => void;           // Cancel / Close button
}

// ── Per-type config ───────────────────────────────────────────────────────────
const CONFIG: Record<PopupType, {
  icon:       React.ReactNode;
  iconBg:     string;
  title:      string;
  subtitle:   string;
  confirmLabel?: string;
  confirmStyle:  string;
  cancelLabel:   string;
}> = {
  submit: {
    icon:         <Send size={26} color="#fff" />,
    iconBg:       'linear-gradient(135deg,#2563eb,#1d4ed8)',
    title:        'Confirm Submission',
    subtitle:     'Are you sure you want to submit this HOD decision? This action cannot be undone.',
    confirmLabel: 'Yes, Submit',
    confirmStyle: 'confirm-blue',
    cancelLabel:  'Cancel',
  },
  cancel: {
    icon:         <LogOut size={26} color="#fff" />,
    iconBg:       'linear-gradient(135deg,#f59e0b,#d97706)',
    title:        'Are you sure you want to leave?',
    subtitle:     'Any unsaved changes will be lost. Do you wish to continue?',
    confirmLabel: 'Yes, Leave',
    confirmStyle: 'confirm-amber',
    cancelLabel:  'Stay Here',
  },
  validation: {
    icon:         <ShieldAlert size={26} color="#fff" />,
    iconBg:       'linear-gradient(135deg,#ef4444,#dc2626)',
    title:        'Please Fill All Mandatory Fields',
    subtitle:     'Complete the following fields before submitting:',
    confirmStyle: 'confirm-none',
    cancelLabel:  'Got it',
  },
  success: {
    icon:         <CheckCircle2 size={26} color="#fff" />,
    iconBg:       'linear-gradient(135deg,#22c55e,#16a34a)',
    title:        'Submitted Successfully!',
    subtitle:     '',
    confirmStyle: 'confirm-none',
    cancelLabel:  'Close',
  },
};

// ── Component ─────────────────────────────────────────────────────────────────
const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({
  type, open, validationErrors = [], successMessage = '', onConfirm, onClose,
}) => {
  const cfg = CONFIG[type];

  return (
    <AnimatePresence>
      {open && (
        // Backdrop
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position:        'fixed',
            inset:           0,
            zIndex:          9999,
            background:      'rgba(15,23,42,0.55)',
            backdropFilter:  'blur(4px)',
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
            padding:         '1rem',
          }}
        >
          {/* Card */}
          <motion.div
            key="card"
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{    opacity: 0, scale: 0.88, y: 20  }}
            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
            style={{
              background:   '#fff',
              borderRadius: '1rem',
              boxShadow:    '0 24px 64px rgba(0,0,0,0.18)',
              width:        '100%',
              maxWidth:     '420px',
              overflow:     'hidden',
            }}
          >
            {/* Top accent bar */}
            <div style={{
              height:     '4px',
              background: type === 'submit'     ? '#2563eb'
                        : type === 'cancel'     ? '#f59e0b'
                        : type === 'validation' ? '#ef4444'
                        :                         '#22c55e',
            }} />

            {/* Body */}
            <div style={{ padding: '1.75rem 1.75rem 0' }}>
              {/* Close X */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.25rem' }}>
                <button
                  onClick={onClose}
                  style={{
                    background: '#f1f5f9', border: 'none', borderRadius: '50%',
                    width: '2rem', height: '2rem', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <X size={14} color="#64748b" />
                </button>
              </div>

              {/* Icon */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                <div style={{
                  width: '60px', height: '60px', borderRadius: '50%',
                  background: cfg.iconBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.14)',
                }}>
                  {cfg.icon}
                </div>
              </div>

              {/* Title */}
              <h3 style={{
                margin: 0, textAlign: 'center', fontSize: '1.05rem',
                fontWeight: 700, color: '#0f172a', lineHeight: 1.3,
              }}>
                {cfg.title}
              </h3>

              {/* Subtitle / Success message */}
              {(type === 'success' ? successMessage : cfg.subtitle) && (
                <p style={{
                  margin: '0.5rem 0 0', textAlign: 'center',
                  fontSize: '0.85rem', color: '#64748b', lineHeight: 1.55,
                }}>
                  {type === 'success' ? successMessage : cfg.subtitle}
                </p>
              )}

              {/* Validation error list */}
              {type === 'validation' && validationErrors.length > 0 && (
                <div style={{
                  marginTop: '1rem',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '0.6rem',
                  padding: '0.75rem 1rem',
                }}>
                  {validationErrors.map((err, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
                      marginBottom: i < validationErrors.length - 1 ? '0.4rem' : 0,
                    }}>
                      <XCircle size={14} color="#ef4444" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.8rem', color: '#b91c1c', fontWeight: 500 }}>
                        {err.message}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Success icon pulse */}
              {type === 'success' && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.75rem' }}>
                  <div style={{
                    display: 'flex', gap: '4px', alignItems: 'center',
                  }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        background: '#22c55e',
                        animation: `pulse-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
                      }} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer buttons */}
            <div style={{
              display: 'flex', gap: '0.75rem', justifyContent: 'center',
              padding: '1.25rem 1.75rem 1.75rem',
            }}>
              {/* Cancel / Close */}
              <button
                onClick={onClose}
                style={{
                  flex: 1, padding: '0.6rem 1rem',
                  background: '#f1f5f9', border: '1.5px solid #e2e8f0',
                  borderRadius: '0.5rem', fontSize: '0.85rem',
                  fontWeight: 600, color: '#475569', cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#e2e8f0')}
                onMouseLeave={e => (e.currentTarget.style.background = '#f1f5f9')}
              >
                {cfg.cancelLabel}
              </button>

              {/* Confirm (only submit / cancel types) */}
              {cfg.confirmLabel && onConfirm && (
                <button
                  onClick={onConfirm}
                  style={{
                    flex: 1, padding: '0.6rem 1rem',
                    background: type === 'cancel'
                      ? 'linear-gradient(135deg,#f59e0b,#d97706)'
                      : 'linear-gradient(135deg,#2563eb,#1d4ed8)',
                    border: 'none', borderRadius: '0.5rem',
                    fontSize: '0.85rem', fontWeight: 700,
                    color: '#fff', cursor: 'pointer',
                    boxShadow: type === 'cancel'
                      ? '0 4px 12px rgba(245,158,11,0.35)'
                      : '0 4px 12px rgba(37,99,235,0.35)',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  {cfg.confirmLabel}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Keyframe for success dots */}
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.5); opacity: 1; }
        }
      `}</style>
    </AnimatePresence>
  );
};

export default ConfirmationPopup;