/** Routes anyone can open without logging in */
export const PUBLIC_PATHS = ["/", "/collections", "/login", "/register"];

export function isPublicPath(path: string): boolean {
  if (PUBLIC_PATHS.includes(path)) return true;
  return false;
}

export function loginUrl(redirectTo: string): string {
  return `/login?redirect=${encodeURIComponent(redirectTo)}`;
}
