
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might want to handle this more gracefully.
  // For this environment, we assume API_KEY is set.
  console.warn("Gemini API key not found in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateDescription = async (productName: string): Promise<string> => {
  if (!API_KEY) {
    return `This is a high-quality ${productName}. It has excellent features and is built to last. Perfect for your needs.`;
  }
  
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Write a compelling and concise e-commerce product description for the following product: "${productName}". The description should be around 30-50 words, highlighting its key benefits. Do not use markdown.`,
        config: {
            temperature: 0.7,
            topP: 1,
            topK: 1,
            maxOutputTokens: 100,
            thinkingConfig: { thinkingBudget: 50 },
        },
    });

    return response.text;
  } catch (error) {
    console.error("Error generating description with Gemini:", error);
    return `Failed to generate AI description for ${productName}. Please write one manually. This product offers great value and quality.`;
  }
};
