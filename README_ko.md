# aws-s3-lambda-image-resizer

[English Docs](./README.md) / [한국어 문서](./README_ko.md) / <a href="https://h0ng.dev/image-load-optimize/#S3-Object-Lambda를-통한-이미지-리사이징-적용">적용 방법 (h0ng.dev)</a>

위 리포지토리에서 구현된 Lambda Function는 S3 Object Lambda Access Point에 의해 트리거되고, 지정된 S3 Bucket에서 원본 이미지를 가져와 쿼리 파라미터에 따라 크기 및 화질이 조정된 이미지를 반환한다.

## Features

- 동적 이미지 사이즈 조정:

  쿼리 파라미터(`w`: 너비, `h`: 높이)를 사용하여 S3에 저장된 원본 이미지를 수정하지 않고도 동적으로 이미지 크기를 조정할 수 있다.

- 화질 조정:

  `q` 쿼리 파라미터를 통해 이미지 화질을 동적으로 조정할 수 있다. `q`는 1부터 100사이의 값을 사용하고, 지정하지 않을 경우 기본 화질 수준(`.env` 파일 확인)이 사용된다.

## Example Request (query)

CloudFront를 통해 해당 이미지 크기 및 화질 조정 기능을 테스트할 수 있다. 아래의 예시 참고:

```bash
# 이미지의 너비, 높이, 화질을 'w', 'h' 'q' 쿼리 파라미터에 포함하여
# CloudFront URL을 입력해 Lambda Function을 호출한다.

https://your-cloudfront-url.com/path/to/image?w=200&h=200&q=80
```

위 예시를 통해, S3 버킷에 저장된 원본 이미지를 200x200 픽셀 및 화질 80%로 조정된 이미지를 확인할 수 있다.

### Parameter Behavior

- **너비 (`w`) 및 높이 (`h`)**:

  `w` 및 `h` 파라미터로 이미지의 너비와 높이를 제어할 수 있다. 이 두개의 값 중 하나만 제공되는 경우, 지정된 차원(너비 or 높이)을 기준으로 원본 비율을 유지하여 크기가 조정된다.

- **화질 (`q`)**:

  `q` 파라미터는 이미지의 화질 수준을 1부터 100사이의 값으로 조정하며, 지정하지 않은 경우 환경변수 (`DEFAULT_QUALITY`)로 설정된 기본 화질이 적용된다.

- **쿼리 파라미터 미지정시**:

  `w`, `h`, `q`가 모두 생략된 경우, 원본 이미지를 그대로 반환하며 이미지 변환이 이루어지지 않는다. 즉, 필요할 때만 이미지를 처리하도록 지정할 수 있다.

위 파라미터들의 기능을 통해 동적으로 이미지 크기 조절 및 화질 조정이 가능하다.

## Prerequisites

시작하기 전, 아래 2가지를 사항을 확인하자:

1. **S3 Object Lambda 설정**:

   S3 Bucket 및 S3 Object Lambda Function에 대한 설정이 되어 있어야 한다.<br>
   (설정하지 않았다면, <a href="https://h0ng.dev/image-load-optimize/#S3-Object-Lambda를-통한-이미지-리사이징-적용">적용 방법 (h0ng.dev)</a> 참고)

2. **Node.js 20.x 환경**:

   해당 Lambda Function은 Node.js 20.x 환경에서 실행되도록 구현되어 있어, AWS Lambda Function의 환경을 꼭 Node.js 20.x 으로 설정해야 한다.

## Getting Started

### Step 1: Clone this repository

먼저, 로컬 환경에서의 원활한 작업을 위해 리포지토리를 clone 하자:

```bash
# git 명령어를 사용하여 리포지토리 clone
git clone https://github.com/JiHongKim98/aws-s3-lambda-image-resizer.git

# 그다음, 작업을 시작하기 위해 저장소 디렉토리로 이동한다.
cd aws-s3-lambda-image-resizer
```

위 명령어를 통해 로컬 환경에서 작업을 할 수 있다.

### Step 2: Install dependencies

이제, Lambda Function에 필요한 의존성을 설치해야 한다. 이미지 처리에 사용되는 `sharp` 라이브러리와 HTTP 요청을 위한 `axios`에 대한 의존성을 설치한다.

아래의 명령어를 통해 필요한 패키지를 설치해보자:

```bash
# AWS Lambda 환경에서 Lambda Function을 실행하는 데 필요한 의존성을 설치
# 'sharp'은 이미지 처리를 위해 사용되고, 'axios'는 HTTP 요청에 사용된다.
# --arch, --platform, --target 옵션으로 AWS Lambda 환경과의 호환성을 보장해야 한다.
npm install --arch=x64 --platform=linux --target=20.x sharp axios
```

위 명령어를 통해, AWS Lambda 환경(Amazon Linux)에서 라이브러리가 제대로 작동하도록 설정할 수 있다.

### Step 3: Package the lambda function

의존성 설치 후, zip 파일로 패키징해 AWS Lambda로 배포할 수 있다. 아래의 명령어를 통해 코드와 의존성을 압축하면 된다:

```bash
# Lambda Function의 코드와 의존성을 `.zip` 파일로 패키징하여 AWS Lambda에 배포할 수 있다.
# 아래 명령어는 Lambda Function 실행에 필요한 모든 내용을 포함한 'function.zip' 파일을 생성한다.
npm run package
```

위 명령어를 통해 Lambda Function 실행에 필요한 모든 파일이 포함된 `function.zip` 파일을 생성할 수 있다. 이제 해당 zip 파일을 AWS Lambda Function에 업로드하여 사용할 수 있다.
