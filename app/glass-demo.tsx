import {
  ArrowRightIcon,
  BookmarkIcon,
  ChevronLeftIcon,
  HeartIcon,
  PlusIcon,
  SearchIcon,
  SparklesIcon,
  XIcon,
} from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// 경로는 프로젝트에 맞게 수정하세요.
import {
  GlassButton,
  GlassCard,
  GlassChipGroup,
  GlassIconButton,
  GlassInput,
  GlassSection,
  GlassSegmented,
  GlassSurface,
  glass,
} from '../components/common/glass';

const CATEGORIES = [
  { value: 'all', label: '전체' },
  { value: 'news', label: '금융 뉴스' },
  { value: 'policy', label: '청년 정책' },
  { value: 'term', label: '용어' },
  { value: 'spend', label: '소비' },
] as const;
type Category = (typeof CATEGORIES)[number]['value'];

export default function GlassShowcase() {
  const insets = useSafeAreaInsets();
  const [category, setCategory] = useState<Category>('all');
  const [view, setView] = useState<'card' | 'list'>('card');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(false);

  const fakeSubmit = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <View style={styles.root}>
      {/* glass는 배경이 있어야 보입니다. 데모용 색 덩어리 */}
      <View
        style={[
          styles.blob,
          { top: -60, right: -80, width: 280, height: 280, backgroundColor: '#F7D66A' },
        ]}
      />
      <View
        style={[
          styles.blob,
          { top: 260, left: -100, width: 300, height: 300, backgroundColor: '#AFCFEA' },
        ]}
      />
      <View
        style={[
          styles.blob,
          { bottom: 40, right: -60, width: 260, height: 260, backgroundColor: '#B7C98A' },
        ]}
      />

      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingTop: insets.top + 12,
          paddingBottom: insets.bottom + 120,
          gap: 28,
        }}
      >
        {/* 헤더: 아이콘 버튼 */}
        <View style={styles.header}>
          <GlassIconButton icon={ChevronLeftIcon} label="뒤로" onPress={() => {}} />
          <Text style={styles.title}>Glass Showcase</Text>
          <GlassIconButton
            icon={liked ? XIcon : HeartIcon}
            label="좋아요"
            variant="solid"
            onPress={() => setLiked((v) => !v)}
          />
        </View>

        {/* 입력 + 필터 + 세그먼트 */}
        <View style={{ gap: 12 }}>
          <GlassInput
            icon={SearchIcon}
            placeholder="용어, 정책 검색"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
          <GlassChipGroup options={[...CATEGORIES]} value={category} onChange={setCategory} />
          <GlassSegmented
            options={[
              { value: 'card', label: '카드' },
              { value: 'list', label: '리스트' },
            ]}
            value={view}
            onChange={setView}
          />
        </View>

        {/* 섹션 + 카드 */}
        <GlassSection
          title="오늘의 카드뉴스"
          description={`${CATEGORIES.find((c) => c.value === category)?.label} · ${view === 'card' ? '카드' : '리스트'} 보기`}
          action={
            <GlassButton
              size="sm"
              variant="ghost"
              label="더보기"
              icon={ArrowRightIcon}
              iconPosition="right"
            />
          }
        >
          <Text style={styles.body}>
            섹션 안에는 어떤 내용이든 넣을 수 있습니다. 기본 카드 안에 들어갑니다.
          </Text>
        </GlassSection>

        <GlassSection title="눌리는 카드" card={false}>
          <View style={{ gap: 12 }}>
            {['기준금리가 뭐예요?', '청년도약계좌 한눈에 보기'].map((t) => (
              <GlassCard key={t} onPress={() => {}}>
                <Text style={styles.cardTitle}>{t}</Text>
                <Text style={styles.body}>카드 전체가 눌리고, 살짝 작아졌다 돌아옵니다.</Text>
              </GlassCard>
            ))}
          </View>
        </GlassSection>

        {/* 버튼 변형 */}
        <GlassSection title="Buttons">
          <View style={{ gap: 12 }}>
            <GlassButton label="Glass" icon={SparklesIcon} onPress={() => {}} />
            <GlassButton label="Solid" variant="solid" icon={PlusIcon} onPress={() => {}} />
            <GlassButton label="Ghost" variant="ghost" onPress={() => {}} />
            <GlassButton
              label={loading ? '저장 중' : '눌러서 로딩 보기'}
              variant="solid"
              loading={loading}
              fullWidth
              onPress={fakeSubmit}
            />
            <GlassButton label="비활성" disabled fullWidth />
            <View style={styles.row}>
              <GlassButton size="sm" label="Small" />
              <GlassButton size="md" label="Medium" />
              <GlassButton size="lg" label="Large" />
            </View>
            <View style={styles.row}>
              <GlassIconButton icon={BookmarkIcon} label="저장" />
              <GlassIconButton icon={HeartIcon} label="좋아요" variant="solid" />
              <GlassIconButton icon={PlusIcon} label="추가" size={56} />
            </View>
          </View>
        </GlassSection>

        {/* 직접 조합: GlassSurface */}
        <GlassSurface radius={20} shadow="lg" contentStyle={{ padding: 18 }}>
          <Text style={styles.cardTitle}>GlassSurface</Text>
          <Text style={styles.body}>
            새 컴포넌트를 만들 때 바탕으로 쓰세요. radius, shadow(none/sm/md/lg), intensity를 조절할
            수 있습니다.
          </Text>
        </GlassSurface>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFF9EC', overflow: 'hidden' },
  blob: { position: 'absolute', borderRadius: 999, opacity: 0.75 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 20, fontWeight: '700', color: glass.ink },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  cardTitle: { fontSize: 17, fontWeight: '700', color: glass.ink, marginBottom: 4 },
  body: { fontSize: 14, lineHeight: 21, color: glass.inkMuted },
});
