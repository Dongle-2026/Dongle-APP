import type { CardNews, Slide, UserAction } from '@/types';
import { type ApiResponse } from '@/utils/api';
import { CARD_NEWS, MOCK_IMAGES } from '@/utils/mock';

const generateSlides = (id: number): Slide[] => {
  const baseSlides = CARD_NEWS[id % CARD_NEWS.length];
  const imageUrl = MOCK_IMAGES[id % MOCK_IMAGES.length];

  return baseSlides.map((slide, idx) => ({
    id: `slide-${id}-${idx}`,
    type: slide.type as 'image' | 'content',
    image: slide.type === 'image' ? imageUrl : undefined,
    title: slide.title || '',
    description: slide.description || '',
  }));
};

const generateMockNews = (page: number, limit: number): CardNews[] => {
  const startId = (page - 1) * limit;
  return Array.from({ length: limit }, (_, index) => {
    const id = startId + index;
    return {
      id: `news-${id}`,
      title: [
        '📱 새로운 AI 기술이 바꿀 미래의 일자리',
        '🚀 스타트업 시장, 올해 투자 사상 최대 기록 경신',
        '💡 블록체인 기술의 실제 활용 사례 8가지',
        '🌟 SVG 애니메이션 마스터하기',
        '⚡ React 19의 새로운 기능 완벽 정리',
        '🎨 UI/UX 트렌드 2024 완전 분석',
        '💻 웹 개발자가 알아야 할 성능 최적화 팁',
        '🔐 사이버 보안 위협과 대응 방안',
      ][id % 8],
      description: [
        'AI 기술의 급속한 발전으로 미래의 일자리 시장이 어떻게 변할지 살펴봅니다.',
        '올해 스타트업 투자 규모가 사상 최대를 기록했습니다. 그 배경을 알아봅시다.',
        '블록체인 기술이 실제로 어떻게 활용되고 있는지 구체적인 사례를 통해 설명합니다.',
        'SVG를 활용한 멋진 애니메이션 효과를 만드는 방법을 단계별로 배워봅시다.',
        'React 19에서 추가된 새로운 기능들을 문법과 예제와 함께 정리했습니다.',
        '2024년의 UI/UX 디자인 트렌드를 최신 사례와 함께 분석해봅니다.',
        '웹 성능을 개선하기 위한 필수 최적화 기법들을 실제 예제와 함께 소개합니다.',
        '최근의 주요 사이버 보안 위협과 이에 대한 effective 대응 방안을 살펴봅니다.',
      ][id % 8],
      content: '이 기사의 전체 내용입니다. 더 자세한 정보가 포함되어 있습니다.',
      image: MOCK_IMAGES[id % MOCK_IMAGES.length],
      category: '전체',
      tags: ['추천', '최신', '핫'],
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      url: `https://example.com/news/${id}`,
      isSaved: Math.random() > 0.8,
      slides: generateSlides(id),
    };
  });
};

export const newsService = {
  async getLatestNews(page: number = 1, limit: number = 10): Promise<ApiResponse<CardNews[]>> {
    // 실제 API 사용 시 주석 해제
    // return apiClient.get<CardNews[]>(`/api/news?page=${page}&limit=${limit}`);

    // Mock 데이터 반환
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: generateMockNews(page, limit),
          status: 200,
        });
      }, 800); // 실제 네트워크 지연 시뮬레이션
    });
  },

  async getNewsByCategory(
    category: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<CardNews[]>> {
    // 실제 API 사용 시 주석 해제
    // return apiClient.get<CardNews[]>(`/api/news?category=${category}&page=${page}&limit=${limit}`);

    return new Promise((resolve) => {
      setTimeout(() => {
        const allNews = generateMockNews(page, limit);
        const filtered = allNews.filter((n) => n.category === category);
        resolve({
          data: filtered,
          status: 200,
        });
      }, 800);
    });
  },

  async getNewsById(id: string): Promise<ApiResponse<CardNews>> {
    // 실제 API 사용 시 주석 해제
    // return apiClient.get<CardNews>(`/api/news/${id}`);

    return new Promise((resolve) => {
      setTimeout(() => {
        const news = generateMockNews(1, 10)[0];
        resolve({
          data: { ...news, id },
          status: 200,
        });
      }, 500);
    });
  },

  async searchNews(query: string, page: number = 1): Promise<ApiResponse<CardNews[]>> {
    // 실제 API 사용 시 주석 해제
    // return apiClient.get<CardNews[]>(`/api/news/search?q=${encodeURIComponent(query)}&page=${page}`);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: generateMockNews(page, 10),
          status: 200,
        });
      }, 800);
    });
  },

  // Save/Unsave
  async saveNews(newsId: string): Promise<ApiResponse<UserAction>> {
    // 실제 API 사용 시 주석 해제
    // return apiClient.post<UserAction>(`/api/news/${newsId}/save`, {});

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            newsId,
            action: 'save',
            timestamp: new Date().toISOString(),
          },
          status: 200,
        });
      }, 300);
    });
  },

  async unsaveNews(newsId: string): Promise<ApiResponse<UserAction>> {
    // 실제 API 사용 시 주석 해제
    // return apiClient.post<UserAction>(`/api/news/${newsId}/unsave`, {});

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            newsId,
            action: 'unsave',
            timestamp: new Date().toISOString(),
          },
          status: 200,
        });
      }, 300);
    });
  },
};
