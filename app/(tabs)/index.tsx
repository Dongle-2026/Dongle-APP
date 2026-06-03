import { Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-mono-100 items-center justify-center">
      <Text className="text-point">NativeWind 테스트</Text>

      <View className="mt-4 bg-point px-4 py-2 rounded-lg">
        <Text className="text-mono-100">버튼</Text>
      </View>
    </View>
  );
}
