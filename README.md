# aws-s3-lambda-image-resizer

This Lambda function is triggered by a GET request to an S3 Object Lambda access point. It retrieves an image from the specified S3 bucket, resizes it based on query parameters, and returns the modified image as a response.

## Prerequisites

Before getting started, ensure you have the following:

1. **S3 Object Lambda Setup**: You need an S3 bucket and an S3 Object Lambda access point configured. This includes creating an S3 Object Lambda function and integrating it with your S3 bucket to allow image resizing on the fly.
2. **Node.js 20.x Runtime**: This Lambda function is designed to run in an AWS environment that uses the Node.js 20.x runtime. Make sure your AWS Lambda function is configured to use the Node.js 20.x runtime environment.

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

## Example Query

To test the resizing functionality with specific dimensions, you can call the Lambda function through the CloudFront URL. The following is an example request:

```bash
# Call the Lambda function through the CloudFront URL.
# The 'w' and 'h' query parameters specify the desired width and height of the image, respectively.
# CloudFront caches and delivers resized images efficiently.
https://your-cloudfront-url.com/image.jpg?w=100&h=100
```

This will resize the image stored in the S3 bucket to 100x100 pixels, and the result will be delivered via CloudFront.
