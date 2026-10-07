import { glass, GlassCard } from '@/components/common/glass';
import { useNewsDetail } from '@/context/NewsDetailContext';
import { useRef } from 'react';
import { Image, Text, View } from 'react-native';

export type NewsLite = {
  id: string;
  thumbnail: string;
  title: string;
  category?: string;
  date?: string;
  readAt?: string | number;
};

// 리스트용 행. 홈 카드와 같은 useNewsDetail().open()으로 기존 뉴스 상세(전환 애니메이션 포함)에 연결.
// 행마다 블러를 쓰면 긴 목록에서 무거우므로 일반 콘텐츠로 두고, 블러는 헤더·카드에만 사용.
export default function NewsRow({
  item,
  variant,
}: {
  item: NewsLite;
  variant: 'saved' | 'recent';
}) {
  const { open } = useNewsDetail();
  const ref = useRef<View>(null);
  const meta = [item.category, item.date].filter(Boolean).join(' · ');
  return (
    <GlassCard
      onPress={() =>
        open({ newsId: item.id, thumbnail: item.thumbnail, title: item.title, cardRef: ref })
      }
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
          <Image source={{ uri: item.thumbnail }} style={{ width: '100%', height: '100%' }} />
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          <Text
            numberOfLines={2}
            style={{ fontSize: 16, lineHeight: 22, fontWeight: '600', color: glass.ink }}
          >
            {item.title}
          </Text>
          {meta ? <Text style={{ fontSize: 12, color: glass.inkMuted }}>{meta}</Text> : null}
          {/* {variant === 'saved' ? (
          <GlassIconButton icon={Bookmark} label="저장됨" variant="solid" />
        ) : (
          <GlassIconButton icon={Bookmark} label="저장" />
        )} */}
        </View>
      </View>
    </GlassCard>
  );
}
