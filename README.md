# aws-s3-lambda-image-resizer

[English](./README.md) / [한국어](./README_ko.md) / [블로그 게시물](https://hongkim.dev/image-load-optimize/)

This Lambda function is triggered by requests to an S3 Object Lambda Access Point. It retrieves an image from the specified S3 bucket, resizes it based on query parameters, and returns the modified image as a response.

## Features

- **Dynamic Image Resizing**:

  Resizes images on-the-fly based on specified query parameters (`w` for width, `h` for height) without modifying the original image stored in S3.

- **Quality Adjustment**:

  Allows dynamic adjustment of image quality through the `q` query parameter, which accepts values between 1 and 100. If unspecified, a default quality level is used (configurable via environment variables).

## Example Request (query)

To test the resizing functionality with specific dimensions and quality, you can call the Lambda function through the CloudFront URL. The following is an example request:

```bash
# Call the Lambda function through the CloudFront URL.
# The 'w', 'h', and 'q' query parameters specify the desired width, height, and quality of the image, respectively.

https://your-cloudfront-url.com/path/to/image?w=200&h=200&q=80
```

This request resizes the image stored in the S3 bucket to 200x200 pixels with 80% quality, delivering the result via CloudFront.

### Parameter Behavior

- **Width (`w`) and Height (`h`)**:

  The `w` and `h` query parameters control the width and height of the resized image. If one of these values is provided, the image resizes based on the specified dimension, preserving the original aspect ratio if only one of `w` or `h` is set.

- **Quality (`q`)**:

  The `q` parameter adjusts the quality level of the image (range: 1–100). If `q` is not specified, the function applies a default quality setting as defined by the environment variable (`DEFAULT_QUALITY`). This allows flexible quality adjustments per request without modifying the stored image.

- **No Parameters Provided**:

  If `w`, `h`, and `q` are all omitted, the function returns the original image without any transformations. This ensures that images are only processed when necessary, preserving original data and minimizing processing time.

These configurations allow for dynamic resizing, quality adjustment in delivering images.

## Prerequisites

Before getting started, ensure you have the following:

1. **S3 Object Lambda Setup**:

   You need an S3 bucket and an S3 Object Lambda configured. This includes creating an S3 Object Lambda function and integrating it with your S3 bucket to allow image resizing on the fly.

2. **Node.js 20.x Runtime**:

   This Lambda function is designed to run in an AWS environment that uses the Node.js 20.x runtime. Make sure your AWS Lambda function is configured to use the Node.js 20.x runtime environment.

## Getting Started

### Step 1: Clone this repository

First, you'll need to clone the repository to your local machine:

```bash
# Clone the repository to your local machine using the git command
git clone https://github.com/JiHongKim98/aws-s3-lambda-image-resizer.git

# Navigate to the repository directory to begin working
cd aws-s3-lambda-image-resizer
```

This will download the code to your local machine so you can start working on it.

### Step 2: Install dependencies

Next, install the required dependencies for the Lambda function. These include `sharp` for image processing and `axios` for making HTTP requests.

Use the following command to install the necessary packages, specifying the architecture and platform for AWS Lambda:

```bash
# Install the required dependencies for the Lambda function in the AWS Lambda environment.
# 'sharp' is used for image processing, and 'axios' is used for making HTTP requests.
# The --arch, --platform, and --target options ensure compatibility with the AWS Lambda environment.
npm install --arch=x64 --platform=linux --target=20.x sharp axios
```

This ensures that the sharp library is properly configured to run in the AWS Lambda environment (which runs on Amazon Linux).

### Step 3: Package the lambda function

Once you have installed the dependencies, you need to package the code and libraries into a zip file to be deployed to AWS Lambda. The following command will zip up your source code and dependencies:

```bash
# Package the source code and dependencies into a zip file for deployment to AWS Lambda.
# This command will create the 'function.zip' file, which contains everything needed for the Lambda function to run.
npm run package
```

This will create a file called `function.zip` that contains everything required for the Lambda function to execute. You can now upload this zip file to your AWS Lambda function.
