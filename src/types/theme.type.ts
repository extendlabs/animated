export interface Theme {
  id: string;
  name: string;
  themeName: string; // e.g., 'vsDark', 'github'
  background: string;
  padding: number;
  radius: number;
  language: string;
  withLineIndex: boolean;
  cardTheme: string;
  user_id: string;
}