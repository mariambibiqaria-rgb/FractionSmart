import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Minus, X, Divide, Calculator, Sparkles, RotateCcw } from 'lucide-react';
import { Fraction, Operation } from './types';
import { FractionInput } from './components/FractionInput';
import { ResultCard } from './components/ResultCard';
import { calculateFraction, analyzeResult } from './utils/math';
import { getFractionExplanation } from './services/gemini';

const App: React.FC = () => {
  // State
  const [f1, setF1] = useState<Fraction>({ numerator: 1, denominator: 2 });
  const [f2, setF2] = useState<Fraction>({ numerator: 1, denominator: 4 });
  const [operation, setOperation] = useState<Operation>(Operation.ADD);
  const [isExplaining, setIsExplaining] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  
  // Derived State
  const resultFraction = calculateFraction(f1, f2, operation);
  const resultAnalysis = analyzeResult(resultFraction);
  const f1Decimal = f1.denominator !== 0 ? f1.numerator / f1.denominator : 0;
  const f2Decimal = f2.denominator !== 0 ? f2.numerator / f2.denominator : 0;

  // Reset explanation when inputs change
  useEffect(() => {
    setExplanation(null);
  }, [f1, f2, operation]);

  const handleExplain = useCallback(async () => {
    if (isExplaining) return;
    setIsExplaining(true);
    const text = await getFractionExplanation(f1, f2, operation, resultFraction);
    setExplanation(text);
    setIsExplaining(false);
  }, [f1, f2, operation, resultFraction, isExplaining]);

  const handleReset = () => {
    setF1({ numerator: 1, denominator: 2 });
    setF2({ numerator: 1, denominator: 4 });
    setOperation(Operation.ADD);
    setExplanation(null);
  };

  const OperatorButton = ({ op, icon: Icon }: { op: Operation; icon: React.ElementType }) => (
    <button
      onClick={() => setOperation(op)}
      className={`p-4 rounded-2xl transition-all duration-200 flex items-center justify-center shadow-sm
        ${operation === op 
          ? 'bg-indigo-600 text-white shadow-indigo-200 transform scale-110 z-10' 
          : 'bg-white text-slate-400 hover:bg-slate-50 hover:text-slate-600'
        }`}
    >
      <Icon size={24} strokeWidth={3} />
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="w-full max-w-md flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-xl">
            <Calculator className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">FractionSmart</h1>
        </div>
        <button 
            onClick={handleReset}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
            title="Reset"
        >
            <RotateCcw size={20} />
        </button>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-md space-y-6">
        
        {/* Input Section */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-100">
            <div className="flex justify-between items-center relative">
                {/* Fraction 1 */}
                <FractionInput 
                    label="Fraction A" 
                    value={f1} 
                    onChange={setF1} 
                    colorClass="text-blue-500"
                />

                {/* Operator */}
                <div className="flex flex-col gap-3 bg-slate-100 p-1.5 rounded-3xl absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-inner">
                    {/* Just showing the active operator icon in center for mobile layout compactness, or grid? 
                        Let's actually put the operator buttons below or in the middle. 
                        The design requested 'mobile app' feel. Let's put inputs side by side and operators in between or below.
                        Given the inputs are large, let's put inputs side-by-side and operator selector below.
                    */}
                </div>

                {/* Spacer to maintain layout balance if using absolute center for something else, 
                    but here we will put inputs side by side with a visual gap */}
                <div className="w-8 flex items-center justify-center text-slate-300 font-bold text-xl">
                    {operation === Operation.ADD && <Plus />}
                    {operation === Operation.SUBTRACT && <Minus />}
                    {operation === Operation.MULTIPLY && <X />}
                    {operation === Operation.DIVIDE && <Divide />}
                </div>

                {/* Fraction 2 */}
                <FractionInput 
                    label="Fraction B" 
                    value={f2} 
                    onChange={setF2} 
                    colorClass="text-pink-500"
                />
            </div>
            
            {/* Operations Grid */}
            <div className="grid grid-cols-4 gap-3 mt-8">
                <OperatorButton op={Operation.ADD} icon={Plus} />
                <OperatorButton op={Operation.SUBTRACT} icon={Minus} />
                <OperatorButton op={Operation.MULTIPLY} icon={X} />
                <OperatorButton op={Operation.DIVIDE} icon={Divide} />
            </div>
        </div>

        {/* Result Section */}
        <ResultCard result={resultAnalysis} f1Decimal={f1Decimal} f2Decimal={f2Decimal} />

        {/* AI Explanation Section */}
        <div className="w-full">
            {!explanation ? (
                <button
                    onClick={handleExplain}
                    disabled={isExplaining}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isExplaining ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Thinking...
                        </>
                    ) : (
                        <>
                            <Sparkles size={20} />
                            Explain with AI
                        </>
                    )}
                </button>
            ) : (
                <div className="bg-white rounded-3xl shadow-xl p-6 border border-violet-100 animate-fade-in">
                    <div className="flex items-center gap-2 mb-4 text-violet-600">
                        <Sparkles size={20} />
                        <h3 className="font-bold text-lg">AI Explanation</h3>
                    </div>
                    <div className="text-slate-600 text-sm leading-relaxed space-y-2">
                        {explanation.split('\n').map((line, i) => (
                             line.trim() ? <p key={i}>{line}</p> : <br key={i}/>
                        ))}
                    </div>
                    <button 
                        onClick={() => setExplanation(null)}
                        className="mt-4 w-full py-2 text-sm text-violet-400 hover:text-violet-600 font-medium transition-colors"
                    >
                        Close Explanation
                    </button>
                </div>
            )}
        </div>

      </main>
      
      <footer className="mt-12 text-slate-400 text-xs text-center">
        <p>Powered by Gemini 2.5 Flash</p>
      </footer>
    </div>
  );
};

export default App;