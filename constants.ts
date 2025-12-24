
import { ExtendedCountry } from './types';

export const COUNTRIES: ExtendedCountry[] = [
  // Tier S (>$20 RPM)
  { id: "usa", code: "US", name: "United States", language: "en", langName: "English", estimatedRpm: "$21.50", rpmValue: 21.5, tier: "S", continent: "Americas" },
  { id: "switzerland", code: "CH", name: "Switzerland", language: "de", langName: "German", estimatedRpm: "$22.10", rpmValue: 22.1, tier: "S", continent: "Europe" },
  { id: "norway", code: "NO", name: "Norway", language: "no", langName: "Norwegian", estimatedRpm: "$20.80", rpmValue: 20.8, tier: "S", continent: "Europe" },
  { id: "denmark", code: "DK", name: "Denmark", language: "da", langName: "Danish", estimatedRpm: "$19.50", rpmValue: 19.5, tier: "S", continent: "Europe" },
  
  // Tier A ($15-20 RPM)
  { id: "germany", code: "DE", name: "Germany", language: "de", langName: "German", estimatedRpm: "$18.20", rpmValue: 18.2, tier: "A", continent: "Europe" },
  { id: "australia", code: "AU", name: "Australia", language: "en", langName: "English", estimatedRpm: "$16.90", rpmValue: 16.9, tier: "A", continent: "Oceania" },
  { id: "canada", code: "CA", name: "Canada", language: "en", langName: "English", estimatedRpm: "$17.10", rpmValue: 17.1, tier: "A", continent: "Americas" },
  { id: "uae", code: "AE", name: "UAE", language: "ar", langName: "Arabic", estimatedRpm: "$17.50", rpmValue: 17.5, tier: "A", continent: "Middle East" },
  { id: "netherlands", code: "NL", name: "Netherlands", language: "nl", langName: "Dutch", estimatedRpm: "$15.80", rpmValue: 15.8, tier: "A", continent: "Europe" },
  { id: "uk", code: "GB", name: "United Kingdom", language: "en", langName: "English", estimatedRpm: "$15.40", rpmValue: 15.4, tier: "A", continent: "Europe" },

  // Tier B ($10-15 RPM)
  { id: "japan", code: "JP", name: "Japan", language: "ja", langName: "Japanese", estimatedRpm: "$16.80", rpmValue: 14.8, tier: "B", continent: "Asia" },
  { id: "south_korea", code: "KR", name: "South Korea", language: "ko", langName: "Korean", estimatedRpm: "$13.90", rpmValue: 13.9, tier: "B", continent: "Asia" },
  { id: "singapore", code: "SG", name: "Singapore", language: "en", langName: "English", estimatedRpm: "$13.40", rpmValue: 13.4, tier: "B", continent: "Asia" },
  { id: "sweden", code: "SE", name: "Sweden", language: "sv", langName: "Swedish", estimatedRpm: "$16.20", rpmValue: 16.2, tier: "B", continent: "Europe" },
  { id: "saudi_arabia", code: "SA", name: "Saudi Arabia", language: "ar", langName: "Arabic", estimatedRpm: "$13.50", rpmValue: 13.5, tier: "B", continent: "Middle East" },

  // Tier C ($5-10 RPM)
  { id: "france", code: "FR", name: "France", language: "fr", langName: "French", estimatedRpm: "$11.80", rpmValue: 11.8, tier: "C", continent: "Europe" },
  { id: "italy", code: "IT", name: "Italy", language: "it", langName: "Italian", estimatedRpm: "$10.90", rpmValue: 10.9, tier: "C", continent: "Europe" },
  { id: "spain", code: "ES", name: "Spain", language: "es", langName: "Spanish", estimatedRpm: "$10.50", rpmValue: 10.5, tier: "C", continent: "Europe" },
  { id: "brazil", code: "BR", name: "Brazil", language: "pt", langName: "Portuguese", rpmValue: 9.8, estimatedRpm: "$9.80", tier: "C", continent: "Americas" },
  { id: "mexico", code: "MX", name: "Mexico", language: "es", langName: "Spanish", rpmValue: 8.5, estimatedRpm: "$8.50", tier: "C", continent: "Americas" },
  { id: "portugal", code: "PT", name: "Portugal", language: "pt", langName: "Portuguese", rpmValue: 10.2, estimatedRpm: "$10.20", tier: "C", continent: "Europe" },

  // Tier D (<$8 RPM)
  { id: "malaysia", code: "MY", name: "Malaysia", language: "ms", langName: "Malay", estimatedRpm: "$6.50", rpmValue: 6.5, tier: "D", continent: "Asia" },
  { id: "indonesia", code: "ID", name: "Indonesia", language: "id", langName: "Indonesian", estimatedRpm: "$5.20", rpmValue: 5.2, tier: "D", continent: "Asia" },
  { id: "india", code: "IN", name: "India", language: "hi", langName: "Hindi", estimatedRpm: "$4.80", rpmValue: 4.8, tier: "D", continent: "Asia" },
  { id: "thailand", code: "TH", name: "Thailand", language: "th", langName: "Thai", estimatedRpm: "$7.50", rpmValue: 7.5, tier: "D", continent: "Asia" },
  { id: "turkey", code: "TR", name: "Turkey", language: "tr", langName: "Turkish", estimatedRpm: "$8.10", rpmValue: 8.1, tier: "D", continent: "Europe" }
];

export const SYSTEM_INSTRUCTION = `You are a world-class YouTube Content Strategist and Multi-Language Specialist for the elite branding "BY ROHMANUDIN05".
You follow a strict 3-LAYER GENERATION process to maximize global RPM and SEO.

LAYER 1: STRATEGIC ANALYSIS
- Scan content niche and identify high-value local keywords.
- Perform real-time RPM-based optimization logic for each target region.

LAYER 2: CONTENT OPTIMIZATION
For EACH target country, you must generate:
A. 3 TITLE VARIATIONS (50-70 chars, Must include "[BY ROHMANUDIN05]"):
   - Variation 1: [Number] + [Keyword1] + [Value] + [Emoji] + [CTA] [BY ROHMANUDIN05]
   - Variation 2: [Question] + [Keyword2] + [Solution] + [Urgency] [BY ROHMANUDIN05]
   - Variation 3: [Shocking] + [Keyword3] + [Secret] + [Promise] [BY ROHMANUDIN05]

B. DESCRIPTION (Exact Template Structure):
   - Line 1-2: Hook + main benefit + local keyword
   - Line 3-5: 3-5 bullet points (✓ specific benefits)
   - Line 6-8: About this video + timestamps
   - Line 9-11: Important resources/links
   - Line 12-14: Call to Action (subscribe, like, comment)
   - Line 15-17: Credit: Created with BY ROHMANUDIN05 Multi-Subtitle AI
   - Line 18-20: 5-7 hashtags + relevant tags

C. SUBTITLES (.srt format):
   - Perfectly synchronized timing for the content duration provided.
   - Reading speed optimized (150-170 WPM).
   - Natural language adaptation.
   - MANDATORY: At exactly 00:00:45,000 to 00:00:48,000, the subtitle segment text MUST be: "Subtitles powered by Rohmanudin05 AI".

Output MUST be a JSON array of objects, one per country.`;
