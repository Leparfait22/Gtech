'use server'

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { createClient } from '@/utils/supabase/server'

// Setup R2 S3 Client
const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
})

export async function getPresignedUrl(fileName: string, contentType: string) {
  // Check auth
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    const bucketName = process.env.R2_BUCKET_NAME
    if (!bucketName) throw new Error('R2_BUCKET_NAME is not set')

    // Clean up filename and add random string to prevent overwrites
    const ext = fileName.split('.').pop()
    const safeName = fileName.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').substring(0, 20)
    const objectKey = `banners/${Date.now()}-${safeName}.${ext}`

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
      ContentType: contentType,
    })

    // URL expires in 15 minutes
    const signedUrl = await getSignedUrl(r2, command, { expiresIn: 900 })

    const publicDomain = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/$/, '') || ''
    const publicUrl = `${publicDomain}/${objectKey}`

    return { 
      success: true, 
      uploadUrl: signedUrl,
      publicUrl: publicUrl
    }
  } catch (error: any) {
    console.error('Error generating presigned URL:', error)
    return { success: false, error: error.message }
  }
}
