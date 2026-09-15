import { PasswordStrengthResult } from '../types';

export function evaluatePasswordStrength(password: string): PasswordStrengthResult {
  if (!password) {
    return {
      score: 0,
      label: 'Very Weak',
      color: 'text-slate-400',
      bgColor: 'bg-slate-200 dark:bg-slate-700',
      requirements: [
        { id: 'length', label: 'At least 8 characters', met: false },
        { id: 'uppercase', label: 'At least 1 uppercase letter (A-Z)', met: false },
        { id: 'lowercase', label: 'At least 1 lowercase letter (a-z)', met: false },
        { id: 'number', label: 'At least 1 number (0-9)', met: false },
        { id: 'special', label: 'At least 1 special character (!@#$%^&*)', met: false },
      ],
      suggestions: ['Enter a password to test its security.'],
      entropyBits: 0,
    };
  }

  const hasMinLength = password.length >= 8;
  const hasStrongLength = password.length >= 12;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  // Common pattern checks
  const commonPatterns = [
    /password/i,
    /123456/,
    /qwerty/i,
    /admin/i,
    /welcome/i,
    /abcde/i,
    /(.)\1{2,}/, // 3 repeating characters
  ];

  let patternPenalty = 0;
  commonPatterns.forEach((pat) => {
    if (pat.test(password)) {
      patternPenalty += 15;
    }
  });

  // Calculate pool size for entropy
  let poolSize = 0;
  if (hasLowercase) poolSize += 26;
  if (hasUppercase) poolSize += 26;
  if (hasNumber) poolSize += 10;
  if (hasSpecial) poolSize += 33;

  const entropyBits = poolSize > 0 ? Math.round(password.length * Math.log2(poolSize)) : 0;

  // Base scoring
  let score = 0;
  if (hasMinLength) score += 20;
  if (hasStrongLength) score += 15;
  if (hasUppercase) score += 15;
  if (hasLowercase) score += 15;
  if (hasNumber) score += 15;
  if (hasSpecial) score += 20;

  // Apply penalty
  score = Math.max(0, Math.min(100, score - patternPenalty));

  // Determine status label & color
  let label: PasswordStrengthResult['label'] = 'Very Weak';
  let color = 'text-rose-600';
  let bgColor = 'bg-rose-500';

  if (score >= 85) {
    label = 'Excellent';
    color = 'text-emerald-600';
    bgColor = 'bg-emerald-500';
  } else if (score >= 70) {
    label = 'Strong';
    color = 'text-teal-600';
    bgColor = 'bg-teal-500';
  } else if (score >= 45) {
    label = 'Fair';
    color = 'text-amber-500';
    bgColor = 'bg-amber-500';
  } else if (score >= 25) {
    label = 'Weak';
    color = 'text-orange-500';
    bgColor = 'bg-orange-500';
  }

  const suggestions: string[] = [];
  if (!hasMinLength) {
    suggestions.push(`Add ${8 - password.length} more character${8 - password.length === 1 ? '' : 's'}.`);
  } else if (!hasStrongLength) {
    suggestions.push('Make it 12+ characters for hardened security.');
  }
  if (!hasUppercase) suggestions.push('Include uppercase letters.');
  if (!hasLowercase) suggestions.push('Include lowercase letters.');
  if (!hasNumber) suggestions.push('Include at least one number.');
  if (!hasSpecial) suggestions.push('Include special symbols (!@#$%^&*).');
  if (patternPenalty > 0) suggestions.push('Avoid common words or repetitive sequences.');

  return {
    score,
    label,
    color,
    bgColor,
    requirements: [
      { id: 'length', label: 'At least 8 characters (12+ recommended)', met: hasMinLength },
      { id: 'uppercase', label: 'Uppercase letter (A-Z)', met: hasUppercase },
      { id: 'lowercase', label: 'Lowercase letter (a-z)', met: hasLowercase },
      { id: 'number', label: 'Numeric digit (0-9)', met: hasNumber },
      { id: 'special', label: 'Special symbol (!@#$%^&*)', met: hasSpecial },
    ],
    suggestions,
    entropyBits,
  };
}
