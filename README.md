# 돈글돈글 - 모바일 앱

청년을 위한 금융 뉴스 플랫폼의 React Native Expo 모바일 앱입니다.

## 프로젝트 정보

- **프로젝트명**: 돈글돈글
- **설명**: 청년을 위한 금융 뉴스 플랫폼
- **기술 스택**:
  - React Native
  - Expo
  - TypeScript
  - Expo Router (라우팅)
  - React 19

## 필수 요구사항

- Node.js >= 18
- npm >= 9
- Expo CLI (선택사항, `npm start`로 자동 실행 가능)

## 설치

```bash
# 저장소 클론
git clone <repository-url>
cd Dongle-APP

# 의존성 설치
npm install

# 환경변수 설정
cp .env.example .env.local
# .env.local 수정 (필요시)
```

## 개발

### 앱 시작

```bash
# 개발 서버 시작 (iOS, Android, Web 선택 가능)
npm start

# iOS 시뮬레이터
npm run ios

# Android 에뮬레이터
npm run android

# 웹 브라우저
npm run web
```

### 코드 품질

```bash
# 린트 확인
npm run lint

# 린트 자동 수정
npm run lint:fix

# 코드 포매팅 확인
npm run format:check

# 코드 포매팅 적용
npm run format

# TypeScript 타입 체크
npm run type-check
```

## 프로젝트 구조

```
Dongle-APP/
├── app/                      # Expo Router - 앱 라우팅
├── components/               # 재사용 가능한 React 컴포넌트
├── constants/                # 상수 정의
├── context/                  # React Context (상태 관리)
├── hooks/                    # 커스텀 React Hooks
├── services/                 # API 서비스, 데이터 페칭
├── types/                    # TypeScript 타입 정의
├── utils/                    # 유틸리티 함수
├── assets/                   # 이미지, 폰트 등 정적 파일
├── app.json                  # Expo 앱 설정
├── tsconfig.json             # TypeScript 설정
├── .eslintrc.json            # ESLint 설정
├── .prettierrc.json          # Prettier 설정
├── .env.example              # 환경변수 예제
└── package.json              # 프로젝트 의존성
```

## 환경변수

`.env.local` 파일을 참고하여 환경변수를 설정합니다.

| 변수                       | 설명                   | 기본값                  |
| -------------------------- | ---------------------- | ----------------------- |
| `EXPO_PUBLIC_API_URL`      | 백엔드 API URL         | `http://localhost:3000` |
| `EXPO_PUBLIC_API_TIMEOUT`  | API 요청 타임아웃 (ms) | `30000`                 |
| `EXPO_PUBLIC_ENV`          | 실행 환경              | `development`           |
| `EXPO_PUBLIC_ENABLE_DEBUG` | 디버그 모드 활성화     | `true`                  |

## 코드 스타일

- **언어**: TypeScript
- **포매팅**: Prettier
- **린팅**: ESLint
- **패턴**: React Hooks, Functional Components

자세한 코드 스타일 가이드는 [CODE_STYLE_GUIDE.md](./CODE_STYLE_GUIDE.md)를 참고하세요.

## 주요 기능

- 금융 뉴스 피드
- 카테고리별 뉴스
- 뉴스 검색
- 북마크 (구현 예정)
- 사용자 설정 (구현 예정)

## API 명세

### 뉴스 가져오기

```
GET /api/news?page=1&limit=10
```

### 카테고리별 뉴스

```
GET /api/news?category=금융&page=1&limit=10
```

### 뉴스 검색

```
GET /api/news/search?q=검색어&page=1
```

## 디버깅

Expo DevTools를 사용하여 앱을 디버깅할 수 있습니다:

```bash
npm start
# 'j'를 누르면 DevTools가 열립니다
```

## 배포

```bash
# iOS
npm run ios -- --release

# Android
npm run android -- --release

# 또는 EAS Build 사용
eas build --platform ios
eas build --platform android
```

더 많은 정보: [Expo 배포 가이드](https://docs.expo.dev/build/setup/)

## 라이선스

[LICENSE](./LICENSE) 참고

## 기여 가이드

자세한 내용은 프로젝트 관리자에게 문의하세요.
