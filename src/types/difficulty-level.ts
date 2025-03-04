export type DifficultyLevel = {
  levelId: number;
  tag: string;
  name: string;
  description: string;
  orderSequence: number | null;
  createdAt: string;
  active: boolean;
};