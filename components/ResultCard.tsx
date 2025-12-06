import React from 'react';
import { CalculationResult } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ResultCardProps {
  result: CalculationResult;
  f1Decimal: number;
  f2Decimal: number;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, f1Decimal, f2Decimal }) => {
  const { result: f, isImproper, wholePart, remainderNumerator, decimal } = result;
  
  const data = [
    { name: 'Frac A', value: f1Decimal, color: '#60a5fa' }, // blue-400
    { name: 'Frac B', value: f2Decimal, color: '#f472b6' }, // pink-400
    { name: 'Result', value: decimal, color: '#34d399' },   // emerald-400
  ];

  return (
    <div className="w-full bg-white rounded-3xl shadow-xl p-6 mt-6 border border-slate-100">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 text-center">Calculation Result</h3>
      
      {/* Main Fraction Display */}
      <div className="flex items-center justify-center mb-8">
        {isImproper ? (
          <div className="flex items-center gap-4">
             {/* Improper Display */}
            <div className="flex flex-col items-center">
              <span className="text-5xl font-black text-emerald-500">{f.numerator}</span>
              <div className="w-16 h-1 bg-emerald-200 my-2 rounded-full"></div>
              <span className="text-5xl font-black text-emerald-500">{f.denominator}</span>
            </div>
            
            <span className="text-3xl text-slate-300 font-light">=</span>
            
            {/* Mixed Number Display */}
            <div className="flex items-center gap-2">
              <span className="text-6xl font-black text-indigo-600">{wholePart}</span>
              {remainderNumerator !== 0 && (
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold text-indigo-500">{remainderNumerator}</span>
                  <div className="w-8 h-0.5 bg-indigo-200 my-1 rounded-full"></div>
                  <span className="text-3xl font-bold text-indigo-500">{f.denominator}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Standard Proper Fraction */
          <div className="flex flex-col items-center">
            <span className="text-6xl font-black text-emerald-500">{f.numerator}</span>
            <div className="w-20 h-1 bg-emerald-200 my-2 rounded-full"></div>
            <span className="text-6xl font-black text-emerald-500">{f.denominator}</span>
          </div>
        )}
      </div>

      <div className="bg-slate-50 rounded-xl p-3 mb-6 text-center">
        <p className="text-slate-500 text-sm font-medium">Decimal Value: <span className="text-slate-900 font-mono text-lg">{decimal.toFixed(4)}</span></p>
      </div>

      {/* Visualization using Recharts */}
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
            <YAxis hide />
            <Tooltip 
                cursor={{fill: '#f1f5f9'}}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="value" radius={[6, 6, 6, 6]} barSize={40}>
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-center text-xs text-slate-400 mt-2">Value Comparison</p>
    </div>
  );
};