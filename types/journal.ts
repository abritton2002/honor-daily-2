export interface JournalPrompt {
  id: string;
  text: string;
  date: string;
}

export interface JournalEntry {
  id: string;
  promptId: string;
  content: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}