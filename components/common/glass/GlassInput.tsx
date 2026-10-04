import type { LucideIcon } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, TextInput, View, type StyleProp, type TextInputProps, type ViewStyle } from 'react-native';
import { GlassSurface } from './GlassSurface';
import { glass } from './tokens';

type Props = TextInputProps & { icon?: LucideIcon; containerStyle?: StyleProp<ViewStyle> };

// 검색창 / 단일 입력창. 포커스되면 테두리가 살짝 진해집니다.
export function GlassInput({ icon: Icon, containerStyle, onFocus, onBlur, ...rest }: Props) {
  const [focused, setFocused] = useState(false);
  return (
    <GlassSurface radius={26} shadow="sm" style={containerStyle}>
      <View style={styles.row}>
        {Icon && <Icon size={18} color={glass.inkMuted} strokeWidth={2} />}
        <TextInput
          {...rest} placeholderTextColor={glass.inkMuted} style={[styles.input, rest.style]}
          onFocus={e => { setFocused(true); onFocus?.(e); }} onBlur={e => { setFocused(false); onBlur?.(e); }}
        />
      </View>
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, { borderRadius: 26, borderWidth: 1.5, borderColor: focused ? 'rgba(34,39,43,0.35)' : 'transparent' }]} />
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  row: { height: 52, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', gap: 10 },
  input: { flex: 1, fontSize: 15, color: glass.ink, paddingVertical: 0 },
});
