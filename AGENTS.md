<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## 이미지 업로드 정책

- 구인, 행사교육, 사찰, 템플스테이, 사찰음식 등록은 대표 이미지 1장만 허용한다.
- 사용자가 선택할 수 있는 원본 이미지의 최대 용량은 10MB로 제한한다.
- 업로드 전에 이미지의 긴 변을 최대 1600px로 자동 축소한다.
- 업로드 이미지는 WebP로 자동 변환한다.
- 변환 후 파일 크기는 약 500KB 안팎을 목표로 한다.
- 이미지는 Supabase Storage에 저장하고 데이터베이스에는 이미지 URL만 저장한다.
- 파일 형식과 용량은 프론트엔드와 서버 양쪽에서 검증한다.
- 허용 형식은 JPG, PNG, WebP로 한다.
- 홍보물 DIY에서 사용자가 선택한 이미지는 서버에 저장하지 않고 브라우저 안에서만 처리한다.
- 상세 이미지 갤러리는 초기 서비스에 추가하지 않고 실제 사용자 요구가 확인된 후 검토한다.
- Supabase 업로드 기능을 구현할 때 이 정책을 필수로 적용한다.
