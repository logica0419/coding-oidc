export function redirectTo(url: string): void {
  const location = globalThis.location as unknown as { href: string };
  location.href = url;
}
