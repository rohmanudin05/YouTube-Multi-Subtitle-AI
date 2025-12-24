
import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { GeneratedContent } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async generateAllContent(
    input: string,
    masterTitle: string,
    masterDesc: string,
    targetCountries: { name: string, language: string }[],
    duration: number,
    fileData?: { data: string, mimeType: string }
  ): Promise<GeneratedContent[]> {
    const prompt = `
      SOURCE CONTENT / SCRIPT: ${input}
      VIDEO DURATION: ${duration} minutes
      MASTER TITLE: ${masterTitle}
      MASTER DESCRIPTION: ${masterDesc}
      TARGET COUNTRIES: ${targetCountries.map(c => `${c.name} (${c.language})`).join(', ')}
      
      TASK:
      1. Perform Layer 1 Strategic Analysis.
      2. Generate Layer 2 Content (3 Title Variations and Template-based Description).
      3. Generate Layer 3 Subtitles (.srt format) covering the full ${duration} minutes. 
      Remember the mandatory credit line at 0:45.
    `;

    const contents: any[] = [{ text: prompt }];
    if (fileData) {
      contents.unshift({
        inlineData: {
          data: fileData.data,
          mimeType: fileData.mimeType
        }
      });
    }

    const response = await this.ai.models.generateContent({
      model: "gemini-3-pro-preview",
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
      const text = response.text;
      if (!text) throw new Error("Empty response from AI");
      return JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse Gemini response:", e);
      throw new Error("Invalid response format from AI. Please reduce number of target countries or simplify the script.");
    }
  }
}
