import { Fraction, CalculationResult } from '../types';

// Greatest Common Divisor
export const gcd = (a: number, b: number): number => {
  return b === 0 ? a : gcd(b, a % b);
};

// Least Common Multiple
export const lcm = (a: number, b: number): number => {
  return (a * b) / gcd(a, b);
};

export const simplifyFraction = (f: Fraction): Fraction => {
  if (f.denominator === 0) return f; // Avoid division by zero errors in display logic
  const common = gcd(Math.abs(f.numerator), Math.abs(f.denominator));
  return {
    numerator: f.numerator / common,
    denominator: f.denominator / common
  };
};

export const calculateFraction = (f1: Fraction, f2: Fraction, op: string): Fraction => {
  let result: Fraction = { numerator: 0, denominator: 1 };

  switch (op) {
    case 'ADD':
      result = {
        numerator: f1.numerator * f2.denominator + f2.numerator * f1.denominator,
        denominator: f1.denominator * f2.denominator
      };
      break;
    case 'SUBTRACT':
      result = {
        numerator: f1.numerator * f2.denominator - f2.numerator * f1.denominator,
        denominator: f1.denominator * f2.denominator
      };
      break;
    case 'MULTIPLY':
      result = {
        numerator: f1.numerator * f2.numerator,
        denominator: f1.denominator * f2.denominator
      };
      break;
    case 'DIVIDE':
      result = {
        numerator: f1.numerator * f2.denominator,
        denominator: f1.denominator * f2.numerator
      };
      break;
  }

  // Handle negative denominators
  if (result.denominator < 0) {
    result.numerator *= -1;
    result.denominator *= -1;
  }

  return simplifyFraction(result);
};

export const analyzeResult = (f: Fraction): CalculationResult => {
  const decimal = f.numerator / f.denominator;
  const isImproper = Math.abs(f.numerator) >= Math.abs(f.denominator);
  const wholePart = Math.trunc(decimal);
  const remainderNumerator = Math.abs(f.numerator % f.denominator);

  return {
    result: f,
    decimal,
    isImproper,
    wholePart,
    remainderNumerator
  };
};

export const formatFraction = (f: Fraction): string => `${f.numerator}/${f.denominator}`;