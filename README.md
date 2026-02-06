# 🕒[PWA] 웹데스크클럭-플립클럭

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black) ![Redux](https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) ![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white) ![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white) ![Language](https://img.shields.io/badge/Language-KO%20%2F%20EN-blue?style=for-the-badge)

**WebDeskClock**은 단순한 시계를 넘어, 작업 공간의 품격을 높여주는 **프리미엄 올인원 데스크 대시보드**입니다.

모던하고 세련된 **글래스모피즘(Glassmorphism) 디자인**을 바탕으로 제작되었으며, 실시간 시간, 날씨, 대기질, 그리고 구글 캘린더 일정을 한눈에 파악할 수 있는 최상의 시각적 경험을 제공합니다. 보조 모니터나 태블릿을 활용하여 데스크테리어(Deskterior)를 완성하고 싶은 사용자들을 위해 최적화되었습니다.

- **데스크테리어의 완성**: 미니멀한 다크 모드와 부드러운 애니메이션이 조화를 이루는 프리미엄 디자인.
- **지능형 정보 허브**: 현재 위치 기반의 실시간 기상 상태와 미세먼지 수치를 직관적으로 제공.
- **원활한 연동성**: 구글 캘린더 동기화를 통해 업무와 일상의 스케줄을 실시간으로 확인.
- **혁신적인 PWA 경험**: 브라우저의 군더더기를 제거한 풀스크린 모드와 자유로운 창 이동(Drag-to-move) 기능 지원.

---



## ✨ 핵심 기능

- **플립 시계 (Flip Clock)**: 아날로그 감성의 디지털 플립 시계로 가독성 높은 시간을 제공합니다. (Framer Motion 기반 애니메이션)
- **실시간 날씨 위젯**: 현재 온도, 날씨 상태(아이콘), 최고/최저 기온, 습도 정보를 실시간으로 제공합니다.
- **대기질 지수 (AQI)**: 미세먼지(PM10) 및 초미세먼지(PM2.5) 수치를 분석하여 상태를 직관적으로 표시합니다.
- **캘린더 위젯**: 월별 일정 관리 및 오늘 날짜 표시 기능을 포함한 콤팩트한 달력을 제공합니다.
- **구글 캘린더 연동**: 버튼 하나로 Google Calendar와 동기화하여 다가오는 일정을 확인할 수 있습니다.
- **다국어 지원 (Bilingual Context)**: 한국어와 영어 간의 실시간 언어 전환 버튼을 상단에 제공합니다.
- **PWA (Progressive Web App)**: 브라우저 인터페이스 없이 독립된 앱처럼 설치하여 사용할 수 있으며, 프레임리스 윈도우 모드와 드래그 이동 기능을 지원합니다.



<div style="
display: flex; 
gap: 10px; 
align-items: 
flex-start;"
>
<img 
alt="플립클럭 스크린샷"
width="350"
src="./public/images/screenshot-kor.png"/>
<img 
alt="플립클럭 스크린샷"
width="350"
src="./public/images/screenshot-kor.png"/>
</div>



---



## 🚀 테크 스택

- **Framework**: [Next.js (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) (for Google Calendar)

---



## 🛠️ 설치 및 실행 방법

### 1. 프로젝트 클론 및 의존성 설치
```bash
git clone <repository-url>
cd calendar-clock
npm install
```

### 2. 날씨 API 설정 (OpenWeatherMap)
날씨 및 대기질 정보를 표시하기 위해 OpenWeatherMap API 키가 필요합니다.

1.  **계정 생성**: [OpenWeatherMap 공식 사이트](https://openweathermap.org/)에 접속하여 가입합니다.
2.  **이메일 인증**: 가입 후 등록한 이메일로 발송된 확인 메일을 반드시 인증해야 API 키가 활성화됩니다.
3.  **API 키 확인**: 로그인 후 [API keys](https://home.openweathermap.org/api_keys) 탭에서 발급된 `Default` 키를 복사합니다.
4.  **활성화 대기**: 새 API 키는 활성화까지 **최소 30분에서 최대 2시간**이 소요될 수 있습니다. (즉시 작동하지 않을 경우 기다려 주세요.)

### 3. 환경 변수 설정
프로젝트 루트 디렉토리에 `.env.local` 파일을 생성하고 아래와 같이 키를 입력합니다.

```env
# 날씨 API 설정 (NEXT_PUBLIC_ 접두사 필수)
NEXT_PUBLIC_WEATHER_API_KEY=복사한_API_키_입력

# NextAuth 설정 (구글 캘린더 연동 시 필요)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=임의의_문자열
GOOGLE_CLIENT_ID=구글_클라이언트_ID
GOOGLE_CLIENT_SECRET=구글_클라이언트_시크릿
```

### 4. 개발 서버 실행
```bash
npm run dev
```
브라우저에서 `http://localhost:3000` 접속 시 확인 가능합니다.

---



## 📱 PWA 설치 및 데스크탑 앱처럼 사용하기

본 프로젝트는 설치형 웹 앱(PWA) 기능을 완벽하게 지원합니다.

1. **설치 방법**: Chrome 또는 Edge 브라우저 주소창 우측의 **'설치'** 아이콘을 클릭하거나 메뉴에서 **'앱 설치'**를 선택하세요.
2. **독립 실행**: 설치된 앱을 실행하면 브라우저 제어 도구(주소창, 탭 등)가 없는 깔끔한 **풀스크린/프레임리스 모드**로 실행됩니다.
3. **창 이동**: 화면 어느 곳이든 클릭하여 드래그하면 창을 자유롭게 이동할 수 있습니다. (데스크탑 위젯처럼 활용 가능)

---



## 📂 프로젝트 구조

```text
src/
├── app/              # Next.js App Router (Layout, Page, Global CSS)
├── components/       # 재사용 가능한 UI 컴포넌트
│   ├── calendar/     # 달력 관련 컴포넌트
│   ├── clock/        # 플립 시계 컴포넌트
│   ├── common/       # Providers, LanguageToggle 등 공통 요소
│   └── weather/      # 날씨 및 AQI 위젯
├── hooks/            # 커스텀 훅 (useWeather 등)
└── store/            # Redux Toolkit 설정 및 Slice 관리
```

---



## 💅 디자인 아이덴티티

- **Glassmorphism**: 반투명 배경과 블러 처리를 통한 세련된 카드 레이아웃.
- **Premium Dark Mode**: 시각적 피로도를 줄이는 딥 블랙 배경과 비비드한 포인트 컬러.
- **Micro-interactions**: 버튼 호버, 텍스트 상호작용 등 부드러운 애니메이션 적용.

---



## 📜 라이선스

이 프로젝트는 개인 학습 및 커스터마이징을 위해 자유롭게 사용 및 수정이 가능합니다.

---



## 📝 릴리즈 노트 (Release Notes)

### **v1.1.0 (2026-02-06)**
- **다국어 및 PWA 강화**: 한국어/영어 실시간 전환 및 윈도우 드래그 이동 기능 추가.
- **UI/UX 최적화**: 960x600 고정 해상도 및 콤팩트한 대시보드 레이아웃 적용.
- **안정성 및 보안**: 하이드레이션 오류 해결 및 API 키 환경 변수 통합 관리.
- **문서화 보강**: 날씨 API 설정 및 PWA 설치 가이드 상세 업데이트.

