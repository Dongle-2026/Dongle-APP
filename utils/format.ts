const startOfDay = (t: number) => {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

// ISO 시각 → '오늘' / '어제' / 'N일 전' / 'YYYY.MM.DD' (기기 시간대 기준)
export function formatRelative(iso: string, now = Date.now()): string {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return '';
  const diff = Math.floor((startOfDay(now) - startOfDay(t)) / 86_400_000);
  if (diff <= 0) return '오늘';
  if (diff === 1) return '어제';
  if (diff < 7) return `${diff}일 전`;
  const d = new Date(t);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}
