export type Month = {
  id: string;
  month_key: string;
  month_title: string;
  sort_order: number;
  income: number;
  expense: number;
  investment: number;
  note: string;
  song_url: string;
  color_from: string;
  color_to: string;
};

export type Goal = {
  id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  is_done: boolean;
  sort_order: number;
};

export type ChecklistItem = {
  id: string;
  title: string;
  is_done: boolean;
  sort_order: number;
};

export type Media = {
  id: string;
  type: "couple_photo" | "month_photo" | "month_song";
  month_id: string | null;
  url: string;
  storage_path: string;
  caption: string;
  sort_order: number;
};
