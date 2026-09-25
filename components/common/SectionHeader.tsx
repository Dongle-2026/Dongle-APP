import { ChevronRight } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

export default function SectionHeader({
  title,
  subtitle,
  onMore,
}: {
  title: string;
  subtitle?: string;
  onMore?: () => void;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
      }}
    >
      <View>
        <Text
          style={{
            fontSize: 17,
            fontWeight: '800',
            color: '#22272B',
            letterSpacing: -0.4,
          }}
        >
          {title}
        </Text>
        {subtitle && (
          <Text style={{ fontSize: 12, color: '#898989', marginTop: 1 }}>{subtitle}</Text>
        )}
      </View>
      {onMore && (
        <TouchableOpacity onPress={onMore} activeOpacity={0.7}>
          <ChevronRight size={22} color={'#898989'} />
        </TouchableOpacity>
      )}
    </View>
  );
}
