# 꽃보다 제주 (Jeju over Flowers)

제주에서의 안전하고 건강한 웰니스 여행을 위한 AI 맞춤형 여행 코스 및 향토 음식 영양 분석 서비스입니다.

## 주요 기능

- **건강 프로필 설정**: 당뇨, 고혈압, 신장 질환, 알레르기, 비건 등 건강 요인/관심사를 선택
- **웰니스 여행 코스 추천**: 선택한 건강 요인에 맞춘 제주 여행 일정 제안
- **향토 음식 영양 분석**: Gemini AI가 음식별 위험도 점수(당뇨/고혈압/신장/알레르기/비건)와 탄수화물·나트륨·당류를 분석하고, 안전하게 먹는 요령과 더 건강한 대체 음식을 추천
- **AI 웰니스 챗봇**: 여행 중 궁금한 점을 물어보면 제주 명소, 맛집, 힐링 코스 등을 웰니스 관점에서 안내

## 기술 스택

- **프론트엔드**: React 19, TypeScript, Vite, Tailwind CSS, Framer Motion(`motion`), lucide-react
- **백엔드**: Express, `@google/genai` (Gemini API)

## 프로젝트 구조

```
server.ts               Express 서버 (Gemini API 프록시 + Vite 미들웨어/정적 파일 서빙, 로컬 개발용)
api/gemini/              Vercel 배포용 서버리스 함수 (server.ts와 동일한 로직)
lib/foodNutritionApi.ts  식약처 식품영양성분DB Open API 연동 (공식 영양 데이터 조회)
src/
  App.tsx                화면 라우팅 (welcome → home → route/food-analysis)
  components/
    WelcomeScreen.tsx     건강 프로필 선택 화면
    DashboardScreen.tsx   홈 대시보드
    WellnessRouteScreen.tsx  웰니스 여행 코스 화면
    FoodAnalysisScreen.tsx   음식 영양/위험도 분석 화면
    ChatModal.tsx         AI 웰니스 챗봇 모달
  data.ts                 목업 데이터 및 기본 분석 fallback
  types.ts                공용 타입 정의
```

## 로컬 실행

**사전 준비**: Node.js

1. 의존성 설치
   ```
   npm install
   ```
2. `.env.example`을 참고해 `.env.local` 파일을 만들고 `GEMINI_API_KEY`에 발급받은 Gemini API 키를 입력
3. 개발 서버 실행
   ```
   npm run dev
   ```
   기본적으로 http://localhost:3000 에서 실행됩니다.

## 빌드 및 배포

```
npm run build   # 프론트엔드 빌드 + 서버 번들 생성
npm start        # 프로덕션 서버 실행 (dist/server.cjs)
```

## 환경 변수

| 변수 | 설명 |
| --- | --- |
| `GEMINI_API_KEY` | Gemini API 호출에 사용되는 API 키 |
| `APP_URL` | 앱이 호스팅되는 URL (자체 참조 링크 등에 사용) |
| `FOOD_SAFETY_API_KEY` | 식품의약품안전처 식품영양성분DB Open API 키 (미설정 시 AI 추정치로만 동작) |
