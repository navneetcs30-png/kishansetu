import React from 'react';
import { PasswordStrengthResult } from '../types';
import { Check, X, ShieldAlert, ShieldCheck } from 'lucide-react';

interface Props {
  result: PasswordStrengthResult;
  showRequirements?: boolean;
}

export const PasswordStrengthMeter: React.FC<Props> = ({
  result,
  showRequirements = true,
}) => {
  const { score, label, color, requirements, suggestions, entropyBits } = result;

  // Segment colors for 4 distinct strength segments
  const getSegmentActive = (segmentIndex: number) => {
    // segmentIndex 0: 1-25%, 1: 26-50%, 2: 51-75%, 3: 76-100%
    const thresholds = [20, 45, 70, 85];
    return score >= thresholds[segmentIndex];
  };

  const getSegmentColor = (segmentIndex: number) => {
    if (!getSegmentActive(segmentIndex)) return 'bg-slate-200 dark:bg-slate-700';
    if (score >= 85) return 'bg-emerald-500';
    if (score >= 70) return 'bg-teal-500';
    if (score >= 45) return 'bg-amber-500';
    if (score >= 20) return 'bg-orange-500';
    return 'bg-rose-500';
  };

  return (
    <div id="password-strength-meter-container" className="space-y-2.5 text-xs">
      {/* Header bar: Label & Score */}
      <div className="flex items-center justify-between font-medium">
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
          {score >= 70 ? (
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <ShieldAlert className="w-4 h-4 text-slate-400" />
          )}
          <span>Password Strength:</span>
          <span className={`font-semibold ${color}`}>{label}</span>
        </div>
        {entropyBits > 0 && (
          <span className="text-slate-400 font-mono text-[11px]">
            {entropyBits} bits entropy
          </span>
        )}
      </div>

      {/* 4-Step Segmented Progress Bar */}
      <div className="grid grid-cols-4 gap-1.5 h-1.5">
        {[0, 1, 2, 3].map((idx) => (
          <div
            key={idx}
            className={`h-full rounded-full transition-colors duration-300 ${getSegmentColor(idx)}`}
          />
        ))}
      </div>

      {/* Actionable suggestions */}
      {suggestions.length > 0 && score < 70 && (
        <p className="text-[11px] text-amber-700 dark:text-amber-400/90 leading-tight">
          Tip: {suggestions[0]}
        </p>
      )}

      {/* Requirements Checklist */}
      {showRequirements && (
        <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800/80">
          <p className="text-[11px] text-slate-500 font-medium mb-1.5">Password requirements:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px]">
            {requirements.map((req) => (
              <div
                key={req.id}
                className={`flex items-center gap-1.5 transition-colors ${
                  req.met
                    ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {req.met ? (
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : (
                  <X className="w-3.5 h-3.5 opacity-60" />
                )}
                <span>{req.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
