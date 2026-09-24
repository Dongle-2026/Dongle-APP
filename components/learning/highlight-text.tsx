import type { TermDefinition } from '@/types/learning';
import { Text } from 'react-native';

type Props = {
  text: string;
  terms: TermDefinition[];
  onTermPress: (term: TermDefinition) => void;
  style?: object;
};

/**
 * 본문 텍스트에서 용어 목록과 일치하는 단어를
 * 노란색 하이라이트 + 탭 가능하게 렌더링합니다.
 */
export default function HighlightText({ text, terms, onTermPress, style }: Props) {
  // 용어 목록을 길이 내림차순으로 정렬 (긴 단어 먼저 매칭)
  const sortedTerms = [...terms].sort((a, b) => b.term.length - a.term.length);

  type Segment = { text: string; term: TermDefinition | null };

  const buildSegments = (input: string): Segment[] => {
    if (sortedTerms.length === 0) return [{ text: input, term: null }];

    const pattern = new RegExp(
      `(${sortedTerms.map((t) => t.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
      'g'
    );
    const parts = input.split(pattern);

    return parts.map((part) => {
      const matched = sortedTerms.find((t) => t.term === part);
      return { text: part, term: matched ?? null };
    });
  };

  const segments = buildSegments(text);

  return (
    <Text style={[{ fontSize: 15, lineHeight: 26, color: '#22272B' }, style]}>
      {segments.map((seg, i) =>
        seg.term ? (
          <Text
            key={`${seg.text}-${i}`}
            onPress={() => onTermPress(seg.term!)}
            style={{
              backgroundColor: 'rgba(255, 220, 83, 0.35)',
              borderRadius: 3,
              color: '#22272B',
              fontWeight: '600',
              textDecorationLine: 'underline',
              textDecorationColor: '#FFDC53',
              textDecorationStyle: 'solid',
            }}
          >
            {seg.text}
          </Text>
        ) : (
          <Text key={`plain-${i}`}>{seg.text}</Text>
        )
      )}
    </Text>
  );
}
