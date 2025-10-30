export function resolvePublicPath(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  return basePath ? `${basePath}${normalized}` : normalized;
}
