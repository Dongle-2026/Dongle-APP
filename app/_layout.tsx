import { authStore } from '@/auth/authStore';
import NewsDetail from '@/components/news/news-detail';
import { NewsDetailProvider, useNewsDetail } from '@/context/NewsDetailContext';
import { queryClient } from '@/lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import '../global.css';

import { useColorScheme } from '@/components/useColorScheme';
import { View } from 'react-native';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function NewsDetailPortal() {
  const { current, close } = useNewsDetail();
  if (!current) return null;

  return (
    // 화면 전체를 덮는 absolute 레이어 (탭바보다 위)
    <View
      style={{
        position: 'absolute',
        inset: 0, // top/right/bottom/left: 0
        zIndex: 999,
      }}
      pointerEvents="box-none"
    >
      <NewsDetail
        newsId={current.newsId}
        image={current.image}
        title={current.title}
        cardRef={current.cardRef}
        onClose={close}
      />
    </View>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const { status } = authStore.useAuth();

  // 앱 시작 시 저장된 토큰 확인 → status: 'authed' | 'anon'
  useEffect(() => {
    void authStore.bootstrap();
  }, []);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded && status !== 'loading') {
      SplashScreen.hideAsync();
    }
  }, [loaded, status]);

  if (!loaded || status === 'loading') {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { status } = authStore.useAuth();
  const segments = useSegments();
  const router = useRouter();

  // 인증 상태에 따른 화면 분기
  useEffect(() => {
    // 현재 경로가 로그인 화면인지 여부를 유연하게 체크
    const inAuthGroup = segments[0] === '(auth)';

    if (status === 'anon' && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (status === 'authed' && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [status, segments, router]);

  return (
    <QueryClientProvider client={queryClient}>
      <NewsDetailProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="news-list" options={{ headerShown: false }} />
            <Stack.Screen name="glass-demo" options={{ headerShown: false }} />
          </Stack>
        </ThemeProvider>
        {status === 'authed' && <NewsDetailPortal />}
      </NewsDetailProvider>
    </QueryClientProvider>
  );
}
