import { GlassIconButton, GlassSurface, glass } from '@/components/common/glass';
import { Search, X } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, Text, TextInput, View } from 'react-native';

const H = 48; // GlassIconButton size와 동일
const CANCEL_W = 52;

type Props = {
  title: string;
  open: boolean;
  onOpen: () => void;
  onCancel: () => void;
  onClosed: () => void; // 축소 애니메이션이 끝난 뒤 (입력값 초기화용)
  query: string;
  onChangeQuery: (q: string) => void;
  onSubmit: (q: string) => void;
  progress: Animated.Value; // 0 = 버튼, 1 = 검색창. 부모가 목록/오버레이 fade에도 같이 사용
};

/**
 * 버튼 → 검색창 morphing.
 * idle: GlassIconButton / 열릴 때: 같은 크기·위치의 GlassSurface pill로 즉시 교체(눈에 안 보임) 후
 * width·right·내용 opacity를 하나의 progress 값으로 함께 애니메이션 → 하나의 요소가 늘어나는 것처럼 보임.
 * 레이아웃(width) 애니메이션이라 JS driver를 사용하지만 대상이 pill 하나뿐이라 가볍다.
 */
export default function SearchMorphBar({
  title,
  open,
  onOpen,
  onCancel,
  onClosed,
  query,
  onChangeQuery,
  onSubmit,
  progress: p,
}: Props) {
  const [w, setW] = useState(0);
  const [pillOn, setPillOn] = useState(false);
  const input = useRef<TextInput>(null);

  useEffect(() => {
    if (open) {
      setPillOn(true);
      requestAnimationFrame(() => input.current?.focus()); // 확장과 동시에 키보드가 올라옴
      Animated.timing(p, {
        toValue: 1,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    } else if (pillOn) {
      Animated.timing(p, {
        toValue: 0,
        duration: 240,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished) {
          setPillOn(false);
          onClosed();
        }
      });
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const clamp = { extrapolate: 'clamp' as const };
  const width = p.interpolate({ inputRange: [0, 1], outputRange: [H, Math.max(w - CANCEL_W, H)] });
  const right = p.interpolate({ inputRange: [0, 1], outputRange: [0, CANCEL_W] });

  return (
    <View
      style={{ height: H, marginHorizontal: 16, marginBottom: 12 }}
      onLayout={(e) => setW(e.nativeEvent.layout.width)}
    >
      {/* 제목: 확장되면서 왼쪽으로 밀리며 사라짐 */}
      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          justifyContent: 'center',
          opacity: p.interpolate({ inputRange: [0, 0.35], outputRange: [1, 0], ...clamp }),
          transform: [{ translateX: p.interpolate({ inputRange: [0, 1], outputRange: [0, -16] }) }],
        }}
      >
        <Text className="text-[32px]">{title}</Text>
      </Animated.View>

      {!pillOn && (
        <View style={{ position: 'absolute', right: 0, top: 0 }}>
          <GlassIconButton icon={Search} label="검색" size={H} onPress={onOpen} />
        </View>
      )}

      {pillOn && (
        <Animated.View style={{ position: 'absolute', top: 0, right, width }}>
          <GlassSurface radius={H / 2} shadow="sm">
            <View
              style={{
                height: H,
                flexDirection: 'row',
                alignItems: 'center',
                paddingLeft: 13,
                paddingRight: 14,
                gap: 10,
              }}
            >
              <Search size={22} color={glass.ink} strokeWidth={2} />
              <Animated.View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  opacity: p.interpolate({
                    inputRange: [0.4, 0.85],
                    outputRange: [0, 1],
                    ...clamp,
                  }),
                }}
              >
                <TextInput
                  ref={input}
                  value={query}
                  onChangeText={onChangeQuery}
                  onSubmitEditing={() => onSubmit(query)}
                  placeholder="궁금한 소식을 찾아보세요"
                  placeholderTextColor={glass.inkMuted}
                  returnKeyType="search"
                  style={{
                    flex: 1,
                    fontSize: 15,
                    color: glass.ink,
                    fontWeight: '500',
                    paddingVertical: 0,
                  }}
                />
                {query.length > 0 && (
                  <Pressable
                    onPress={() => onChangeQuery('')}
                    hitSlop={8}
                    accessibilityLabel="입력 지우기"
                  >
                    <X size={16} color={glass.inkMuted} strokeWidth={2.5} />
                  </Pressable>
                )}
              </Animated.View>
            </View>
          </GlassSurface>
        </Animated.View>
      )}

      {/* 취소 */}
      <Animated.View
        pointerEvents={open ? 'auto' : 'none'}
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: CANCEL_W,
          justifyContent: 'center',
          alignItems: 'flex-end',
          opacity: p.interpolate({ inputRange: [0.5, 1], outputRange: [0, 1], ...clamp }),
        }}
      >
        <GlassIconButton icon={X} label="취소" onPress={onCancel} />
      </Animated.View>
    </View>
  );
}
