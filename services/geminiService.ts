
import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { GeneratedContent } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // Initializing GoogleGenAI with process.env.API_KEY directly as per SDK guidelines.
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async generateAllContent(
    input: string,
    masterTitle: string,
    masterDesc: string,
    targetCountries: { name: string, language: string }[],
    fileData?: { data: string, mimeType: string }
  ): Promise<GeneratedContent[]> {
    const prompt = `
      SOURCE CONTENT: ${input}
      MASTER TITLE: ${masterTitle}
      MASTER DESCRIPTION: ${masterDesc}
      TARGET COUNTRIES: ${targetCountries.map(c => `${c.name} (${c.language})`).join(', ')}
      
      Perform Layer 1 Strategic Analysis for these countries based on YouTube RPM data and local trends.
      Then generate the Layer 2 Optimizations (Titles, Descriptions, Subtitles) as requested.
      Ensure the subtitle timing covers the whole content duration appropriately.
    `;

    // Prepare content parts for the generateContent call.
    const contents: any[] = [{ text: prompt }];
    if (fileData) {
      contents.unshift({
        inlineData: {
          data: fileData.data,
          mimeType: fileData.mimeType
        }
      });
    }

    // Call generateContent using the recommended model and configuration.
    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts: contents },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              country: { type: Type.STRING },
              language: { type: Type.STRING },
              titles: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              description: { type: Type.STRING },
              subtitles: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    index: { type: Type.NUMBER },
                    startTime: { type: Type.STRING },
                    endTime: { type: Type.STRING },
                    text: { type: Type.STRING }
                  },
                  required: ["index", "startTime", "endTime", "text"]
                }
              }
            },
            required: ["country", "language", "titles", "description", "subtitles"]
          }
        }
      }
    });

    try {
      // Extract generated text from response using the .text property as per guidelines.
      const data = JSON.parse(response.text || '[]');
      return data;
    } catch (e) {
      console.error("Failed to parse Gemini response:", e);
      throw new Error("Invalid response format from AI. Please try again.");
    }
  }
}
