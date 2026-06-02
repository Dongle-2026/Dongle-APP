# 돈글돈글 모바일 앱 - 초기 설정 완료 가이드

React Native Expo 프로젝트 초기 설정이 완료되었습니다. 이 문서는 설정된 내용을 요약합니다.

## ✅ 완료된 설정 항목

### 1. 프로젝트 구조

```
Dongle-APP/
├── app/                      # Expo Router 기반 라우팅
│   ├── (tabs)/               # 탭 네비게이션
│   ├── _layout.tsx           # 앱 레이아웃
│   └── modal.tsx             # 모달 화면
├── components/               # 재사용 가능한 React 컴포넌트
├── constants/                # 앱 전체 상수
├── context/                  # React Context (상태 관리)
├── hooks/                    # 커스텀 React Hooks
├── services/                 # API 서비스
│   └── newsService.ts        # 뉴스 API 서비스
├── types/                    # TypeScript 타입 정의
├── utils/                    # 유틸리티 함수
│   ├── api.ts                # API 클라이언트
│   └── index.ts              # 유틸리티 내보내기
├── assets/                   # 이미지, 폰트 등
├── app.json                  # Expo 앱 메타데이터
├── tsconfig.json             # TypeScript 설정
├── package.json              # 프로젝트 의존성
└── README.md                 # 프로젝트 문서
```

### 2. 메타정보 설정

- **앱 이름**: 돈글돈글
- **설명**: 청년을 위한 금융 뉴스 플랫폼
- **버전**: 1.0.0
- **슬러그**: dongle-mobile

### 3. 코드 스타일 도구

#### ESLint (코드 품질)

- **설정 파일**: `eslint.config.js` (ESLint 9 형식)
- **규칙**:
  - TypeScript 지원
  - 사용하지 않은 변수 감지 (\_접두사는 무시)
  - console.warn/error만 허용

#### Prettier (코드 포매팅)

- **설정 파일**: `.prettierrc.json`
- **주요 규칙**:
  - 줄 길이: 100자
  - 탭 너비: 2칸
  - 따옴표: 싱글 쿼트
  - 세미콜론: 필수
  - 줄 끝: LF

### 4. TypeScript 설정

- **설정 파일**: `tsconfig.json`
- **strict 모드**: 활성화
- **경로 별칭** (Path Aliases):
  - `@/*` → 프로젝트 루트
  - `@/components` → components
  - `@/app` → app
  - `@/utils` → utils
  - `@/services` → services
  - `@/types` → types
  - `@/hooks` → hooks
  - `@/context` → context

### 5. 환경변수 설정

- **파일**:
  - `.env.example` - 환경변수 템플릿
  - `.env.local` - 로컬 개발 환경설정 (생성됨)

- **주요 변수**:
  - `EXPO_PUBLIC_API_URL` - 백엔드 API 주소
  - `EXPO_PUBLIC_API_TIMEOUT` - API 타임아웃 시간
  - `EXPO_PUBLIC_ENV` - 환경 (development/production)
  - `EXPO_PUBLIC_ENABLE_DEBUG` - 디버그 모드
  - `EXPO_PUBLIC_LOG_LEVEL` - 로그 레벨

### 6. 기본 라이브러리

#### Core

- React 19.2.3
- React Native 0.85.3
- Expo ~56.0.8
- TypeScript ~6.0.3

#### Navigation & Router

- expo-router ~56.2.8

#### UI & Animation

- react-native-reanimated 4.3.1
- react-native-web ~0.21.0

#### Native Modules

- expo-constants
- expo-font
- expo-linking
- expo-splash-screen
- expo-status-bar
- expo-symbols
- expo-web-browser
- react-native-safe-area-context
- react-native-screens

#### Dev Tools

- eslint
- prettier
- @typescript-eslint/eslint-plugin
- @typescript-eslint/parser
- @types/react
- @types/node
- dotenv

### 7. npm Scripts

```bash
npm start              # 개발 서버 시작
npm run ios            # iOS 시뮬레이터 실행
npm run android        # Android 에뮬레이터 실행
npm run web            # 웹 브라우저에서 실행
npm run lint           # ESLint 검사
npm run lint:fix       # ESLint 자동 수정
npm run format         # Prettier 포매팅
npm run format:check   # 포매팅 확인만
npm run type-check     # TypeScript 타입 확인
```

## 🚀 다음 단계

### 1. 개발 서버 시작

```bash
npm start
```

### 2. 기본 화면 구성

- `app/(tabs)/index.tsx` - 뉴스 피드 화면
- `app/(tabs)/two.tsx` - 북마크 또는 설정 화면
- 커스텀 라우팅은 `.../app` 디렉토리에서 추가

### 3. API 통합

- `services/newsService.ts` - 뉴스 관련 API 호출
- `utils/api.ts` - 기본 API 클라이언트

예시:

```typescript
import { newsService } from '@/services';

const response = await newsService.getLatestNews(1, 10);
if (response.error) {
  console.error(response.error.message);
} else {
  console.log(response.data);
}
```

### 4. 컴포넌트 개발

모든 コンポーネントはアセット → `components/` 디렉토리에 저장하고, `React.FC<Props>` 형식으로 작성

예시:

```typescript
interface NewsCardProps {
  news: News;
  onPress?: (id: string) => void;
}

export const NewsCard: React.FC<NewsCardProps> = ({ news, onPress }) => {
  return (
    <Pressable onPress={() => onPress?.(news.id)}>
      {/* Component JSX */}
    </Pressable>
  );
};
```

### 5. 상태 관리

- 간단한 상태: `useState`
- 앱 전역 상태: `context/` 에서 React Context 구성

### 6. 코드 품질 유지

커밋 전에 항상 실행:

```bash
npm run lint:fix      # 린트 자동 수정
npm run format        # 코드 포매팅
npm run type-check    # 타입 검사
```

## 📚 문서

- [README.md](./README.md) - 프로젝트 개요 및 사용법
- [CODE_STYLE_GUIDE.md](./CODE_STYLE_GUIDE.md) - 상세한 코드 스타일 가이드

## 🔨 빌드 및 배포

### 개발 빌드

```bash
npm run ios       # iOS 시뮬레이터
npm run android   # Android 에뮬레이터
npm run web       # 웹
```

### EAS Build (프로덕션)

```bash
# iOS
eas build --platform ios

# Android
eas build --platform android
```

자세한 정보: [Expo EAS Build](https://docs.expo.dev/build/setup/)

## 🐛 문제 해결

### 포트 충돌

개발 서버가 이미 실행 중인 경우:

```bash
npm start -- --clear
# 또는 다른 포트 사용
npm start -- --port 8081
```

### 캐시 문제

```bash
npm start -- --clear
# 또는
rm -rf node_modules .expo
npm install
npm start
```

### 타입 에러

```bash
npm run type-check
```

## 📝 주요 경로 별칭

코드에서 import 할 때 경로 별칭 사용:

```typescript
// ✓ Good
import { NewsCard } from '@/components';
import { newsService } from '@/services';
import { News } from '@/types';
import { useCustomHook } from '@/hooks';

// ✗ Bad (경로 별칭 미사용)
import { NewsCard } from '../../../components';
import { newsService } from '../../../services';
```

## ✨ 팁

1. **Expo DevTools 활용**: `npm start` 후 `j` 키를 누르면 DevTools가 열립니다
2. **Hot Reload**: 코드 저장 시 자동으로 앱이 새로고침됩니다
3. **콘솔 로그**: DevTools의 Console 탭에서 `console.log` 출력을 확인할 수 있습니다
4. **디버깅**: Chrome의 React Developer Tools를 사용하여 전체 앱을 디버그할 수 있습니다

## 📞 지원

더 자세한 정보:

- [Expo 공식 문서](https://docs.expo.dev)
- [React Native 공식 문서](https://reactnative.dev)
- [TypeScript 공식 문서](https://www.typescriptlang.org/)

---

**설정 완료 일시**: 2026-06-02  
**Expo SDK 버전**: 56  
**Node.js**: 18+  
**npm**: 9+
