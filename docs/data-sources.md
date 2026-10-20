# 데이터 제공처와 한계

| 종류 | 현재 경로 | TV 갱신 주기 | 주의점 |
| --- | --- | --- | --- |
| 날씨 | Mac 기상청 API Hub → RSS/보조 Open-Meteo, TV 직접 Open-Meteo 대체 | 기본 15분 | 관측·예보·모델이 혼합될 수 있음. 기본 지역 고정 |
| 대기질 | Open-Meteo Air Quality | 기본 15분 | 모델 수치이며 동네 측정소 실측 보장 없음 |
| 뉴스 | 연합뉴스 분야별 RSS, Mac 브리지 | 45초 | RSS 게시·브리지 캐시로 지연 가능. 속보 표시와 실제 사건 발생 시각은 다름 |
| 증시 | Naver Finance, Yahoo Chart 대체 | 30초 | 거래소 직접 피드 아님. 지연·휴장·이전 종가·캐시 가능 |
| 코인 | Upbit KRW-BTC / KRW-ETH | 증시 조회와 함께 | 지수와 다른 자산·거래소. 모든 시장 가격 아님 |
| OTT | 고정 추천 + JustWatch KR + Google News RSS | 기본 전체 조회 15분, 브리지 주간 캐시 최대 3시간 | 고정 목록의 실제 출시 일정·출연진은 검증되지 않음 |
| 음악 | 브리지 macOS Now Playing 잔여 경로 | 현재 UI 연결 없음 | API 존재를 TV 음악 기능 완성으로 해석하지 말 것 |

`document.hidden`이면 정기 조회를 건너뜁니다. 브리지 자체 캐시와 외부 응답 때문에 폴링 주기는 데이터 최신성 보장이 아닙니다. 일부 실패 시 캐시를 사용하며, 모든 값에 일관된 지연·대체값 표시가 보장되지는 않습니다.

## 현재 코드에서 확인한 정확성 문제

- 날씨 상세는 누락 시 습도 50%, 풍속 1.8m/s, UV 3, 고저온·일출일몰 등의 대체값을 넣는 경로가 있습니다. 데이터가 없는 상태에서도 실측처럼 보일 수 있어 보완이 필요합니다.
- 날씨 제목은 기상청으로 표시돼도 Open-Meteo 대체 데이터가 사용될 수 있습니다.
- 증시 자동 전환은 기기 로컬 시각의 07:00–20:00 기준입니다. 한국 시간대를 전제로 하며 거래일·휴일·미국 서머타임에 따라 장 개장을 판단하지 않습니다.
- OTT 고정 항목이 서버에서 `live: true`로 표시되는 경로가 있습니다. 이 값만으로 신작 정보가 검증됐다고 볼 수 없습니다. 문서에서는 실시간 신작 정확성을 주장하지 않습니다.
- 콘텐츠 딥링크는 앱·펌웨어별 동작이 다를 수 있으며, 플랫폼 앱 실행과 특정 작품 직접 재생은 별개의 검증 사항입니다.
- 통신은 외부 사이트 정책·CORS·API 변경에 따라 중단될 수 있습니다.

## 출처

- [기상청 API Hub](https://apihub.kma.go.kr/), [기상청 날씨누리](https://www.weather.go.kr/)
- [Open-Meteo Weather](https://open-meteo.com/en/docs), [Air Quality](https://open-meteo.com/en/docs/air-quality-api)
- [연합뉴스 RSS](https://www.yna.co.kr/rss/news.xml)
- [Naver Finance](https://m.stock.naver.com/), [Yahoo Finance](https://finance.yahoo.com/)
- [Upbit Open API](https://docs.upbit.com/)
- [JustWatch](https://www.justwatch.com/kr), [Google News](https://news.google.com/)

공개 엔드포인트 접근 가능 여부가 데이터 재배포 권한 또는 상업적 이용 허가를 의미하지 않습니다. 배포·서비스화 시 각 제공처 조건을 확인하세요.
