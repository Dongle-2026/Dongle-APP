import NewsDetail from '@/components/news/news-detail';
import { KEYWORD_NEWS } from '@/utils/mock';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import type { RefObject } from 'react';
import { useRef, useState } from 'react';
import { Dimensions, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = (screenWidth - 32 - 8) / 2;

function NewsGridCard({
  item,
  onPress,
}: {
  item: (typeof KEYWORD_NEWS)[number];
  onPress: (item: (typeof KEYWORD_NEWS)[number], ref: RefObject<View | null>) => void;
}) {
  const cardRef = useRef<View>(null);

  return (
    <TouchableOpacity
      ref={cardRef}
      onPress={() => onPress(item, cardRef)}
      activeOpacity={1}
      style={{ width: cardWidth }}
      className="h-[220px] overflow-hidden rounded-lg"
    >
      <Image
        source={{ uri: item.image }}
        className="absolute inset-0 h-full w-full"
        resizeMode="cover"
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.01)', 'rgba(0,0,0,0.05)', 'rgba(0,0,0,0.8)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
      >
        <View className="flex-1 justify-end p-3 pb-12">
          <Text numberOfLines={2} className="text-xl font-bold leading-6 text-white">
            {item.keyword}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

export default function NewsListScreen() {
  const [selectedItem, setSelectedItem] = useState<(typeof KEYWORD_NEWS)[number] | null>(null);
  const [selectedCardRef, setSelectedCardRef] = useState<RefObject<View | null> | null>(null);

  const handleCardPress = (
    item: (typeof KEYWORD_NEWS)[number],
    cardRef: RefObject<View | null>
  ) => {
    setSelectedItem(item);
    setSelectedCardRef(cardRef);
  };

  const handleClose = () => {
    setSelectedItem(null);
    setSelectedCardRef(null);
  };

  return (
    <View className="flex-1 bg-mono-100">
      <SafeAreaView className="flex-1">
        <TouchableOpacity onPress={() => router.back()} className="flex-row items-center gap-2 p-4">
          <ChevronLeft size={28} />
          <Text className="text-lg font-semibold">검색어</Text>
        </TouchableOpacity>

        <FlatList
          data={KEYWORD_NEWS}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          columnWrapperStyle={{ gap: 8, marginBottom: 8 }}
          renderItem={({ item }) => <NewsGridCard item={item} onPress={handleCardPress} />}
        />
      </SafeAreaView>

      {selectedItem && selectedCardRef && (
        <NewsDetail
          newsId={selectedItem.id}
          thumbnail={selectedItem.image}
          title={selectedItem.keyword}
          cardRef={selectedCardRef}
          onClose={handleClose}
        />
      )}
    </View>
  );
}
