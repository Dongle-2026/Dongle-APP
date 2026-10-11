import { glass, GlassCard } from '@/components/common/glass';
import { useNewsDetail } from '@/context/NewsDetailContext';
import { ReadHistory, SavedNews } from '@/types/saved';
import { useRef } from 'react';
import { Image, Text, View } from 'react-native';

type NewsRowProps = {
  item: SavedNews | ReadHistory;
  variant: 'saved' | 'recent';
};

// 타입 가드: ReadHistory 인지 확인
function isReadHistory(item: SavedNews | ReadHistory): item is ReadHistory {
  return 'readAt' in item;
}

export default function NewsRow({ item, variant }: NewsRowProps) {
  const { open } = useNewsDetail();
  const ref = useRef<View>(null);

  // variant / 데이터 타입에 따른 메타데이터 텍스트 구성
  const meta = isReadHistory(item)
    ? [item.readAt, item.honey ? `+${item.honey} 꿀` : null].filter(Boolean).join(' · ')
    : [item.category, item.createdAt || item.savedAt].filter(Boolean).join(' · ');

  return (
    <GlassCard
      onPress={() => open({ newsId: item.id, image: item.image, title: item.title, cardRef: ref })}
      padding={16}
    >
      <View
        style={{
          flexDirection: 'row',
          gap: 14,
          width: '100%',
        }}
      >
        <View
          ref={ref}
          collapsable={false}
          style={{
            width: 85,
            height: 85,
            borderRadius: 16,
            overflow: 'hidden',
            backgroundColor: '#F0EEEC',
          }}
        >
          <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%' }} />
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          <Text
            numberOfLines={2}
            style={{ fontSize: 16, lineHeight: 22, fontWeight: '600', color: glass.ink }}
          >
            {item.title}
          </Text>
          {meta ? <Text style={{ fontSize: 12, color: glass.inkMuted }}>{meta}</Text> : null}
        </View>
      </View>
    </GlassCard>
  );
}
