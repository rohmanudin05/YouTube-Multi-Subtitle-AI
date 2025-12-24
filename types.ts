
export interface Country {
  id: string;
  code: string;
  name: string;
  language: string;
  estimatedRpm: string;
}

export interface ExtendedCountry extends Country {
  langName: string;
  tier: 'S' | 'A' | 'B' | 'C' | 'D';
  continent: string;
  rpmValue: number;
}

export interface GeneratedContent {
  country: string;
  language: string;
  titles: string[];
  description: string;
  subtitles: SrtSegment[];
}

export interface SrtSegment {
  index: number;
  startTime: string; // HH:MM:SS,mmm
  endTime: string;
  text: string;
}

export type InputMode = 'file' | 'script';

export interface GenerationState {
  isGenerating: boolean;
  progress: number;
  status: string;
  error: string | null;
  results: GeneratedContent[] | null;
}
