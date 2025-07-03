export function formatDate(unixTime: number): string {
  return new Date(unixTime * 1000).toLocaleString();
}
