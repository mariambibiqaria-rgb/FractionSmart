import React from 'react';
import { Fraction } from '../types';

interface FractionInputProps {
  label: string;
  value: Fraction;
  onChange: (newFraction: Fraction) => void;
  colorClass?: string;
}

export const FractionInput: React.FC<FractionInputProps> = ({ label, value, onChange, colorClass = "text-slate-800" }) => {
  const handleNumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === '' ? 0 : parseInt(e.target.value);
    if (!isNaN(val)) {
      onChange({ ...value, numerator: val });
    }
  };

  const handleDenomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === '' ? 0 : parseInt(e.target.value);
    if (!isNaN(val)) {
      onChange({ ...value, denominator: val });
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <div className="flex flex-col items-center mx-2">
      <span className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">{label}</span>
      <div className={`flex flex-col items-center bg-white p-3 rounded-2xl shadow-sm border border-slate-100 w-24 sm:w-32 ${colorClass}`}>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={value.numerator}
          onChange={handleNumChange}
          onFocus={handleFocus}
          className="w-full text-center text-3xl font-bold bg-transparent outline-none focus:bg-slate-50 rounded p-1 transition-colors"
          placeholder="Num"
        />
        <div className="w-full h-0.5 bg-slate-300 my-2 rounded-full"></div>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={value.denominator}
          onChange={handleDenomChange}
          onFocus={handleFocus}
          className="w-full text-center text-3xl font-bold bg-transparent outline-none focus:bg-slate-50 rounded p-1 transition-colors"
          placeholder="Den"
        />
      </div>
    </div>
  );
};