# Yeon 전국 Temple Seed Import

## Source lineage

- canonical 존재 기준: 문화체육관광부 `전통사찰 현황(991개소, 2026.6.1.기준)`
- 위치 보강: 행정안전부 LOCALDATA `문화_전통사찰`, 2026-08-15 다운로드 스냅샷
- 좌표 변환: EPSG:5174 원본 X/Y를 WGS84 latitude/longitude로 변환
- raw snapshot: `data/temples/raw/`
- 수동 match/alias 판단: `data/temples/match-overrides.json`
- 생성 canonical 및 검토 결과: `data/temples/generated/`
- 앱 runtime은 raw X/Y·원본 주소를 제외한 `nationwide-temples.runtime.json`만 사용하며 전체 source audit 정보는 `nationwide-temples.json`에 보존

## Import result

| 항목 | 수 |
| --- | ---: |
| MCST 공식 대상 | 991 |
| 최종 canonical | 991 |
| 기존 canonical 병합 | 6 |
| 신규 canonical | 985 |
| A (좌표 있음) | 874 |
| B (좌표 없음) | 59 |
| C (안전한 LOCALDATA match 없음) | 58 |
| LOCALDATA 연결 | 933 |
| alias | 23 |
| 중복 | 0 |
| 검증 실패 | 0 |

`874 + 59 + 58 = 991`이다. C도 MCST 공식 canonical로 생성되며 좌표는 null이다.

## Reproduction and review

1. 공식 PDF와 CP949 CSV를 `tmp/pdfs/`, `tmp/temple-import/`에 둔다.
2. `npm run temples:sources`로 UTF-8 raw snapshot을 추출한다.
3. `npm run temples:seed`로 match와 좌표 변환을 수행한다.
4. 생성 diff와 `nationwide-temples-review.json`을 검토한다.
5. `npm run temples:seed:check`와 `npm run temples:validate`를 실행한다.

새 source와 이전 생성본은 `node scripts/temple-seed/diff.mjs <previous> <next>`로 비교한다. 삭제·지정 변경 후보는 자동 삭제하지 않고 `removedCandidates`로만 보고한다.

## Manual review remaining

검증된 source-only match 8건은 MCST name/address와 기존 좌표를 유지한 채 LOCALDATA identity만 연결했다. 나머지 C 58건은 강제 연결하지 않았으며 검토 파일에 후보와 사유를 보존한다.
