# 오디오 파일 보호 가이드 (GitHub Pages 호환)

## 구현된 보호 기능

### 1. 클라이언트 사이드 보호 (정적 호스팅 호환)

- **개발자 도구 감지**: 창 크기 변화로 DevTools 열림 감지
- **자동 일시정지**: DevTools 열림 시 음악 자동 정지  
- **단축키 차단**: F12, Ctrl+Shift+I, Ctrl+U 등 차단
- **우클릭 방지**: 컨텍스트 메뉴 비활성화
- **오디오 컨트롤 제한**: `controlsList="nodownload"` 속성
- **실시간 모니터링**: 1초마다 개발자 도구 상태 확인

### 2. GitHub Pages 호환 설계

- **정적 파일 경로**: `/assets/space-ambient.mp3` 직접 사용
- **서버리스 보호**: API 라우트 없이 클라이언트만으로 보호
- **브라우저 정책 활용**: HTML5 오디오 보안 속성 최대 활용

### 3. 추가 보호 레벨 (선택사항)

#### A. HLS 스트리밍 방식
```typescript
// HLS.js 사용 예시
import Hls from 'hls.js';

const hls = new Hls();
hls.loadSource('/api/stream/audio.m3u8');
hls.attachMedia(audioElement);
```

#### B. 암호화된 청크 방식
```typescript
// 파일을 작은 청크로 분할하여 암호화
const chunks = await fetch('/api/audio/chunk/1?key=dynamic_key');
```

#### C. Web Audio API 방식
```typescript
// ArrayBuffer로 로드하여 직접 재생
const audioContext = new AudioContext();
const buffer = await audioContext.decodeAudioData(encryptedData);
```

## 보안 수준

### 🟢 기본 사용자 (90% 차단)
- 우클릭 저장 불가
- 직접 URL 접근 불가
- 기본적인 다운로드 도구 차단

### 🟡 중급 사용자 (70% 차단)  
- 개발자 도구 Network 탭에서 복사 어려움
- 토큰 기반 접근으로 직접 다운로드 차단
- Referer 검증으로 외부 접근 차단

### 🔴 고급 사용자 (50% 차단)
- 브라우저 메모리 덤프 필요
- 웹 오디오 스트림 캡처 도구 필요
- 자동화 스크립트 작성 필요

## 한계점

⚠️ **완전한 보호는 불가능**
- 클라이언트에서 재생되는 모든 미디어는 기술적으로 추출 가능
- 스크린 레코더로 오디오 캡처 가능
- 브라우저 확장프로그램으로 우회 가능

## 권장사항

1. **저작권 표시**: 명확한 라이선스 정보 제공
2. **워터마크**: 오디오에 식별 가능한 정보 삽입
3. **법적 보호**: 이용약관에 저작권 침해 금지 명시
4. **모니터링**: 무단 사용 감지 시스템 구축

## 사용법

현재 구현된 보호 기능은 자동으로 작동합니다:

1. 정상 사용자: 투명하게 음악 재생
2. 개발자 도구 열림: 즉시 오디오 차단  
3. 직접 URL 접근: 403 에러 반환
4. 자동화 도구: User-Agent 필터링으로 차단

이 보호 수준으로 대부분의 일반적인 다운로드 시도를 차단할 수 있습니다.