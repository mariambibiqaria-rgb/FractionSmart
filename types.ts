export interface Fraction {
  numerator: number;
  denominator: number;
}

export enum Operation {
  ADD = 'ADD',
  SUBTRACT = 'SUBTRACT',
  MULTIPLY = 'MULTIPLY',
  DIVIDE = 'DIVIDE'
}

export interface CalculationResult {
  result: Fraction;
  decimal: number;
  isImproper: boolean;
  wholePart: number;
  remainderNumerator: number;
}
