import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode, RefObject } from 'react';
import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { Dimensions, Image, Text, TouchableOpacity, View } from 'react-native';
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
  thumbnail: string;
  title: string;
  cardRef: RefObject<View | null>;
  onClose: () => void;
  children: ReactNode;
};

const DETAIL_X = 0;
const DETAIL_Y = 0;

const NewsCardTransition = forwardRef<NewsCardTransitionRef, NewsCardTransitionProps>(
  ({ thumbnail, title, cardRef, onClose, children }, ref) => {
    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

    // 카드 → 전체화면 진행도
    const progress = useSharedValue(0);

    // 처음 클릭한 카드의 위치/크기
    const startX = useSharedValue(0);
    const startY = useSharedValue(0);
    const startWidth = useSharedValue(0);
    const startHeight = useSharedValue(0);

    // 상세 내용 투명도
    const contentOpacity = useSharedValue(1);

    // 닫을 때 썸네일 투명도
    const thumbnailOpacity = useSharedValue(0);

    /**
     * 상세 화면이 렌더링된 직후
     * 원래 클릭했던 카드의 위치를 측정하고
     * 해당 위치에서 전체화면으로 애니메이션
     */
    useEffect(() => {
      const timer = setTimeout(() => {
        cardRef.current?.measureInWindow((x, y, width, height) => {
          startX.value = x;
          startY.value = y;
          startWidth.value = width;
          startHeight.value = height;

          progress.value = withTiming(1, {
            duration: 400,
            easing: Easing.out(Easing.cubic),
          });
        });
      }, 0);

      return () => clearTimeout(timer);
    }, [cardRef]);

    /**
     * 상세 화면 닫기
     */
    const closeOverlay = () => {
      // 1. 상세 내용 먼저 빠르게 사라짐
      contentOpacity.value = withTiming(0, {
        duration: 120,
        easing: Easing.out(Easing.ease),
      });

      // 2. 썸네일이 자연스럽게 나타남
      thumbnailOpacity.value = withTiming(1, {
        duration: 180,
        easing: Easing.out(Easing.ease),
      });

      // 3. 전체화면 → 원래 카드 위치
      progress.value = withTiming(
        0,
        {
          duration: 320,
          easing: Easing.out(Easing.cubic),
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
     * 카드 위치/크기 애니메이션
     */
    const overlayStyle = useAnimatedStyle(() => {
      const currentX = startX.value + (DETAIL_X - startX.value) * progress.value;

      const currentY = startY.value + (DETAIL_Y - startY.value) * progress.value;

      const currentWidth = startWidth.value + (screenWidth - startWidth.value) * progress.value;

      const currentHeight = startHeight.value + (screenHeight - startHeight.value) * progress.value;

      return {
        position: 'absolute',
        left: currentX,
        top: currentY,
        width: currentWidth,
        height: currentHeight,
        zIndex: 100,
      };
    });

    /**
     * 뒤쪽 어두운 배경
     */
    const backdropStyle = useAnimatedStyle(() => ({
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      zIndex: 90,
      backgroundColor: 'rgba(0,0,0,0.35)',
      opacity: progress.value * 0.35,
    }));

    /**
     * 상세 내용 fade
     */
    const contentAnimatedStyle = useAnimatedStyle(() => ({
      opacity: contentOpacity.value,
    }));

    /**
     * 닫을 때 썸네일 fade
     */
    const thumbnailAnimatedStyle = useAnimatedStyle(() => ({
      opacity: thumbnailOpacity.value,
    }));

    return (
      <>
        {/* 뒤쪽 배경 */}
        <Animated.View style={backdropStyle} pointerEvents="box-none">
          <TouchableOpacity onPress={closeOverlay} activeOpacity={1} className="absolute inset-0" />
        </Animated.View>

        {/* 카드 → 전체화면 */}
        <Animated.View style={overlayStyle} pointerEvents="box-none">
          <View className="flex-1 h-full w-full bg-mono-100">
            {/* 닫을 때 보여줄 원래 썸네일 */}
            <Animated.View style={thumbnailAnimatedStyle} className="absolute inset-0">
              <Image source={{ uri: thumbnail }} className="h-full w-full" resizeMode="cover" />

              <LinearGradient
                colors={['rgba(0,0,0,0.01)', 'rgba(0,0,0,0.05)', 'rgba(0,0,0,0.8)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                }}
              />

              <View className="flex-1 justify-end p-6 pb-12">
                <Text className="text-3xl font-bold text-white">{title}</Text>
              </View>
            </Animated.View>

            {/* 실제 상세 화면 */}
            <Animated.View style={contentAnimatedStyle} className="flex-1 h-full w-full">
              {children}
            </Animated.View>
          </View>
        </Animated.View>
      </>
    );
  }
);

NewsCardTransition.displayName = 'NewsCardTransition';

export default NewsCardTransition;
