export type WisdomType = 'quote' | 'financial' | 'parable';

export interface WisdomEntry {
  id: string;
  type: WisdomType;
  content: string;
  source?: string;
  date: string;
}