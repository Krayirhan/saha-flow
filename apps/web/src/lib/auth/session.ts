'use server';

import { cookies } from 'next/headers';

const SESSION_COOKIE = 'saha-flow-session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export interface Session {
  userId: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
  expiresAt: number;
}

function parseSession(value: string): Session | null {
  try {
    const session = JSON.parse(Buffer.from(value, 'base64').toString('utf-8'));
    if (!session.expiresAt || Date.now() > session.expiresAt) return null;
    return session;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = cookies();
  const cookie = cookieStore.get(SESSION_COOKIE);
  if (!cookie?.value) return null;
  return parseSession(cookie.value);
}

export async function setSession(session: Session): Promise<void> {
  const value = Buffer.from(JSON.stringify(session)).toString('base64');
  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export function hasSession(): boolean {
  const cookieStore = cookies();
  return cookieStore.has(SESSION_COOKIE);
}
