import type { ActivityDay } from '@/types/mypage';
import { Text, View } from 'react-native';

type Props = {
  data: ActivityDay[]; // 최근 126일 (18주)
};

const LEVEL_COLORS: Record<number, string> = {
  0: '#F0EEEC',
  1: '#FFF7C2',
  2: '#FFEB8A',
  3: '#FFDC53',
  4: '#FFCD2C',
};

const WEEK_LABELS = ['월', '', '수', '', '금', '', '일'];

export default function ActivityHeatmap({ data }: Props) {
  // 105일을 7행(요일) × 15열(주) 2차원 배열로 변환
  const weeks: ActivityDay[][] = [];
  for (let w = 0; w < 18; w++) {
    weeks.push(data.slice(w * 7, w * 7 + 7));
  }

  const totalHoney = data.reduce((s, d) => s + d.honey, 0);
  const activeDays = data.filter((d) => d.level > 0).length;

  return (
    <View className="flex-col gap-4">
      {/* Grid */}
      <View style={{ flexDirection: 'row', gap: 2 }}>
        {/* 요일 레이블 */}
        <View style={{ gap: 2, marginRight: 4 }}>
          {WEEK_LABELS.map((label, i) => (
            <View
              key={i}
              style={{ width: 14, height: 14, alignItems: 'center', justifyContent: 'center' }}
            >
              <Text style={{ fontSize: 10, color: '#D9D9D9', fontWeight: '600' }}>{label}</Text>
            </View>
          ))}
        </View>

        {/* 주별 컬럼 */}
        {weeks.map((week, wIdx) => (
          <View key={wIdx} style={{ gap: 2 }}>
            {week.map((day, dIdx) => (
              <View
                key={`${wIdx}-${dIdx}`}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 2.5,
                  backgroundColor: LEVEL_COLORS[day.level],
                }}
              />
            ))}
          </View>
        ))}
      </View>

      {/* Legend */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
          justifyContent: 'flex-end',
        }}
      >
        <Text style={{ fontSize: 9, color: '#D9D9D9' }}>없음</Text>
        {[0, 1, 2, 3, 4].map((l) => (
          <View
            key={l}
            style={{
              width: 9,
              height: 9,
              borderRadius: 2,
              backgroundColor: LEVEL_COLORS[l],
            }}
          />
        ))}
        <Text style={{ fontSize: 9, color: '#D9D9D9' }}>많음</Text>
      </View>
    </View>
  );
}
