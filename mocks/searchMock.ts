// 검색 화면 전용 목업 데이터
// 실제 연동 시 각 함수를 API 호출로 교체

export const RECENT_SEARCHES = ['기준금리', '청년도약계좌', '부동산 PF', '인플레이션'];

export const TRENDING_KEYWORDS = [
  { rank: 1, keyword: '기준금리', change: 'up' as const },
  { rank: 2, keyword: '청년창업', change: 'up' as const },
  { rank: 3, keyword: '부동산', change: 'same' as const },
  { rank: 4, keyword: '주식시장', change: 'down' as const },
  { rank: 5, keyword: '청년도약계좌', change: 'up' as const },
  { rank: 6, keyword: '환율', change: 'down' as const },
  { rank: 7, keyword: '물가', change: 'same' as const },
  { rank: 8, keyword: '취업', change: 'up' as const },
];
