import { KEYWORD_NEWS } from '@/utils/mock';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Dimensions, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NewsListScreen() {
  const { width: screenWidth } = Dimensions.get('window');
  const cardWidth = (screenWidth - 32 - 8) / 2;
  return (
    <SafeAreaView className="bg-mono-100 h-full">
      <TouchableOpacity
        onPress={() => {
          router.back();
        }}
        className="p-4 gap-2 flex-row items-center"
      >
        <ChevronLeft size={28} />
        <Text className="text-lg font-semibold">검색어</Text>
      </TouchableOpacity>
      <FlatList
        data={KEYWORD_NEWS}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
        }}
        columnWrapperStyle={{
          gap: 8,
          marginBottom: 8,
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ width: cardWidth }}
            className="h-[220px] overflow-hidden rounded-lg"
          >
            <Image
              source={{ uri: item.image }}
              className="absolute inset-0 w-full h-full"
              resizeMode="cover"
            />
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
            >
              <View className="flex-1 justify-end p-3 pb-12">
                <Text numberOfLines={2} className="text-xl font-bold leading-6 text-white ">
                  {item.keyword}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
