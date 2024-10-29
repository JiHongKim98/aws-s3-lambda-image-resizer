const {
  S3Client,
  WriteGetObjectResponseCommand,
} = require("@aws-sdk/client-s3");
const axios = require("axios");
const sharp = require("sharp");

const s3 = new S3Client();

exports.handler = async (event) => {
  const getObjectContext = event.getObjectContext;
  const requestRoute = getObjectContext.outputRoute;
  const requestToken = getObjectContext.outputToken;
  const inputS3Url = getObjectContext.inputS3Url;

  let originalImage;
  let originContentsType;
  try {
    const response = await axios.get(inputS3Url, {
      responseType: "arraybuffer",
    });
    originalImage = response.data;
    originContentsType = response.headers["content-type"] || "image/webp";
  } catch (err) {
    console.error(
      `\n| >> MESSAGE: S3로 부터 원본 이미지를 가져오는데 실패함\n| >> REQUEST_URL: ${inputS3Url}\n| >> ERROR_DETAILS: ${err}`
    );
    return {
      statusCode: 500,
      body: "Failed to fetch image from S3",
    };
  }

  const userRequestUrl = event.userRequest.url;
  const url = new URL(userRequestUrl);
  const queryParams = new URLSearchParams(url.search);

  let transformedImage;
  try {
    const image = sharp(originalImage);

    const metadata = await image.metadata();
    const format = metadata.format;

    const width = parseInt(queryParams.get("w")) || null;
    const height = parseInt(queryParams.get("h")) || null;
    const quality = Math.max(
      1,
      Math.min(parseInt(queryParams.get("q")) || 85, 100)
    );

    const formatHandlers = {
      png: (width, height, quality) =>
        image.resize(width, height).png({ quality }).toBuffer(),
      jpeg: (width, height, quality) =>
        image.resize(width, height).jpeg({ quality }).toBuffer(),
      webp: (width, height, quality) =>
        image.resize(width, height).webp({ quality }).toBuffer(),
      default: (width, height) => image.resize(width, height).toBuffer(),
    };

    if (width || height || quality) {
      transformedImage = await (
        formatHandlers[format] || formatHandlers.default
      )(width, height, quality);
    } else {
      transformedImage = originalImage;
    }
  } catch (err) {
    console.error(
      `\n| >> MESSAGE: 이미지 리사이징 실패\n| >> ERROR_DETAILS: ${err}`
    );
    return {
      statusCode: 500,
      body: "Failed to resize image",
    };
  }

  try {
    const writeResponseParams = {
      RequestRoute: requestRoute,
      RequestToken: requestToken,
      Body: transformedImage,
      StatusCode: 200,
      Headers: {
        "Content-Type": originContentsType,
      },
    };
    const writeResponseCommand = new WriteGetObjectResponseCommand(
      writeResponseParams
    );
    await s3.send(writeResponseCommand);
  } catch (err) {
    console.error(
      `\n| >> MESSAGE: 리사이징된 이미지 응답을 보내는 중 오류 발생\n| >> ERROR_DETAILS: ${err}`
    );
    return {
      statusCode: 500,
      body: "Failed to send resized image response",
    };
  }
};
