import NewsDetail from '@/components/news/news-detail';
import { NewsDetailProvider, useNewsDetail } from '@/context/NewsDetailContext';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
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
        thumbnail={current.thumbnail}
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

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <NewsDetailProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="news-list" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
      <NewsDetailPortal />
    </NewsDetailProvider>
  );
}
