import Cookies from 'js-cookie';
import { supabase } from './supabase';

const COOKIE_NAME = 'pid';

export function getStoredPlayerId(): string | undefined {
  return Cookies.get(COOKIE_NAME);
}

export async function registerPlayer(
  firstName: string,
  lastName: string,
  classroomId: number
): Promise<string | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('players')
    .insert({ first_name: firstName, last_name: lastName, classroom_id: classroomId })
    .select('id')
    .single();
  if (error || !data) return null;
  Cookies.set(COOKIE_NAME, data.id, { expires: 7 });
  return data.id;
}
