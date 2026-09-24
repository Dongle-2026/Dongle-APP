import { Search } from 'lucide-react-native';
import { TextInput, View } from 'react-native';

export default function Searchbar() {
  return (
    <View className="m-4 h-14 flex-row items-center rounded-2xl border-[2px] border-mono-400/30 bg-white/70 px-4">
      <Search size={20} color="#737373" />

      <TextInput
        placeholder="지금 주목할 소식"
        placeholderTextColor="#A3A3A3"
        className="ml-3 flex-1 text-[15px]"
      />
    </View>
  );
}
