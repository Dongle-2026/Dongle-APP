import HighlightedText from '@/components/learning/highlight-text';
import QuizCard from '@/components/learning/quiz-card';
import HoneyRewardBanner from '@/components/learning/reward-banner';
import TermModal from '@/components/learning/term-modal';
import type { NewsBodyData, QuizResult, TermDefinition } from '@/types/learning';
import { BookOpen, ChevronDown, ChevronUp, Share2, Tag } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Share, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  data: NewsBodyData;
};

export default function NewsBody({ data }: Props) {
  const [activeTerm, setActiveTerm] = useState<TermDefinition | null>(null);
  const [savedTerms, setSavedTerms] = useState<Set<string>>(new Set());
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showVocab, setShowVocab] = useState(false);

  const allQuizAnswered = quizResults.length === data.quizzes.length;
  const totalEarnedHoney = quizResults.reduce((sum, r) => sum + r.earnedHoney, 0);
  const correctCount = quizResults.filter((r) => r.isCorrect).length;

  const handleSaveTerm = (term: TermDefinition) => {
    setSavedTerms((prev) => new Set(prev).add(term.term));
  };

  const handleQuizAnswer = (result: QuizResult) => {
    setQuizResults((prev) => {
      const exists = prev.find((r) => r.quizId === result.quizId);
      if (exists) return prev;
      return [...prev, result];
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `📰 ${data.headline}\n\n돈글돈글에서 읽고 있어요!\n출처: ${data.source} (${data.publishedAt})`,
        title: data.headline,
      });
    } catch {
      Alert.alert('공유 실패', '잠시 후 다시 시도해주세요.');
    }
  };

  return (
    <View>
      {/* ── Article meta bar ── */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 14,
          borderTopWidth: 1,
          borderTopColor: '#F0EEEC',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Text style={{ fontSize: 12, color: '#898989' }}>{data.source}</Text>
          <Text style={{ color: '#D9D9D9' }}>|</Text>
          <Text style={{ fontSize: 12, color: '#898989' }}>{data.publishedAt}</Text>
        </View>
        <TouchableOpacity onPress={handleShare} activeOpacity={0.7}>
          <Share2 size={18} color="#898989" />
        </TouchableOpacity>
      </View>

      {/* ── Article body ── */}
      <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
        {/* Headline */}
        <Text
          style={{
            fontSize: 20,
            fontWeight: '800',
            color: '#22272B',
            lineHeight: 30,
            letterSpacing: -0.5,
            marginBottom: 6,
          }}
        >
          {data.headline}
        </Text>
        {data.subheadline && (
          <Text
            style={{
              fontSize: 14,
              color: '#898989',
              lineHeight: 21,
              marginBottom: 20,
            }}
          >
            {data.subheadline}
          </Text>
        )}

        {/* Body sections */}
        <View style={{ gap: 18 }}>
          {data.sections.map((section) => (
            <HighlightedText
              key={section.id}
              text={section.text}
              terms={data.terms}
              onTermPress={setActiveTerm}
            />
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
              const isSaved = savedTerms.has(term.term);
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
                      <View
                        style={{
                          backgroundColor: '#EAF6F9',
                          borderRadius: 6,
                          paddingHorizontal: 6,
                          paddingVertical: 1,
                        }}
                      >
                        <Text style={{ fontSize: 10, color: '#0e7fa3', fontWeight: '600' }}>
                          {term.category}
                        </Text>
                      </View>
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
      <View style={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 24 }}>
        <TouchableOpacity
          onPress={() => setShowQuiz((p) => !p)}
          activeOpacity={0.8}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: showQuiz ? 8 : 0,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
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
          {showQuiz ? (
            <ChevronUp size={18} color="#898989" />
          ) : (
            <ChevronDown size={18} color="#898989" />
          )}
        </TouchableOpacity>

        {/* Quiz honey preview (collapsed) */}
        {!showQuiz && (
          <TouchableOpacity
            onPress={() => setShowQuiz(true)}
            activeOpacity={0.8}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#22272B',
              borderRadius: 12,
              padding: 16,
              marginTop: 16,
            }}
          >
            <View>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff', marginBottom: 3 }}>
                🐝 퀴즈를 풀고 꿀을 모아보세요!
              </Text>
              <Text style={{ fontSize: 12, color: '#898989' }}>
                최대 {data.quizzes.reduce((s, q) => s + q.honey, 0)}P 획득 가능
              </Text>
            </View>
            <View
              style={{
                backgroundColor: '#FFDC53',
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 10,
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: '800', color: '#22272B' }}>도전!</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Quiz cards */}
        {showQuiz && (
          <View style={{ marginTop: 8 }}>
            {/* Honey total indicator */}
            {quizResults.length > 0 && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: 5,
                  marginBottom: 12,
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#898989' }}>현재</Text>
                <View
                  style={{
                    backgroundColor: '#FFF8E6',
                    borderRadius: 10,
                    paddingHorizontal: 10,
                    paddingVertical: 3,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <Text style={{ fontSize: 14 }}>🍯</Text>
                  <Text style={{ fontSize: 14, fontWeight: '800', color: '#B8720A' }}>
                    {totalEarnedHoney}P
                  </Text>
                </View>
              </View>
            )}

            {data.quizzes.map((quiz, i) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                index={i}
                result={quizResults.find((r) => r.quizId === quiz.id)}
                onAnswer={handleQuizAnswer}
              />
            ))}

            {/* Completion banner */}
            {allQuizAnswered && (
              <HoneyRewardBanner
                totalHoney={totalEarnedHoney}
                correctCount={correctCount}
                totalCount={data.quizzes.length}
              />
            )}
          </View>
        )}
      </View>

      {/* ── Term Modal ── */}
      <TermModal
        term={activeTerm}
        isSaved={activeTerm ? savedTerms.has(activeTerm.term) : false}
        onSave={handleSaveTerm}
        onClose={() => setActiveTerm(null)}
      />
    </View>
  );
}
