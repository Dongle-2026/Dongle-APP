import { glass } from '@/components/common/glass';
import { useNewsDetail } from '@/context/NewsDetailContext';
import type { ReadHistory, SavedNews } from '@/types/saved';
import { formatRelative } from '@/utils/format';
import { Bookmark, ChevronRight, Clock } from 'lucide-react-native';
import { useRef } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

// 리스트용 행. 홈 카드와 같은 useNewsDetail().open()으로 기존 뉴스 상세(전환 애니메이션 포함)에 연결.
// 행마다 블러를 쓰면 긴 목록에서 무거우므로 일반 콘텐츠로 두고, 블러는 헤더·카드에만 사용.
export default function NewsRow({
  item,
  variant,
}: {
  item: SavedNews | ReadHistory;
  variant: 'saved' | 'recent';
}) {
  const { open } = useNewsDetail();
  const ref = useRef<View>(null);
  const when = 'savedAt' in item ? item.savedAt : item.readAt; // 둘 다 ISO 시각
  const category = 'category' in item ? item.category : undefined;
  const meta = [category, formatRelative(when)].filter(Boolean).join(' · ');

  return (
    <TouchableOpacity
      onPress={() =>
        open({ newsId: item.id, image: item.image ?? '', title: item.title, cardRef: ref })
      }
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingVertical: 10,
      }}
    >
      <View
        ref={ref}
        collapsable={false}
        style={{
          width: 72,
          height: 72,
          borderRadius: 18,
          overflow: 'hidden',
          backgroundColor: '#F0EEEC',
        }}
      >
        {/* 응답에 썸네일이 없으면 배경색 박스만 */}
        {item.image ? (
          <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%' }} />
        ) : null}
      </View>
      <View style={{ flex: 1, gap: 4 }}>
        <Text
          numberOfLines={2}
          style={{ fontSize: 15, lineHeight: 21, fontWeight: '700', color: glass.ink }}
        >
          {item.title}
        </Text>
        {meta ? <Text style={{ fontSize: 12, color: glass.inkMuted }}>{meta}</Text> : null}
        {variant === 'recent' && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Clock size={11} color={glass.inkMuted} />
            <Text style={{ fontSize: 11, color: glass.inkMuted }}>읽음</Text>
          </View>
        )}
      </View>
      {variant === 'saved' ? (
        <Bookmark size={18} color={glass.ink} fill="#FFDC53" />
      ) : (
        <ChevronRight size={16} color={glass.inkMuted} />
      )}
    </TouchableOpacity>
  );
}
