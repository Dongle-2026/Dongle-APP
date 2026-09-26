import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { BookmarkIcon, HomeIcon, SearchIcon, UserIcon } from 'lucide-react-native';
import type { ComponentProps } from 'react';
import { useEffect, useRef } from 'react';
import { Animated, Dimensions, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

// ─── 탭 메타 정보 ─────────────────────────────────────────────────────────────

const TAB_ITEMS = [
  { name: 'index', Icon: HomeIcon, label: '홈' },
  { name: 'search', Icon: SearchIcon, label: '검색' },
  { name: 'saved', Icon: BookmarkIcon, label: '저장' },
  { name: 'mypage', Icon: UserIcon, label: '마이' },
] as const;

const TAB_COUNT = TAB_ITEMS.length;

// ─── 색상 / 크기 상수 ─────────────────────────────────────────────────────────

const BAR_HEIGHT = 64;
const BAR_MX = 20; // 좌우 margin
const PILL_H = 44;
const ICON_SIZE = 22;
const SCREEN_W = Dimensions.get('window').width;
const INNER_W = SCREEN_W - BAR_MX * 2;
const SLOT_W = INNER_W / TAB_COUNT;
const PILL_W = SLOT_W - 16; // 슬롯보다 좌우 8px씩 여유

// ─── 단일 탭 아이템 ───────────────────────────────────────────────────────────

type TabItemProps = {
  item: (typeof TAB_ITEMS)[number];
  isActive: boolean;
  onPress: () => void;
  onLongPress: () => void;
};

function TabItem({ item, isActive, onPress, onLongPress }: TabItemProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isActive ? 1.08 : 1,
      useNativeDriver: true,
      damping: 14,
      stiffness: 220,
    }).start();
  }, [isActive]);

  const { Icon } = item;

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.8}
      style={styles.tabSlot}
      accessibilityRole="button"
      accessibilityLabel={item.label}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Icon
          size={ICON_SIZE}
          color="#22272B"
          strokeWidth={isActive ? 2.4 : 1.8}
          fill={isActive ? '#22272B' : 'transparent'}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

// ─── 메인 탭바 ───────────────────────────────────────────────────────────────

export default function TabBar({ state, descriptors, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const pillX = useRef(new Animated.Value(8)).current; // 초기: 첫 슬롯 중앙

  // active 탭 인덱스 → pill X 위치 애니메이션
  useEffect(() => {
    const idx = state.index;
    const targetX = idx * SLOT_W + (SLOT_W - PILL_W) / 2;

    Animated.spring(pillX, {
      toValue: targetX,
      useNativeDriver: true,
      damping: 18,
      stiffness: 200,
      mass: 0.8,
    }).start();
  }, [state.index]);

  return (
    <View
      style={[styles.wrapper, { paddingBottom: insets.bottom > 0 ? insets.bottom : 12 }]}
      pointerEvents="box-none"
    >
      {/* Glass container */}
      <View style={styles.barContainer}>
        {/* iOS: BlurView / Android: 반투명 흰 배경 */}
        {Platform.OS === 'ios' ? (
          <BlurView intensity={60} tint="light" style={StyleSheet.absoluteFill} />
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.androidBg]} />
        )}

        {/* 얇은 테두리 오버레이 */}
        <View style={[StyleSheet.absoluteFill, styles.borderOverlay]} />

        {/* Pill indicator (배경에 먼저 렌더) */}
        <Animated.View style={[styles.pill, { transform: [{ translateX: pillX }] }]} />

        {/* 탭 아이템들 */}
        <View style={styles.tabRow}>
          {TAB_ITEMS.map((item, idx) => {
            const isFocused = state.index === idx;
            const { options } = descriptors[state.routes[idx]?.key ?? ''] ?? {};

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: state.routes[idx]?.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(state.routes[idx]?.name ?? item.name);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: state.routes[idx]?.key,
              });
            };

            return (
              <TabItem
                key={item.name}
                item={item}
                isActive={isFocused}
                onPress={onPress}
                onLongPress={onLongPress}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
}

// ─── 스타일 ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    // 탭바 위로 터치 이벤트 통과
    pointerEvents: 'box-none',
  },

  barContainer: {
    width: INNER_W,
    height: BAR_HEIGHT,
    borderRadius: BAR_HEIGHT / 2,
    overflow: 'hidden',
    // 그림자
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
      },
      android: {
        elevation: 12,
      },
    }),
  },

  androidBg: {
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
  },

  borderOverlay: {
    borderRadius: BAR_HEIGHT / 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
  },

  pill: {
    position: 'absolute',
    top: (BAR_HEIGHT - PILL_H) / 2,
    width: PILL_W,
    height: PILL_H,
    borderRadius: PILL_H / 2,
    backgroundColor: 'rgba(34, 39, 43, 0.08)',
  },

  tabRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  tabSlot: {
    width: SLOT_W,
    height: BAR_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
