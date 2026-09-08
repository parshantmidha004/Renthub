export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  createdAt: string;
}

/** Payload used while registering a new user. */
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export type AuthResult = { ok: true; user: User } | { ok: false; error: string };
