import DetailHeader from '@/components/common/DetailHeader';
import { GlassCard, GlassSurface, glass } from '@/components/common/glass';
import TermModal from '@/components/learning/term-modal';
import { useToggleTermSave } from '@/hooks/queries/mutations';
import { useSavedTermsAll } from '@/hooks/queries/queries';
import type { Term } from '@/types/learning';
import { Stack } from 'expo-router';
import { BookOpen } from 'lucide-react-native';
import { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CHO = [
  'ㄱ',
  'ㄲ',
  'ㄴ',
  'ㄷ',
  'ㄸ',
  'ㄹ',
  'ㅁ',
  'ㅂ',
  'ㅃ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅉ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
];
const BASE: Record<string, string> = { ㄲ: 'ㄱ', ㄸ: 'ㄷ', ㅃ: 'ㅂ', ㅆ: 'ㅅ', ㅉ: 'ㅈ' };
const RAIL = [
  'ㄱ',
  'ㄴ',
  'ㄷ',
  'ㄹ',
  'ㅁ',
  'ㅂ',
  'ㅅ',
  'ㅇ',
  'ㅈ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
  '#',
];

// 한글 음절의 초성 추출 (쌍자음은 기본 자음으로 합침). 한글이 아니면 '#'
function initial(term: string) {
  const c = term.trim().charCodeAt(0);
  if (c >= 0xac00 && c <= 0xd7a3) {
    const j = CHO[Math.floor((c - 0xac00) / 588)];
    return BASE[j] ?? j;
  }
  return '#';
}

export default function SavedTermsScreen() {
  const scroll = useRef<ScrollView>(null);
  const ys = useRef<Record<string, number>>({});

  const { data: terms = [], isLoading, error, refetch } = useSavedTermsAll(); // GET /api/me/saved-terms
  const [activeTerm, setActiveTerm] = useState<Term | null>(null);
  const toggleTerm = useToggleTermSave();
  const isSaved = (id: string) => terms.some((t) => t.id === id);

  const groups = useMemo(() => {
    const m = new Map<string, Term[]>();
    [...terms]
      .sort((a, b) => a.term.localeCompare(b.term, 'ko'))
      .forEach((t) => {
        const k = initial(t.term);
        m.set(k, [...(m.get(k) ?? []), t]);
      });
    return RAIL.filter((k) => m.has(k)).map((k) => ({ k, items: m.get(k)! }));
  }, [terms]);
  const has = new Set(groups.map((g) => g.k));

  const jump = (k: string) => {
    if (has.has(k))
      scroll.current?.scrollTo({ y: Math.max((ys.current[k] ?? 0) - 8, 0), animated: true });
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: '#F9F9F9' }}>
      <Stack.Screen
        options={{ headerShown: false, animation: 'slide_from_right', gestureEnabled: true }}
      />
      <DetailHeader title="저장한 용어" subtitle={`${terms.length}개`} />
      {isLoading && <ActivityIndicator style={{ marginTop: 40 }} color="#898989" />}
      {error && terms.length === 0 && (
        <View style={{ alignItems: 'center', marginTop: 40, gap: 8 }}>
          <Text style={{ color: glass.inkMuted }}>저장한 용어를 불러오지 못했어요</Text>
          <TouchableOpacity onPress={() => void refetch()}>
            <Text style={{ fontWeight: '700', color: glass.ink }}>다시 시도</Text>
          </TouchableOpacity>
        </View>
      )}
      {!isLoading && !error && terms.length === 0 && (
        <Text style={{ textAlign: 'center', marginTop: 140, color: glass.inkMuted }}>
          저장한 용어가 없어요
        </Text>
      )}

      <ScrollView
        ref={scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 20, paddingRight: 44, paddingBottom: 60, gap: 20 }}
      >
        {groups.map(({ k, items }) => (
          <View
            key={k}
            onLayout={(e) => {
              ys.current[k] = e.nativeEvent.layout.y;
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: '800',
                color: glass.inkMuted,
                marginBottom: 8,
                marginLeft: 4,
              }}
            >
              {k}
            </Text>
            <GlassCard padding={0} radius={22} shadow="sm">
              {items.map((t, i) => (
                <TouchableOpacity
                  key={t.id}
                  onPress={() => setActiveTerm(t)} // 탭하면 TermModal
                  accessibilityRole="button"
                  accessibilityLabel={`${t.term} 뜻 보기`}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                    paddingHorizontal: 18,
                    paddingVertical: 15,
                    borderTopWidth: i ? 1 : 0,
                    borderTopColor: glass.inkFaint,
                  }}
                >
                  <BookOpen size={14} color={glass.inkMuted} />
                  <Text style={{ fontSize: 16, fontWeight: '600', color: glass.ink }}>
                    {t.term}
                  </Text>
                </TouchableOpacity>
              ))}
            </GlassCard>
          </View>
        ))}
      </ScrollView>

      {/* 초성 빠른 이동 레일 (없는 초성은 흐리게) */}
      <View
        pointerEvents="box-none"
        style={{ position: 'absolute', right: 6, top: 0, bottom: 0, justifyContent: 'center' }}
      >
        <GlassSurface radius={14} shadow="sm" contentStyle={{ paddingVertical: 6 }}>
          {RAIL.map((k) => (
            <Pressable
              key={k}
              onPress={() => jump(k)}
              hitSlop={{ left: 8, right: 8 }}
              style={{ width: 28, height: 22, alignItems: 'center', justifyContent: 'center' }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '700',
                  color: has.has(k) ? glass.ink : 'rgba(34,39,43,0.25)',
                }}
              >
                {k}
              </Text>
            </Pressable>
          ))}
        </GlassSurface>
      </View>

      <TermModal
        term={activeTerm}
        isSaved={activeTerm ? isSaved(activeTerm.id) : false}
        onSave={(t) => toggleTerm.mutate({ termId: t.id, next: true })}
        onUnsave={(t) => toggleTerm.mutate({ termId: t.id, next: false })}
        onClose={() => setActiveTerm(null)}
      />
    </SafeAreaView>
  );
}
