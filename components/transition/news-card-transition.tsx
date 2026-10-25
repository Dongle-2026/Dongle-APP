import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode, RefObject } from 'react';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export type NewsCardTransitionRef = {
  close: () => void;
};

type NewsCardTransitionProps = {
  image: string;
  title: string;
  cardRef: RefObject<View | null>;
  onClose: () => void;
  children: ReactNode;
};

const NewsCardTransition = forwardRef<NewsCardTransitionRef, NewsCardTransitionProps>(
  ({ image, title, cardRef, onClose, children }, ref) => {
    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

    // 모달 애니메이션 진행도 (0: 숨김, 1: 표시)
    const progress = useSharedValue(0);

    // 초기 카드 위치 (모달이 뜰 때 시작 위치를 잡아주기 위함)
    const [layout, setLayout] = useState({ x: 0, y: 0, width: screenWidth, height: screenHeight });

    useEffect(() => {
      // 카드의 화면상 위치 측정
      cardRef.current?.measureInWindow((x, y, width, height) => {
        if (width > 0 && height > 0) {
          setLayout({ x, y, width, height });
        }
        // 측정 완료 후 모달 등장 애니메이션 시작 (부드러운 페이드 + 스케일 업)
        progress.value = withTiming(1, {
          duration: 300,
          easing: Easing.out(Easing.cubic),
        });
      });
    }, [cardRef]);

    /**
     * 모달 닫기 애니메이션
     */
    const closeOverlay = () => {
      progress.value = withTiming(
        0,
        {
          duration: 250,
          easing: Easing.in(Easing.cubic),
        },
        (finished) => {
          if (finished) {
            runOnJS(onClose)();
          }
        }
      );
    };

    useImperativeHandle(ref, () => ({
      close: closeOverlay,
    }));

    /**
     * 모달 백드롭 (어두운 배경) 스타일
     */
    const backdropStyle = useAnimatedStyle(() => ({
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      zIndex: 90,
      backgroundColor: 'rgba(0,0,0,0.4)',
      opacity: progress.value,
    }));

    /**
     * 모달 창 본체 스타일 (전체 화면을 덮으며 부드럽게 페이드인/스케일업)
     */
    const modalStyle = useAnimatedStyle(() => {
      return {
        position: 'absolute',
        left: 0,
        top: 0,
        width: screenWidth,
        height: screenHeight,
        zIndex: 100,
        opacity: progress.value,
        transform: [
          { scale: 0.95 + progress.value * 0.05 }, // 아주 살짝 커지며 등장하여 몰입감 부여
        ],
      };
    });

    return (
      <>
        {/* 어두운 배경 */}
        <Animated.View style={backdropStyle}>
          <TouchableOpacity onPress={closeOverlay} activeOpacity={1} className="absolute inset-0" />
        </Animated.View>

        <Animated.View style={modalStyle} pointerEvents="box-none">
          <View className="flex-1 h-full w-full bg-mono-100 overflow-hidden">
            <LinearGradient
              colors={['rgba(0,0,0,0.01)', 'rgba(0,0,0,0.05)', 'rgba(0,0,0,0.8)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                height: 288, // h-72와 맞춤
              }}
            />

            <View className="absolute top-0 left-0 right-0 p-6 pt-12">
              <Text className="text-2xl font-bold text-white">{title}</Text>
            </View>

            {/* 실제 상세 내용 (children) */}
            <View className="flex-1 bg-mono-100">{children}</View>
          </View>
        </Animated.View>
      </>
    );
  }
);

NewsCardTransition.displayName = 'NewsCardTransition';

export default NewsCardTransition;
