# 설치와 설정

## 준비

- 같은 신뢰할 수 있는 LAN에 연결된 Samsung Tizen TV와 개발 PC.
- Samsung TV Extension이 있는 Tizen Studio, Samsung Certificate Manager.
- Python 3.10+ (브리지), Node.js (선택: JS 문법 검사).
- 개인 Samsung TV author/distributor 인증서. 자신의 TV DUID를 distributor 인증서에 추가합니다. 비밀번호·인증서는 Git에 넣지 않습니다.

Samsung 공식 문서: [인증서 생성](https://developer.samsung.com/smarttv/develop/getting-started/setting-up-sdk/creating-certificates.html), [TV 기기 연결](https://developer.samsung.com/smarttv/develop/getting-started/using-sdk/tv-device.html).

## TV 연결

1. Apps의 Developer Mode를 켜고 Host PC IP를 자신의 PC LAN 주소로 설정합니다. 변경 후 TV를 완전히 재시작합니다.
2. TV Network Status에서 사설 LAN 주소를 확인합니다. 공인 IP가 아닙니다.
3. `python3 scripts/check-monitor.py TV_LAN_IP`로 개발 포트와 로컬 API를 확인합니다. 이 스크립트는 설정을 변경하지 않습니다.
4. `app/config.js`의 `bridgeUrl`을 자신의 PC 주소와 포트 18766으로 설정합니다. TV의 `127.0.0.1`은 Mac이 아니라 TV 자신을 가리킵니다.
5. `python3 scripts/news-server.py`를 실행합니다. Mac을 켜고 같은 LAN에 연결한 상태로 둡니다. 방화벽에서 TV의 접근을 허용합니다.

## 빌드·서명·설치

SDK 경로 기본값은 저장소 아래 `.tools/tizen-studio`입니다. 다른 경로면 `TIZEN_SDK_ROOT`를 지정하세요. Samsung Certificate Manager에서 서명 프로필을 준비한 뒤:

```sh
TIZEN_SDK_ROOT=/path/to/tizen-studio bash scripts/install-tv.sh TV_LAN_IP YOUR_PROFILE
```

스크립트는 웹 빌드, 개인 인증서 서명, SDB 연결, 설치, `CleanM7App.Home` 실행을 순서대로 수행합니다. 생성된 WGT를 공백 없는 파일명으로 복사합니다. CLI의 성공 메시지는 화면 표시나 리모컨 사용 확인을 대신하지 않습니다. 각 기기에서 확인하세요.

## Home 버튼·자동 시작·원복

공개 설치 스크립트는 Home 또는 자동 시작 설정을 변경하지 않습니다. 이전 개인 기기에서는 native app-operation/vconf 기반 별도 도구로 Home 지정·원복을 확인했지만, 해당 도구는 개인 기기 정보와 SDK transport에 의존합니다. 이 공개본에는 SDK transport, native 바이너리, 기기 백업 및 변경 스크립트를 넣지 않았습니다.

일반 설치만 했다면 Samsung 앱 목록에서 Clean M7을 제거할 수 있습니다. 별도로 Home을 변경한 기기는 **변경 전에 저장한 자신의 원래 Home·자동 시작 값으로 먼저 원복**한 뒤 앱을 제거해야 합니다. 모델이 다르면 타인의 기본값을 복사하지 마세요. 이 저장소는 범용 Home 복구 명령을 제공하지 않습니다.

## 데이터 브리지

`/health`, `/api/weather`, `/api/news`, `/api/stocks`, `/api/ott`, `/api/music` 경로가 있습니다. 브리지는 기본적으로 모든 인터페이스의 18766 포트를 열며 CORS 전체 허용·인증 없음입니다. **신뢰할 수 있는 LAN에서만 사용하고 인터넷으로 포트 포워딩하지 마세요.** `/api/music`은 macOS에서 현재 재생 메타데이터를 읽을 수 있는 잔여 구현입니다. 현재 TV 위젯에서는 사용하지 않습니다.

기상청 API 키는 선택 사항입니다. `KMA_API_KEY` 또는 `KMA_AUTH_KEY` 환경변수, 혹은 무시되는 `.tools/kma-key.txt`에 보관합니다. TV 설정에 키를 저장하는 경로도 있으나 HTTP 쿼리로 브리지에 전달될 수 있으므로 키를 앱 소스에 넣지 마세요. 키 없이 KMA RSS/Open-Meteo 대체 경로를 사용할 수 있습니다.

LaunchAgent는 공개본에 포함하지 않습니다. 먼저 터미널에서 정상 동작을 확인하고, 자신의 경로·실행 환경으로 자동 실행을 구성하세요. Mac 잠자기·종료·IP 변경 시 위젯 데이터가 갱신되지 않을 수 있습니다.
