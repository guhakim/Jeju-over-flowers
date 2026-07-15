# 꽃보다 제주 (Jeju over Flowers)

제주에서의 안전하고 건강한 웰니스 여행을 위한 AI 맞춤형 여행 코스 및 향토 음식 영양 분석 서비스입니다.

## 주요 기능

- **건강 프로필 설정**: 당뇨, 고혈압, 신장 질환, 알레르기, 비건 등 건강 요인/관심사를 선택
- **웰니스 여행 코스 추천**: 선택한 건강 요인에 맞춘 제주 여행 일정 제안, 실시간 대기질·자외선지수 표시
- **향토 음식 영양 분석**: 식약처 식품영양성분DB로 실측 영양치를 조회하고, Gemini AI가 그 데이터를 근거로 위험도 점수(당뇨/고혈압/신장/알레르기/비건)와 안전하게 먹는 요령·대체 음식을 제안 (근거 데이터가 없을 땐 AI 추정치로 자동 대체)
- **실시간 응급의료 안내**: 국립중앙의료원 응급의료정보(E-Gen)로 제주 권역 응급의료기관 목록을 실시간 조회
- **인증된 무장애 여행지**: 제주데이터허브의 무장애 여행지 정보를 연동해 이동약자를 위한 실제 인증 장소를 안내
- **AI 웰니스 챗봇**: 여행 중 궁금한 점을 물어보면 제주 명소, 맛집, 힐링 코스 등을 웰니스 관점에서 안내

## 기술 스택

- **프론트엔드**: React 19, TypeScript, Vite, Tailwind CSS, Framer Motion(`motion`), lucide-react
- **백엔드**: Express(로컬 개발) / Vercel Serverless Functions(배포), `@google/genai` (Gemini API)
- **배포**: Vercel (GitHub 연동으로 `main` 브랜치 push 시 자동 재배포) — https://jeju-over-flowers.vercel.app

## 프로젝트 구조

```
server.ts                     Express 서버 (로컬 개발용 — API 프록시 + Vite 미들웨어/정적 파일 서빙)
api/
  gemini/
    analyze.ts                 음식 영양·위험도 분석 (Vercel 서버리스)
    chat.ts                    AI 웰니스 챗봇 (Vercel 서버리스)
  emergency/
    hospitals.ts                제주 응급의료기관 목록 (Vercel 서버리스)
  environment/
    jeju.ts                    제주 대기질·자외선지수 (Vercel 서버리스)
  tourism/
    barrier-free.ts             제주 무장애 여행지 목록 (Vercel 서버리스)
  _lib/                        공공데이터 API 연동 로직 (server.ts와 api/*.ts가 공유, "_" 접두사로 라우팅 제외)
    foodNutritionApi.ts        식약처 식품영양성분DB
    emergencyMedicalApi.ts     국립중앙의료원 E-Gen 응급의료정보
    weatherApi.ts               한국환경공단 에어코리아 + 기상청 생활기상지수
    jejuDataHub.ts               제주데이터허브 무장애 여행지 정보
src/
  App.tsx                     화면 라우팅 (welcome → home → route/food-analysis)
  components/
    WelcomeScreen.tsx          건강 프로필 선택 화면
    DashboardScreen.tsx        홈 대시보드 (실시간 응급의료기관 포함)
    WellnessRouteScreen.tsx    웰니스 여행 코스 화면 (실시간 대기질·자외선·무장애 여행지 포함)
    FoodAnalysisScreen.tsx     음식 영양/위험도 분석 화면 (공식 데이터 여부 배지 포함)
    ChatModal.tsx              AI 웰니스 챗봇 모달
  data.ts                      목업 데이터 및 API 실패 시 오프라인 fallback
  types.ts                     공용 타입 정의
```

`api/*.ts`는 각각 `server.ts`의 동일 라우트와 로직을 공유하며, 로컬 개발(Express)과 Vercel 배포 양쪽에서 같은 `api/_lib/*` 모듈을 참조합니다.

## 공공데이터 연동

각 기능은 정부/지자체 공개 API를 실시간으로 조회해 실제 데이터를 근거로 사용하고, API 호출이 실패하면 `data.ts`의 정적 목업으로 자연스럽게 대체됩니다.

| 연동 | 제공기관 | 엔드포인트 | 대체된 목업 |
| --- | --- | --- | --- |
| 식품영양성분DB | 식품의약품안전처 (data.go.kr) | `apis.data.go.kr/1471000/FoodNtrCpntDbInfo02/getFoodNtrCpntDbInq02` | Gemini가 임의로 생성하던 탄수화물/나트륨/당류 수치 |
| 응급의료기관 정보 | 국립중앙의료원 E-Gen (data.go.kr) | `apis.data.go.kr/B552657/ErmctInfoInqireService/getEgytListInfoInqire` | 하드코딩된 병원 4곳 목록 |
| 대기오염정보 | 한국환경공단 에어코리아 (data.go.kr) | `apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty` | 고정 문구 "PM2.5 8 µg/m³" |
| 생활기상지수(자외선) | 기상청 (data.go.kr) | `apis.data.go.kr/1360000/LivingWthrIdxServiceV5/getUVIdxV5` | 고정 문구 "자외선 자극지수 보통" |
| 무장애 여행지 정보 | 제주특별자치도 (제주데이터허브) | `jejudatahub.net/api/data/view?id=858` | 서사형 목업 코스 설명 |

식품영양성분DB/응급의료기관/대기질/자외선 4개는 data.go.kr 활용신청으로 발급받은 **동일 계정 서비스키**(`FOOD_SAFETY_API_KEY`)를 공유합니다 — data.go.kr은 계정당 서비스키를 1개만 발급하기 때문입니다. 무장애 여행지 정보는 별도 인증키 없이 공개 조회됩니다.

## 로컬 실행

**사전 준비**: Node.js

1. 의존성 설치
   ```
   npm install
   ```
2. `.env.example`을 참고해 `.env.local` 파일을 만들고 `GEMINI_API_KEY`(필수)와 `FOOD_SAFETY_API_KEY`(선택, 미설정 시 해당 기능들은 오프라인 목업으로 동작)를 입력
3. 개발 서버 실행
   ```
   npm run dev
   ```
   기본적으로 [http://localhost:3000](https://jeju-over-flowers.vercel.app/) 에서 실행됩니다.

## 빌드 및 배포

### 로컬 프로덕션 빌드

```
npm run build   # 프론트엔드 빌드 + 서버 번들 생성
npm start        # 프로덕션 서버 실행 (dist/server.cjs)
```

### Vercel 배포

`main` 브랜치에 push하면 Vercel이 자동으로 재배포합니다. 프론트엔드는 Vite 정적 빌드로, API는 `api/**/*.ts`가 각각 서버리스 함수로 배포됩니다.

```
npx vercel env add GEMINI_API_KEY production        # 최초 1회
npx vercel env add FOOD_SAFETY_API_KEY production   # 최초 1회
npx vercel deploy --prod                             # 수동 배포가 필요할 때
```

## 환경 변수

| 변수 | 설명 |
| --- | --- |
| `GEMINI_API_KEY` | Gemini API 호출에 사용되는 API 키 |
| `APP_URL` | 앱이 호스팅되는 URL (자체 참조 링크 등에 사용) |
| `FOOD_SAFETY_API_KEY` | data.go.kr 계정 서비스키. [공공데이터 연동](#공공데이터-연동)의 4개 API가 공유 (미설정 시 각각 오프라인 목업으로 동작) |
