export interface StackOverflowQuestion {
  id: number;
  title: string;
  url: string;
  tags: string[];
  score: number;
  answerCount: number;
  isAnswered: boolean;
  lastActivityDate: number;
}
