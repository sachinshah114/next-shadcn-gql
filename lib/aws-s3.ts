import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';

const s3 = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
    },
});

export async function uploadToS3(filePath: string, bucketName: string, key: string) {
    const fileStream = fs.createReadStream(filePath);

    const params = {
        Bucket: bucketName,
        Key: key,
        Body: fileStream,
        ContentType: 'image/png',
    };

    const command = new PutObjectCommand(params);
    const response = await s3.send(command);
    console.log('S3 Upload Success:', response);

    return {
        fileUrl: `https://${bucketName}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`,
        key,
    };
}