import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

/**
 * Cliente S3 configurado para Cloudflare R2.
 * Solo se usa del lado del servidor (API Routes).
 */
export const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export const R2_BUCKET = process.env.R2_BUCKET_NAME!;
export const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || "";

/**
 * Sube un archivo a R2 y retorna la URL publica.
 */
export async function uploadToR2(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  const key = `modelos/${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;

  await r2Client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
    })
  );

  return `${R2_PUBLIC_URL}/${key}`;
}

/**
 * Elimina un archivo de R2 dado su URL publica.
 */
export async function deleteFromR2(publicUrl: string): Promise<void> {
  if (!publicUrl || !R2_PUBLIC_URL) return;

  const key = publicUrl.replace(`${R2_PUBLIC_URL}/`, "");

  try {
    await r2Client.send(
      new DeleteObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
      })
    );
  } catch (error) {
    console.error("Error eliminando archivo de R2:", error);
  }
}
