export interface Trade {
  id: number;
  symbol: string;
  openDate: Date;
  closeDate?: Date;
  openingNote?: string;
  closingNote?: string;
  tags: string[];
  projectId: string;
}