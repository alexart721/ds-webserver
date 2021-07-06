require('dotenv').config();
import fs from 'fs';
import S3 from 'aws-sdk/clients/s3';

const bucketName = process.env.AWS_BUCKET_NAME as string;
const region = process.env.AWS_BUCKET_REGION as string;
const accessKeyId = process.env.AWS_ACCESS_KEY as string;
const secretAccessKey = process.env.AWS_SECRET_KEY as string;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey
});

// uploads a file to s3
function uploadFile(file: { path: string, filename: string }) {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename
  };

  return s3.upload(uploadParams).promise();
}


// downloads a file from s3
function getFileStream(fileKey: string) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName
  };

  return s3.getObject(downloadParams).createReadStream();
}

export default {
  uploadFile, getFileStream
};