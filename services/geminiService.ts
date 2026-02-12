import { GoogleGenAI } from "@google/genai";
import { MockupCategory } from "../types";

// Helper to remove data:image/xyz;base64, prefix
const stripBase64Prefix = (base64: string) => {
  return base64.split(',')[1] || base64;
};

// Helper to get mime type
const getMimeType = (base64: string) => {
  const match = base64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
  return match ? match[1] : 'image/png';
};

export const generateMockup = async (
  base64Image: string,
  category: MockupCategory,
  userDescription: string
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const mimeType = getMimeType(base64Image);
  const cleanBase64 = stripBase64Prefix(base64Image);

  // Prompt engineering for specific mockup generation
  const prompt = `
    Create a high-quality, photorealistic professional product mockup of a ${category}.
    
    INSTRUCTIONS:
    1. Apply the design provided in the input image onto the ${category}.
    2. The design must be warped and blended correctly to match the perspective, lighting, and texture of the ${category}.
    3. The background should be clean, modern, and neutral (studio lighting) unless specified otherwise.
    4. ${userDescription ? `User specific details: ${userDescription}` : 'Make it look premium and commercial.'}
    5. Do not include any text, watermarks, or UI elements. Focus solely on the product photography.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt,
          },
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanBase64,
            },
          },
        ],
      },
      config: {
         // Generating 1 image per request to control parallelism manually in the UI
      }
    });

    // Parse response to find the image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image data found in response");

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};