'use client';

import { useState } from 'react';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);
  const [memory, setMemory] = useState(0);
  const [isRadians, setIsRadians] = useState(true);

  const handleNumber = (num: string) => {
    if (shouldResetDisplay) {
      setDisplay(num);
      setShouldResetDisplay(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleDecimal = () => {
    if (shouldResetDisplay) {
      setDisplay('0.');
      setShouldResetDisplay(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperation = (op: string) => {
    const currentValue = display;
    
    if (previousValue !== null && operation !== null && !shouldResetDisplay) {
      calculate();
    }
    
    setPreviousValue(currentValue);
    setOperation(op);
    setShouldResetDisplay(true);
  };

  const calculate = () => {
    if (previousValue === null || operation === null) return;

    const prev = parseFloat(previousValue);
    const current = parseFloat(display);
    let result: number;

    switch (operation) {
      case '+':
        result = prev + current;
        break;
      case '-':
        result = prev - current;
        break;
      case '×':
        result = prev * current;
        break;
      case '÷':
        result = prev / current;
        break;
      case '^':
        result = Math.pow(prev, current);
        break;
      case 'mod':
        result = prev % current;
        break;
      default:
        return;
    }

    setDisplay(String(result));
    setPreviousValue(null);
    setOperation(null);
    setShouldResetDisplay(true);
  };

  const handleScientific = (func: string) => {
    const current = parseFloat(display);
    let result: number;
    const angle = isRadians ? current : (current * Math.PI) / 180;

    switch (func) {
      case 'sin':
        result = Math.sin(angle);
        break;
      case 'cos':
        result = Math.cos(angle);
        break;
      case 'tan':
        result = Math.tan(angle);
        break;
      case 'ln':
        result = Math.log(current);
        break;
      case 'log':
        result = Math.log10(current);
        break;
      case 'sqrt':
        result = Math.sqrt(current);
        break;
      case 'x²':
        result = current * current;
        break;
      case 'x³':
        result = current * current * current;
        break;
      case '1/x':
        result = 1 / current;
        break;
      case 'e^x':
        result = Math.exp(current);
        break;
      case '10^x':
        result = Math.pow(10, current);
        break;
      case 'abs':
        result = Math.abs(current);
        break;
      case 'n!':
        result = factorial(current);
        break;
      default:
        return;
    }

    setDisplay(String(result));
    setShouldResetDisplay(true);
  };

  const factorial = (n: number): number => {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  const handleConstant = (constant: string) => {
    switch (constant) {
      case 'π':
        setDisplay(String(Math.PI));
        break;
      case 'e':
        setDisplay(String(Math.E));
        break;
    }
    setShouldResetDisplay(true);
  };

  const handleMemory = (memFunc: string) => {
    const current = parseFloat(display);
    switch (memFunc) {
      case 'MC':
        setMemory(0);
        break;
      case 'MR':
        setDisplay(String(memory));
        setShouldResetDisplay(true);
        break;
      case 'M+':
        setMemory(memory + current);
        break;
      case 'M-':
        setMemory(memory - current);
        break;
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setShouldResetDisplay(false);
  };

  const handleBackspace = () => {
    if (display.length === 1) {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const handleSign = () => {
    setDisplay(String(parseFloat(display) * -1));
  };

  const Button = ({ 
    value, 
    onClick, 
    className = '', 
    colspan = false 
  }: { 
    value: string; 
    onClick: () => void; 
    className?: string; 
    colspan?: boolean;
  }) => (
    <button
      onClick={onClick}
      className={`
        ${colspan ? 'col-span-2' : ''} 
        ${className}
        py-4 rounded-xl font-semibold text-lg transition-all duration-200 
        active:scale-95 hover:shadow-lg
      `}
    >
      {value}
    </button>
  );

  return (
    <div className="w-full max-w-2xl bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl p-6 border border-gray-700">
      <div className="mb-6">
        <div className="bg-gray-950 rounded-2xl p-6 mb-4 shadow-inner">
          <div className="text-gray-500 text-sm mb-2 h-6 overflow-hidden text-right">
            {previousValue && operation && `${previousValue} ${operation}`}
          </div>
          <div className="text-white text-5xl font-bold text-right break-all">
            {display}
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setIsRadians(!isRadians)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            {isRadians ? 'RAD' : 'DEG'}
          </button>
          <div className="text-gray-400 text-sm">
            {memory !== 0 && `M: ${memory}`}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-3">
        {/* Row 1: Memory and Clear */}
        <Button value="MC" onClick={() => handleMemory('MC')} className="bg-gray-700 hover:bg-gray-600 text-white" />
        <Button value="MR" onClick={() => handleMemory('MR')} className="bg-gray-700 hover:bg-gray-600 text-white" />
        <Button value="M+" onClick={() => handleMemory('M+')} className="bg-gray-700 hover:bg-gray-600 text-white" />
        <Button value="M-" onClick={() => handleMemory('M-')} className="bg-gray-700 hover:bg-gray-600 text-white" />
        <Button value="C" onClick={handleClear} className="bg-red-600 hover:bg-red-700 text-white" colspan />

        {/* Row 2: Scientific Functions */}
        <Button value="sin" onClick={() => handleScientific('sin')} className="bg-indigo-600 hover:bg-indigo-700 text-white" />
        <Button value="cos" onClick={() => handleScientific('cos')} className="bg-indigo-600 hover:bg-indigo-700 text-white" />
        <Button value="tan" onClick={() => handleScientific('tan')} className="bg-indigo-600 hover:bg-indigo-700 text-white" />
        <Button value="ln" onClick={() => handleScientific('ln')} className="bg-indigo-600 hover:bg-indigo-700 text-white" />
        <Button value="log" onClick={() => handleScientific('log')} className="bg-indigo-600 hover:bg-indigo-700 text-white" />
        <Button value="√" onClick={() => handleScientific('sqrt')} className="bg-indigo-600 hover:bg-indigo-700 text-white" />

        {/* Row 3: Power and Special */}
        <Button value="x²" onClick={() => handleScientific('x²')} className="bg-purple-600 hover:bg-purple-700 text-white" />
        <Button value="x³" onClick={() => handleScientific('x³')} className="bg-purple-600 hover:bg-purple-700 text-white" />
        <Button value="^" onClick={() => handleOperation('^')} className="bg-purple-600 hover:bg-purple-700 text-white" />
        <Button value="1/x" onClick={() => handleScientific('1/x')} className="bg-purple-600 hover:bg-purple-700 text-white" />
        <Button value="n!" onClick={() => handleScientific('n!')} className="bg-purple-600 hover:bg-purple-700 text-white" />
        <Button value="mod" onClick={() => handleOperation('mod')} className="bg-purple-600 hover:bg-purple-700 text-white" />

        {/* Row 4: Constants and Exponentials */}
        <Button value="π" onClick={() => handleConstant('π')} className="bg-teal-600 hover:bg-teal-700 text-white" />
        <Button value="e" onClick={() => handleConstant('e')} className="bg-teal-600 hover:bg-teal-700 text-white" />
        <Button value="e^x" onClick={() => handleScientific('e^x')} className="bg-teal-600 hover:bg-teal-700 text-white" />
        <Button value="10^x" onClick={() => handleScientific('10^x')} className="bg-teal-600 hover:bg-teal-700 text-white" />
        <Button value="|x|" onClick={() => handleScientific('abs')} className="bg-teal-600 hover:bg-teal-700 text-white" />
        <Button value="÷" onClick={() => handleOperation('÷')} className="bg-orange-600 hover:bg-orange-700 text-white" />

        {/* Row 5-7: Number pad and operations */}
        <Button value="7" onClick={() => handleNumber('7')} className="bg-gray-700 hover:bg-gray-600 text-white" />
        <Button value="8" onClick={() => handleNumber('8')} className="bg-gray-700 hover:bg-gray-600 text-white" />
        <Button value="9" onClick={() => handleNumber('9')} className="bg-gray-700 hover:bg-gray-600 text-white" />
        <Button value="×" onClick={() => handleOperation('×')} className="bg-orange-600 hover:bg-orange-700 text-white" colspan />
        <Button value="⌫" onClick={handleBackspace} className="bg-red-700 hover:bg-red-800 text-white" />

        <Button value="4" onClick={() => handleNumber('4')} className="bg-gray-700 hover:bg-gray-600 text-white" />
        <Button value="5" onClick={() => handleNumber('5')} className="bg-gray-700 hover:bg-gray-600 text-white" />
        <Button value="6" onClick={() => handleNumber('6')} className="bg-gray-700 hover:bg-gray-600 text-white" />
        <Button value="-" onClick={() => handleOperation('-')} className="bg-orange-600 hover:bg-orange-700 text-white" colspan />
        <Button value="±" onClick={handleSign} className="bg-gray-600 hover:bg-gray-500 text-white" />

        <Button value="1" onClick={() => handleNumber('1')} className="bg-gray-700 hover:bg-gray-600 text-white" />
        <Button value="2" onClick={() => handleNumber('2')} className="bg-gray-700 hover:bg-gray-600 text-white" />
        <Button value="3" onClick={() => handleNumber('3')} className="bg-gray-700 hover:bg-gray-600 text-white" />
        <Button value="+" onClick={() => handleOperation('+')} className="bg-orange-600 hover:bg-orange-700 text-white" colspan />
        <Button value="=" onClick={calculate} className="bg-green-600 hover:bg-green-700 text-white row-span-2" />

        <Button value="0" onClick={() => handleNumber('0')} className="bg-gray-700 hover:bg-gray-600 text-white" colspan />
        <Button value="." onClick={handleDecimal} className="bg-gray-700 hover:bg-gray-600 text-white" />
        <Button value="00" onClick={() => handleNumber('00')} className="bg-gray-700 hover:bg-gray-600 text-white" />
      </div>

      <div className="mt-6 text-center text-gray-500 text-sm">
        Scientific Calculator • Next.js + Tailwind CSS
      </div>
    </div>
  );
}

