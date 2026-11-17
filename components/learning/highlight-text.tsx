import type { Term } from '@/types/learning';
import { Text } from 'react-native';

type Props = {
  text: string;
  terms: Term[];
  onTermPress: (term: Term) => void;
  style?: object;
};

export default function HighlightText({ text, terms, onTermPress, style }: Props) {
  // 용어 목록을 길이 내림차순으로 정렬 (긴 단어 먼저 매칭)
  const sortedTerms = [...terms].sort((a, b) => b.term.length - a.term.length);

  type Segment = { text: string; term: Term | null; index: number };

  const buildSegments = (input: string): Segment[] => {
    if (sortedTerms.length === 0) return [{ text: input, term: null, index: 0 }];

    const pattern = new RegExp(
      `(${sortedTerms.map((t) => t.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
      'g'
    );
    const parts = input.split(pattern);

    const highlightedTerms = new Set<string>();

    return parts.map((part, index) => {
      const matched = sortedTerms.find((t) => t.term === part);

      if (matched && !highlightedTerms.has(matched.term)) {
        highlightedTerms.add(matched.term);
        return { text: part, term: matched, index };
      }

      return { text: part, term: null, index };
    });
  };

  const segments = buildSegments(text);

  return (
    <Text style={[{ fontSize: 16, lineHeight: 28, color: '#484849' }, style]}>
      {segments.map((seg, i) =>
        seg.term ? (
          /* 💡 key에 seg.term.id와 index를 조합하여 절대 겹치지 않게 고유값 보장 */
          <Text key={`hl-${seg.term.id}-${seg.index}`}>
            <Text
              onPress={() => onTermPress(seg.term!)}
              style={{
                color: '#0e7fa3',
                backgroundPosition: 'top',
                backgroundColor: '#EAF6F9',
              }}
            >
              {seg.text}
            </Text>
          </Text>
        ) : (
          <Text key={`plain-${i}`}>{seg.text}</Text>
        )
      )}
    </Text>
  );
}
