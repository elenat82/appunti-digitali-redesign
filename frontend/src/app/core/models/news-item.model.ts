export interface NewsItem {
  id: number;
  title: string;
  url: string;
  source: string;
  author: string | null;
  date: number;
}
