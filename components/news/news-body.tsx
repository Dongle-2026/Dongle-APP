import HighlightedText from '@/components/learning/highlight-text';
import TermModal from '@/components/learning/term-modal';
import { useTermSave } from '@/hooks/use-term-save';
import type { NewsBodyData, QuizResult, TermDefinition } from '@/types/learning';
import { BookOpen, ChevronDown, ChevronRight, ChevronUp, Tag } from 'lucide-react-native';
import { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  data: NewsBodyData;
  quizResults: QuizResult[]; // NewsDetail이 관리 (퀴즈 모드와 공유)
  onOpenQuiz: () => void; // 퀴즈 모드 진입
};

export default function NewsBody({ data, quizResults, onOpenQuiz }: Props) {
  const [activeTerm, setActiveTerm] = useState<TermDefinition | null>(null);
  const [showVocab, setShowVocab] = useState(false);
  const {
    isSaved: isTermSaved,
    save,
    unsave,
  } = useTermSave(data.terms.filter((t) => t.isSaved).map((t) => t.id));

  const allQuizAnswered = quizResults.length === data.quizzes.length;

  return (
    <View>
      {/* ── Article body ── */}
      <View style={{ padding: 16, paddingBottom: 8 }}>
        {/* Headline */}
        <Text
          style={{
            width: '85%',
            fontSize: 17,
            fontWeight: '500',
            lineHeight: 26,
            marginVertical: 12,
          }}
        >
          {data.intro}
        </Text>

        {/* Body sections */}
        <View style={{ gap: 18 }}>
          {data.sections.map((section) => (
            <View key={section.id}>
              {section.subtitle && (
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: '700',
                    marginVertical: 16,
                    color: '#22272B',
                  }}
                >
                  {section.subtitle}
                </Text>
              )}

              <HighlightedText text={section.text} terms={data.terms} onTermPress={setActiveTerm} />
            </View>
          ))}
        </View>
      </View>

      {/* ── Tags ── */}
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 7,
          paddingHorizontal: 16,
          paddingTop: 20,
          paddingBottom: 16,
        }}
      >
        {data.tags.map((tag) => (
          <View
            key={tag}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              backgroundColor: '#F0EEEC',
              borderRadius: 20,
              paddingHorizontal: 11,
              paddingVertical: 5,
            }}
          >
            <Tag size={11} color="#898989" />
            <Text style={{ fontSize: 12, color: '#898989', fontWeight: '600' }}>{tag}</Text>
          </View>
        ))}
      </View>

      {/* ── Divider ── */}
      <View style={{ height: 8, backgroundColor: '#F6F6F8' }} />

      {/* ── Vocabulary section ── */}
      <View style={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 8 }}>
        <TouchableOpacity
          onPress={() => setShowVocab((p) => !p)}
          activeOpacity={0.8}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: showVocab ? 16 : 0,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text
              style={{ fontSize: 17, fontWeight: '800', color: '#22272B', letterSpacing: -0.4 }}
            >
              핵심 용어 모음
            </Text>
            <View
              style={{
                backgroundColor: '#22272B',
                borderRadius: 10,
                paddingHorizontal: 7,
                paddingVertical: 2,
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#FFDC53' }}>
                {data.terms.length}
              </Text>
            </View>
          </View>
          {showVocab ? (
            <ChevronUp size={18} color="#898989" />
          ) : (
            <ChevronDown size={18} color="#898989" />
          )}
        </TouchableOpacity>

        {showVocab && (
          <View style={{ gap: 8 }}>
            {data.terms.map((term) => {
              const isSaved = isTermSaved(term.id);
              return (
                <TouchableOpacity
                  key={term.term}
                  onPress={() => setActiveTerm(term)}
                  activeOpacity={0.8}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    gap: 12,
                    backgroundColor: '#F9F9F9',
                    borderRadius: 14,
                    padding: 14,
                    borderWidth: 1,
                    borderColor: isSaved ? '#FFDC53' : '#F0EEEC',
                  }}
                >
                  <View
                    style={{
                      backgroundColor: isSaved ? '#FFDC53' : '#F0EEEC',
                      borderRadius: 8,
                      width: 32,
                      height: 32,
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <BookOpen size={15} color={isSaved ? '#22272B' : '#898989'} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                        marginBottom: 3,
                      }}
                    >
                      <Text style={{ fontSize: 14, fontWeight: '700', color: '#22272B' }}>
                        {term.term}
                      </Text>
                    </View>
                    <Text
                      style={{ fontSize: 12, color: '#898989', lineHeight: 18 }}
                      numberOfLines={2}
                    >
                      {term.definition}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>

      {/* ── Divider ── */}
      <View style={{ height: 8, backgroundColor: '#F6F6F8', marginTop: 20 }} />

      {/* ── Quiz section ── */}
      <View style={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 60 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Text
              style={{ fontSize: 17, fontWeight: '800', color: '#22272B', letterSpacing: -0.4 }}
            >
              이해 확인 퀴즈
            </Text>
            <View
              style={{
                backgroundColor: '#22272B',
                borderRadius: 10,
                paddingHorizontal: 7,
                paddingVertical: 2,
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#FFDC53' }}>
                {data.quizzes.length}
              </Text>
            </View>
          </View>
          {allQuizAnswered ? null : (
            // 기존 접힌 상태 미리보기 카드 — onPress만 퀴즈 모드 진입으로 변경
            <TouchableOpacity
              onPress={onOpenQuiz}
              activeOpacity={0.8}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 999,
                padding: 8,
                backgroundColor: '#F0EEEC',
              }}
            >
              <ChevronRight size={18} color="#898989" />
            </TouchableOpacity>
          )}
        </View>

        {allQuizAnswered ? (
          // 이미 다 풀었으면 기존 완료 배너를 그대로 보여줌
          <View
            style={{
              marginTop: 16,
              width: '100%',
              borderRadius: 16,
              padding: 20,
            }}
          >
            <View className="flex-row items-center gap-4">
              <Image
                source={require('@/assets/images/clap.png')}
                style={{ width: 48, height: 48 }}
                resizeMode="contain"
              />
              <View>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: '700',
                    color: '#22272B',
                    letterSpacing: -0.8,
                  }}
                >
                  짝짝짝!
                </Text>
                <Text style={{ fontSize: 14, color: '#6A7178', marginTop: 4 }}>
                  퀴즈를 모두 풀었어요
                </Text>
              </View>
            </View>
          </View>
        ) : null}
      </View>

      {/* ── Term Modal ── */}
      <TermModal
        term={activeTerm}
        isSaved={activeTerm ? isTermSaved(activeTerm.id) : false}
        onSave={save}
        onUnsave={unsave}
        onClose={() => setActiveTerm(null)}
      />
    </View>
  );
}
