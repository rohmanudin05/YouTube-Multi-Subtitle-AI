
import { ExtendedCountry } from './types';

export const COUNTRIES: ExtendedCountry[] = [
  // TIER S - PREMIUM RPM
  { id: "usa", code: "US", name: "United States", language: "English", estimatedRpm: "$21.50", rpmValue: 21.5, tier: "S", continent: "North America" },
  { id: "switzerland", code: "CH", name: "Switzerland", language: "German", estimatedRpm: "$22.10", rpmValue: 22.1, tier: "S", continent: "Europe" },
  { id: "norway", code: "NO", name: "Norway", language: "Norwegian", estimatedRpm: "$20.80", rpmValue: 20.8, tier: "S", continent: "Europe" },
  { id: "denmark", code: "DK", name: "Denmark", language: "Danish", estimatedRpm: "$19.50", rpmValue: 19.5, tier: "S", continent: "Europe" },
  { id: "australia", code: "AU", name: "Australia", language: "English", estimatedRpm: "$17.90", rpmValue: 17.9, tier: "S", continent: "Oceania" },
  
  // TIER A - HIGH RPM
  { id: "germany", code: "DE", name: "Germany", language: "German", estimatedRpm: "$18.20", rpmValue: 18.2, tier: "A", continent: "Europe" },
  { id: "canada", code: "CA", name: "Canada", language: "English", estimatedRpm: "$17.10", rpmValue: 17.1, tier: "A", continent: "North America" },
  { id: "uae", code: "AE", name: "UAE", language: "Arabic", estimatedRpm: "$17.50", rpmValue: 17.5, tier: "A", continent: "Middle East" },
  { id: "uk", code: "GB", name: "United Kingdom", language: "English", estimatedRpm: "$15.40", rpmValue: 15.4, tier: "A", continent: "Europe" },
  { id: "netherlands", code: "NL", name: "Netherlands", language: "Dutch", estimatedRpm: "$15.80", rpmValue: 15.8, tier: "A", continent: "Europe" },

  // TIER B - STABLE RPM
  { id: "japan", code: "JP", name: "Japan", language: "Japanese", estimatedRpm: "$14.80", rpmValue: 14.8, tier: "B", continent: "Asia" },
  { id: "south_korea", code: "KR", name: "South Korea", language: "Korean", estimatedRpm: "$13.90", rpmValue: 13.9, tier: "B", continent: "Asia" },
  { id: "singapore", code: "SG", name: "Singapore", language: "English", estimatedRpm: "$13.40", rpmValue: 13.4, tier: "B", continent: "Asia" },
  { id: "france", code: "FR", name: "France", language: "French", estimatedRpm: "$11.80", rpmValue: 11.8, tier: "B", continent: "Europe" },
  { id: "italy", code: "IT", name: "Italy", language: "Italian", estimatedRpm: "$10.90", rpmValue: 10.9, tier: "B", continent: "Europe" },

  // TIER C - MID RPM
  { id: "spain", code: "ES", name: "Spain", language: "Spanish", estimatedRpm: "$10.50", rpmValue: 10.5, tier: "C", continent: "Europe" },
  { id: "malaysia", code: "MY", name: "Malaysia", language: "Malay", estimatedRpm: "$6.50", rpmValue: 6.5, tier: "C", continent: "Asia" },
  { id: "indonesia", code: "ID", name: "Indonesia", language: "Indonesian", estimatedRpm: "$5.20", rpmValue: 5.2, tier: "C", continent: "Asia" },
  { id: "brazil", code: "BR", name: "Brazil", language: "Portuguese", estimatedRpm: "$4.10", rpmValue: 4.1, tier: "C", continent: "South America" },
  { id: "india", code: "IN", name: "India", language: "Hindi/English", estimatedRpm: "$4.80", rpmValue: 4.8, tier: "C", continent: "Asia" }
];

export const SYSTEM_INSTRUCTION = `You are an elite YouTube Content Strategist and Multi-Language Generator for the premium brand "BY ROHMANUDIN05".
Your output MUST follow this strict 3-LAYER PROCESS for each target country:

LAYER 1: ANALISIS STRATEGIS
- Scan the content niche.
- Identify local high-value keywords.
- Analyze top-5 competitor trends for that region.

LAYER 2: OPTIMASI KONTEN (BY ROHMANUDIN05 STANDARD)
Generate exactly these components per country:

A. 3 TITLE VARIATIONS (Must include "[BY ROHMANUDIN05]"):
   - Variasi 1: [Angka] + [Keyword1] + [Value] + [Emoji] + [CTA]
   - Variasi 2: [Question] + [Keyword2] + [Solution] + [Urgency]
   - Variasi 3: [Shocking] + [Keyword3] + [Secret] + [Promise]

B. DESCRIPTION (Template Structure):
   - Hook + benefit utama + keyword (Lines 1-2)
   - 3-5 bullet points (✓ benefit spesifik) (Lines 3-5)
   - About this video + timestamps (Lines 6-8)
   - Resources/links penting (Lines 9-11)
   - Call to Action (subscribe, like, comment) (Lines 12-14)
   - Credit: Created with BY ROHMANUDIN05 Multi-Subtitle AI (Lines 15-17)
   - Hashtags (5-7) + tags relevan (Lines 18-20)

C. SUBTITLES (.srt format):
   - Perfect timecode sync.
   - Reading speed 150-170 WPM.
   - MANDATORY: At minute 00:00:45,000, you MUST include a subtitle segment with the text: "Subtitles powered by Rohmanudin05 AI".

Output MUST be a JSON array of objects.`;
