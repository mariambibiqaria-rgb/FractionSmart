import { GoogleGenAI } from "@google/genai";
import { Fraction, Operation } from "../types";
import { formatFraction } from "../utils/math";

const apiKey = process.env.API_KEY || ''; 
// Note: In a real production app, we'd handle the missing key more gracefully. 
// For this demo, we assume it's injected or fail silently/log.

const ai = new GoogleGenAI({ apiKey });

export const getFractionExplanation = async (
  f1: Fraction,
  f2: Fraction,
  op: Operation,
  result: Fraction
): Promise<string> => {
  if (!apiKey) return "API Key is missing. Cannot generate explanation.";

  const opSymbolMap = {
    [Operation.ADD]: '+',
    [Operation.SUBTRACT]: '-',
    [Operation.MULTIPLY]: '×',
    [Operation.DIVIDE]: '÷'
  };

  const opSymbol = opSymbolMap[op];
  const expression = `${formatFraction(f1)} ${opSymbol} ${formatFraction(f2)}`;
  const resultStr = formatFraction(result);

  const prompt = `
    You are a helpful math tutor for students.
    Explain step-by-step how to solve the fraction problem: ${expression} = ${resultStr}.
    
    Rules:
    1. Keep it concise (under 150 words).
    2. Use bullet points for steps.
    3. Explain the logic (e.g., "Find common denominator" or "Multiply by reciprocal").
    4. Use simple language suitable for a middle school student.
    5. Do not use Markdown formatting like bold or italics, just plain text with spacing.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Could not generate explanation.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I couldn't fetch the explanation right now. Please try again later.";
  }
};