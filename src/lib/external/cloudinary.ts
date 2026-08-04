import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
}

export async function uploadImage(file: Buffer, folder: string = 'yembal/listings'): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
        quality: 'auto:best',
        transformation: [
          { width: 1200, height: 1200, crop: 'limit', quality: 'auto' },
        ],
      },
      (error, result) => {
        if (error || !result) reject(error || new Error('Cloudinary upload failed'));
        else
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
          });
      }
    );

    upload.end(file);
  });
}

export async function uploadMultipleImages(
  files: Buffer[],
  folder: string = 'yombal'
): Promise<UploadResult[]> {
  return Promise.all(files.map((file) => uploadImage(file, folder)));
}

export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return false;
  }
}

export async function uploadToCloudinary(file: File, folder: string = 'yombal'): Promise<string> {
  const buffer = await file.arrayBuffer();
  const result = await uploadImage(Buffer.from(buffer), folder);
  return result.url;
}

export function getOptimizedUrl(publicId: string, width?: number, height?: number): string {
  let url = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`;

  if (width || height) {
    const transforms = [];
    if (width) transforms.push(`w_${width}`);
    if (height) transforms.push(`h_${height}`);
    transforms.push('c_fill', 'q_auto');
    url += `/${transforms.join(',')}/`;
  } else {
    url += '/q_auto/';
  }

  url += publicId;
  return url;
}
