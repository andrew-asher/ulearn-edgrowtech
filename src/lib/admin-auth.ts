const KEY = "edgrow-admin-auth";

// Demo-only credentials. Replace with real auth (Lovable Cloud) for production.
export const ADMIN_EMAIL = "admin@edgrow.lk";
export const ADMIN_PASSWORD = "admin123";

export function isAdminAuthed(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(KEY) === "1";
}

export function signInAdmin(email: string, password: string): boolean {
  if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    localStorage.setItem(KEY, "1");
    return true;
  }
  return false;
}

export function signOutAdmin() {
  if (typeof window !== "undefined") localStorage.removeItem(KEY);
}
