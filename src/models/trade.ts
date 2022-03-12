export interface Trade {
  id: string;
  symbol: string;
  openDate: Date;
  closeDate?: Date;
  openingNote?: string;
  closingNote?: string;
  tags: string[];
  projectId: string;
}