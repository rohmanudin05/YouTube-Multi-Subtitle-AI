
import { SrtSegment } from '../types';

export function convertToSrt(segments: SrtSegment[]): string {
  return segments
    .map((seg) => {
      return `${seg.index}\n${seg.startTime} --> ${seg.endTime}\n${seg.text}\n`;
    })
    .join('\n');
}

export function formatTime(seconds: number): string {
  const date = new Date(0);
  date.setSeconds(seconds);
  const hhmmss = date.toISOString().substr(11, 8);
  const ms = Math.floor((seconds % 1) * 1000).toString().padStart(3, '0');
  return `${hhmmss},${ms}`;
}
