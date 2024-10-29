const {
  S3Client,
  WriteGetObjectResponseCommand,
} = require("@aws-sdk/client-s3");
const axios = require("axios");
const sharp = require("sharp");

const s3 = new S3Client();

exports.handler = async (event) => {
  const { outputRoute, outputToken, inputS3Url } = event.getObjectContext;

  const userRequestUrl = event.userRequest.url;
  const queryParams = new URLSearchParams(new URL(userRequestUrl).search);

  try {
    const { data, headers } = await fetchImage(inputS3Url);
    const originContentType = headers["content-type"] || "image/webp";

    const transformedImage = await processResize(data, queryParams);

    await sendResponse(
      transformedImage,
      originContentType,
      outputRoute,
      outputToken
    );
  } catch (err) {
    logError("An error occurred while processing the image", err);
    return {
      statusCode: 500,
      body: "Image processing failed",
    };
  }
};

const fetchImage = async (url) => {
  try {
    return await axios.get(url, { responseType: "arraybuffer" });
  } catch (err) {
    throw new Error(`Failed to fetch image from S3: ${err.message}`);
  }
};

const processResize = async (originImage, queryParams) => {
  const image = sharp(originImage);
  const { format } = await image.metadata();

  const width = parseInt(queryParams.get("w")) || null;
  const height = parseInt(queryParams.get("h")) || null;
  const quality = parseInt(queryParams.get("q")) || null;

  if (!width && !height && !quality) return originImage;

  return await formatImage(image, format, width, height, quality);
};

const formatImage = async (image, format, width, height, quality) => {
  quality = clamp(quality, 1, 100);

  switch (format) {
    case "jpeg":
      return await image.resize(width, height).jpeg({ quality }).toBuffer();
    case "png":
      return await image.resize(width, height).png({ quality }).toBuffer();
    case "webp":
      return await image.resize(width, height).webp({ quality }).toBuffer();
    default:
      return await image.resize(width, height).toBuffer();
  }
};

const sendResponse = async (body, contentType, requestRoute, requestToken) => {
  try {
    const writeResponseParams = {
      RequestRoute: requestRoute,
      RequestToken: requestToken,
      Body: body,
      StatusCode: 200,
      Headers: { "Content-Type": contentType },
    };
    await s3.send(new WriteGetObjectResponseCommand(writeResponseParams));
  } catch (err) {
    throw new Error(`Failed to send response: ${err.message}`);
  }
};

const clamp = (value, min, max) => {
  if (!value) return 85;
  return Math.max(min, Math.min(value, max));
};

const logError = (message, err) => {
  console.error(`\n| >> MESSAGE: ${message}\n| >> ERROR_DETAILS: ${err}`);
};
