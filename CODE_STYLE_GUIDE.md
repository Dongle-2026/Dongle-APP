# 코드 스타일 가이드

## 개요

이 프로젝트는 TypeScript, React Native, Expo를 사용합니다. 코드 품질과 일관성을 유지하기 위해 다음의 스타일 가이드를 따릅니다.

## 포매팅 규칙 (Prettier)

Prettier 설정은 `.prettierrc.json`에 정의되어 있습니다.

### 주요 규칙

- **줄 길이**: 100자
- **탭 너비**: 2칸
- **따옴표**: 싱글 쿼트 (`'`)
- **세미콜론**: 필수
- **후행 쉼표**: ES5 호환
- **화살표 함수 괄호**: 항상 포함
- **줄 끝**: LF

### 예시

```typescript
// ✓ Good
const getUserData = async (userId: string): Promise<User> => {
  const response = await apiClient.get<User>(`/api/users/${userId}`);
  if (response.error) {
    console.error('Failed to fetch user:', response.error.message);
    return null;
  }
  return response.data;
};

// ✗ Bad - 스타일 가이드 미준수
const getUserData = async (userId) => {
  const response = await apiClient.get(`/api/users/${userId}`);
  return response.data;
};
```

## 린팅 규칙 (ESLint)

ESLint 설정은 `.eslintrc.json`에 정의되어 있습니다.

### 주요 규칙

- TypeScript strict mode 활성화
- React Native 권장사항 준수
- 사용하지 않는 변수 금지 (단, `_` 접두사는 무시)
- `console.log` 경고 (단, `console.warn`, `console.error` 허용)
- Prettier와 통합된 포매팅

### 예시

```typescript
// ✓ Good
interface UserProps {
  name: string;
  email: string;
  onSubmit: (data: UserData) => void;
}

const UserForm: React.FC<UserProps> = ({ name, email, onSubmit }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    await onSubmit({ name, email });
    setIsLoading(false);
  };

  return (
    <View>
      {/* JSX content */}
    </View>
  );
};

// ✗ Bad
const UserForm = ({ name, email, onSubmit }) => {
  const [loading, setLoading] = React.useState(false);
  const unused = 'this is not used'; // ESLint 에러
  console.log('debug info'); // console.log 경고
};
```

## TypeScript 규칙

### 타입 정의

모든 함수 파라미터와 반환 값에 타입을 지정합니다.

```typescript
// ✓ Good
const calculateTotal = (items: Item[], taxRate: number): number => {
  return items.reduce((sum, item) => sum + item.price, 0) * (1 + taxRate);
};

// ✗ Bad
const calculateTotal = (items, taxRate) => {
  return items.reduce((sum, item) => sum + item.price, 0) * (1 + taxRate);
};
```

### 인터페이스 vs 타입

- **인터페이스**: 객체 형태의 데이터 (컴포넌트 props, API 응답)
- **타입**: 유니언, 제네릭, 또는 간단한 객체

```typescript
// ✓ Good - 인터페이스 사용
interface NewsItem {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

// ✓ Good - 타입 사용 (유니언)
type StatusType = 'loading' | 'success' | 'error';

// ✗ Bad - 타입으로 객체 정의 (권장하지 않음)
type NewsItem = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};
```

## React 컴포넌트 규칙

### 함수형 컴포넌트

모든 컴포넌트는 함수형으로 작성합니다.

```typescript
// ✓ Good
interface CardProps {
  title: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, children }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
};

// ✗ Bad - 클래스 컴포넌트
class Card extends React.Component {
  render() {
    return <View>{/* ... */}</View>;
  }
}
```

### Props 정의

모든 props는 인터페이스로 정의합니다.

```typescript
interface NewsCardProps {
  news: News;
  onPress?: (id: string) => void;
}

export const NewsCard: React.FC<NewsCardProps> = ({ news, onPress }) => {
  // ...
};
```

### Hooks 사용

- `useState`: 상태 관리
- `useEffect`: 부작용 (생명주기)
- `useCallback`: 메모이제이션
- `useMemo`: 계산 최적화

```typescript
const UserProfile: React.FC<{ userId: string }> = ({ userId }) => {
  const [user, setUser] = React.useState<User | null>(null);

  const fetchUser = React.useCallback(async () => {
    const result = await getUser(userId);
    setUser(result);
  }, [userId]);

  React.useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return <View>{/* ... */}</View>;
};
```

## 파일 및 디렉토리 규칙

### 파일명

- **컴포넌트**: PascalCase (예: `NewsCard.tsx`)
- **유틸리티**: camelCase (예: `dateUtils.ts`)
- **인덱스**: `index.ts`

### 내보내기 순서

```typescript
// types/index.ts 예시
export interface News {}
export interface Category {}

// components/index.ts 예시
export { NewsCard } from './NewsCard';
export { NewsList } from './NewsList';

// utils/index.ts 예시
export * from './api';
export * from './date';
```

## 네이밍 규칙

### 변수 및 상수

```typescript
// ✓ Good
const MAX_RETRIES = 3;
const userEmail = 'user@example.com';
const isLoading = true;
const handleUserClick = () => {};

// ✗ Bad
const max_retries = 3; // 스네이크 케이스
const UserEmail = 'user@example.com'; // PascalCase
const loading_state = true; // 스네이크 케이스
```

### 함수명

```typescript
// ✓ Good - 동사로 시작
const getUserData = async () => {};
const fetchNews = async () => {};
const calculateTotal = () => {};
const isValidEmail = () => {};

// ✗ Bad - 명확하지 않음
const user = async () => {};
const data = async () => {};
const get = () => {};
```

## 주석 및 문서화

### JSDoc 주석

복잡한 함수에는 JSDoc 주석을 추가합니다.

```typescript
/**
 * 사용자 데이터를 가져옵니다.
 * @param userId - 사용자 ID
 * @returns 사용자 데이터 또는 null
 */
const getUser = async (userId: string): Promise<User | null> => {
  // ...
};
```

### 인라인 주석

명확하지 않은 로직에만 주석을 추가합니다.

```typescript
// ✓ Good - 왜 하는지 설명
const adjustedPrice = price * (1 + TAX_RATE); // 세금 포함

// ✗ Bad - 너무 많은 주석
const sum = 0; // 합계 초기화
sum += item.price; // 가격 추가
```

## 에러 처리

```typescript
// ✓ Good
try {
  const response = await apiClient.get<News>(`/api/news/${id}`);
  if (response.error) {
    console.error('Failed to fetch news:', response.error.message);
    return null;
  }
  return response.data;
} catch (error) {
  console.error('Unexpected error:', error);
  throw error;
}
```

## 성능 최적화

### 불필요한 렌더링 방지

```typescript
// ✓ Good - useCallback 사용
const NewsList: React.FC = () => {
  const handleNewsPress = React.useCallback((id: string) => {
    // ...
  }, []);

  return <NewsCard onPress={handleNewsPress} />;
};
```

### 메모이제이션

```typescript
// ✓ Good - useMemo 사용
const sortedNews = React.useMemo(
  () => news.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  [news]
);
```

## 형식 자동화

모든 커밋 전에 다음 명령어를 실행하세요:

```bash
npm run lint:fix
npm run format
npm run type-check
```

또는 Git pre-commit hook을 설정하여 자동으로 실행할 수 있습니다.

## 코드 리뷰 체크리스트

- [ ] TypeScript 타입이 정의되어 있는가?
- [ ] Prettier 포맷이 적용되어 있는가?
- [ ] ESLint 경고가 없는가?
- [ ] 불필요한 `console.log`가 제거되었는가?
- [ ] Props에 기본값이 있는가?
- [ ] 에러 처리가 구현되어 있는가?
- [ ] 주석이 명확한가?

## 참고 자료

- [TypeScript 공식 문서](https://www.typescriptlang.org/docs/)
- [React 공식 문서](https://react.dev)
- [React Native 공식 문서](https://reactnative.dev)
- [Expo 공식 문서](https://docs.expo.dev)
- [ESLint 공식 문서](https://eslint.org)
- [Prettier 공식 문서](https://prettier.io)
