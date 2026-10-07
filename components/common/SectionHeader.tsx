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
    <TouchableOpacity
      activeOpacity={onMore ? 0.8 : 1}
      onPress={onMore ? onMore : undefined}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
      }}
    >
      <View>
        <View className="flex-row gap-2 items-center">
          <Text
            style={{
              fontSize: 20,
              fontWeight: '800',
              color: '#22272B',
              letterSpacing: -0.4,
            }}
          >
            {title}
          </Text>
          {onMore && (
            <TouchableOpacity onPress={onMore} activeOpacity={0.7}>
              <ChevronRight size={26} color={'#898989'} />
            </TouchableOpacity>
          )}
        </View>
        {subtitle && (
          <Text style={{ fontSize: 12, color: '#898989', marginTop: 1 }}>{subtitle}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
