export type TeamColor = 'red' | 'green' | 'blue' | 'yellow';
export type BuildingCode = 'B1' | 'B6' | 'B7';
export type GameType = 'speed_67' | 'pushup' | 'boxing';

export type Classroom = {
  id: number;
  name: string;
  color: TeamColor;
  building: BuildingCode;
};

export type Player = {
  id: string;
  first_name: string;
  last_name: string;
  classroom_id: number;
  total_score: number;
  play_count_today: number;
  last_played_date: string | null;
  device_fingerprint: string | null;
  created_at: string;
};
