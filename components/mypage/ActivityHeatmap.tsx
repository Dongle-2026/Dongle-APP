import type { ActivityDay } from '@/types/mypage';
import { useRef } from 'react';
import { ScrollView, Text, View } from 'react-native';

type Props = {
  data: ActivityDay[];
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
  const scrollViewRef = useRef<ScrollView>(null);

  if (!data || data.length === 0) return null;

  // 1. 데이터 날짜순 정렬 및 맵 변환
  const sortedData = [...data].sort((a, b) => a.date.localeCompare(b.date));
  const dataMap = new Map<string, ActivityDay>();
  sortedData.forEach((item) => dataMap.set(item.date, item));

  const startDateStr = sortedData[0].date;
  const endDateStr = sortedData[sortedData.length - 1].date;

  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  const dayOfWeek = startDate.getDay(); // 0(일) ~ 6(토)
  const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const calendarStart = new Date(startDate);
  calendarStart.setDate(calendarStart.getDate() - mondayOffset);

  // 2. 주(Week) 단위 컬럼 생성
  const weeks: ActivityDay[][] = [];
  const monthLabels: { label: string; weekIndex: number }[] = [];

  let currentDate = new Date(calendarStart);
  let weekIndex = 0;
  let lastYearMonth = '';

  while (currentDate <= endDate) {
    const currentWeek: ActivityDay[] = [];

    for (let i = 0; i < 7; i++) {
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;

      const dayData = dataMap.get(dateKey) || { date: dateKey, honey: 0, level: 0 };
      currentWeek.push(dayData);

      // 월이 바뀌는 첫 날 체크
      const yearMonthKey = `${year}-${month}`;
      if (yearMonthKey !== lastYearMonth && i === 0) {
        const isNewYear = month === '01';
        const displayLabel = isNewYear
          ? `${String(year).slice(2)}년 1월`
          : `${parseInt(month, 10)}월`;

        monthLabels.push({ label: displayLabel, weekIndex });
        lastYearMonth = yearMonthKey;
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    weeks.push(currentWeek);
    weekIndex++;
  }

  return (
    <View className="flex-col gap-2">
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 4, gap: 4 }}
        // 💡 화면이 처음 렌더링되거나 레이아웃이 잡힌 직후 가장 오른쪽(오늘 날짜)으로 스크롤 이동
        onLayout={() => {
          scrollViewRef.current?.scrollToEnd({ animated: false });
        }}
      >
        <View className="flex-col gap-1">
          {/* 월 헤더 레이블 행 */}
          <View style={{ flexDirection: 'row', marginLeft: 22, height: 16, position: 'relative' }}>
            {monthLabels.map((m, idx) => {
              const leftPosition = m.weekIndex * 18; // 칸 너비(14) + gap(4) = 18
              return (
                <Text
                  key={idx}
                  style={{
                    position: 'absolute',
                    left: leftPosition,
                    fontSize: 10,
                    color: '#8C8C8C',
                    fontWeight: '600',
                  }}
                >
                  {m.label}
                </Text>
              );
            })}
          </View>

          {/* 히트맵 그리드 */}
          <View style={{ flexDirection: 'row', gap: 4, alignItems: 'flex-start' }}>
            {/* 요일 레이블 */}
            <View style={{ gap: 4, marginRight: 2, paddingTop: 2 }}>
              {WEEK_LABELS.map((label, i) => (
                <View
                  key={i}
                  style={{ width: 14, height: 14, alignItems: 'center', justifyContent: 'center' }}
                >
                  <Text style={{ fontSize: 9, color: '#A0A0A0', fontWeight: '500' }}>{label}</Text>
                </View>
              ))}
            </View>

            {/* 주별 컬럼 */}
            {weeks.map((week, wIdx) => (
              <View key={wIdx} style={{ gap: 4 }}>
                {week.map((day, dIdx) => (
                  <View
                    key={`${wIdx}-${dIdx}`}
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 3,
                      backgroundColor: LEVEL_COLORS[day?.level ?? 0],
                    }}
                  />
                ))}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* 범례 */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
          justifyContent: 'flex-end',
          marginTop: 4,
        }}
      >
        <Text style={{ fontSize: 9, color: '#A0A0A0' }}>없음</Text>
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
        <Text style={{ fontSize: 9, color: '#A0A0A0' }}>많음</Text>
      </View>
    </View>
  );
}
