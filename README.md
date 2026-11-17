# Jaewoo Jung · Mathematics

[![Jaewoo Jung — Homepage](./github-banner.svg)](https://jungjaewoo2020.github.io/)

개인 수학 연구 홈페이지. 원본 Google Sites의 배경, 사진, 소개, 연구 분야, 논문 7편 및 연락처 구성을 유지했습니다.

## 홈페이지

- 주소: https://jungjaewoo2020.github.io/
- 삽입 코드 도구: https://jungjaewoo2020.github.io/embed.html
- 원래 홈페이지: https://sites.google.com/view/jaewoojung

## GitHub Pages 설정

저장소 **Settings → Pages → Build and deployment**에서 **Deploy from a branch**, **main**, **/(root)**를 선택합니다. 이후 main에 수정한 파일을 올리면 홈페이지가 자동 갱신됩니다. 별도 설치나 빌드가 필요 없습니다.

## 수정할 파일

- `index.html`: 이름, 소개, 경력, 논문 및 연락처
- `styles.css`: 색상, 글꼴, 반응형 화면
- `app.js`: iframe 삽입 모드
- `cv-jaewoo-jung.pdf`: CV
- `phd-thesis.pdf`: 박사논문
- `jaewoo-jung.jpg`: 프로필 사진
- `github-banner.svg`: GitHub README 배너
- `embed.html`: Google Sites 삽입 및 README 코드 생성 도구

프로필, 사진, CV와 논문은 기존 홈페이지 및 제공된 자료를 바탕으로 구성했습니다. 원본 CV 기준은 2026년 8월입니다. 파일 이름과 상대 경로를 유지하면 문서·이미지 링크가 계속 작동합니다. 외부 웹폰트를 불러올 수 없는 환경에서는 시스템 글꼴로 표시됩니다.

## Google Sites에 삽입

[삽입 코드 도구](https://jungjaewoo2020.github.io/embed.html)에 공개 홈페이지 주소를 넣고 **코드 만들기 → iframe 코드 복사**를 누릅니다. Google Sites의 **삽입 → 삽입 → 코드 삽입**에 붙여 넣습니다. `?embed=1`은 홈페이지의 상단 사이트명과 하단을 숨깁니다. 프레임 안에서 스크롤할 수 있습니다.

GitHub README는 iframe을 실행하지 않으므로 위의 배너 링크를 사용합니다. [GitHub Markdown 공식 규격](https://github.github.com/gfm/#disallowed-raw-html-extension-)

## 로컬 미리 보기

```sh
python3 -m http.server 8000
```

그다음 http://localhost:8000 을 엽니다.
