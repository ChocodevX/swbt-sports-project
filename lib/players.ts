import Cookies from 'js-cookie';
import { supabase } from './supabase';

const COOKIE_NAME = 'pid';
const NAME_COOKIE = 'pname';
const COOKIE_DAYS = 7;

export function getStoredPlayerId(): string | undefined {
  return Cookies.get(COOKIE_NAME);
}

export function getStoredPlayerName(): string | undefined {
  return Cookies.get(NAME_COOKIE);
}

// Remove the stored login so the next visit shows the registration form.
export function clearStoredPlayer(): void {
  Cookies.remove(COOKIE_NAME);
  Cookies.remove(NAME_COOKIE);
}

// Re-set the cookies with a fresh expiry so active returning users aren't
// logged out at the 7-day mark. No-op if there's no stored player.
export function refreshPlayerCookie(): void {
  const id = Cookies.get(COOKIE_NAME);
  if (!id) return;
  Cookies.set(COOKIE_NAME, id, { expires: COOKIE_DAYS });
  const name = Cookies.get(NAME_COOKIE);
  if (name) Cookies.set(NAME_COOKIE, name, { expires: COOKIE_DAYS });
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
  Cookies.set(COOKIE_NAME, data.id, { expires: COOKIE_DAYS });
  Cookies.set(NAME_COOKIE, `${firstName} ${lastName}`.trim(), { expires: COOKIE_DAYS });
  return data.id;
}
