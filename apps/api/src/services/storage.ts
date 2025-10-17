import AWS from 'aws-sdk'
import crypto from 'crypto'
import logger from './logger'
import fs from 'fs'
import path from 'path'

const DRIVER = process.env.STORAGE_DRIVER || 'local' // 's3' or 'local'
const BUCKET = process.env.S3_BUCKET || 'ai-hiring-assets'
const S3_ENDPOINT = process.env.S3_ENDPOINT || process.env.MINIO_ENDPOINT || undefined
const REGION = process.env.S3_REGION || 'us-east-1'
const ACCESS_KEY = process.env.S3_ACCESS_KEY || process.env.AWS_ACCESS_KEY_ID || ''
const SECRET_KEY = process.env.S3_SECRET_KEY || process.env.AWS_SECRET_ACCESS_KEY || ''

let s3: AWS.S3 | null = null

if (DRIVER === 's3') {
  const cfg: AWS.S3.Types.ClientConfiguration = { region: REGION }
  if (S3_ENDPOINT) {
    cfg.endpoint = S3_ENDPOINT
    cfg.s3ForcePathStyle = true
  }
  s3 = new AWS.S3({
    ...cfg,
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY
  })
}

const LOCAL_STORAGE_DIR = path.resolve(process.cwd(), '../../storage')

export async function putBuffer(buf: Buffer, contentType: string, prefix = 'uploads') {
  if (DRIVER === 's3' && s3) {
    const key = `${prefix}/${Date.now()}-${crypto.randomBytes(6).toString('hex')}`
    await s3.putObject({
      Bucket: BUCKET,
      Key: key,
      Body: buf,
      ContentType: contentType
    }).promise()
    const url = `s3://${BUCKET}/${key}`
    logger.info({ msg: 'stored object', url })
    return url
  } else {
    // local fallback
    await fs.promises.mkdir(path.join(LOCAL_STORAGE_DIR, prefix), { recursive: true })
    const filename = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`
    const out = path.join(LOCAL_STORAGE_DIR, prefix, filename)
    await fs.promises.writeFile(out, buf)
    logger.info({ msg: 'stored local file', path: out })
    return out
  }
}

export async function deleteByUrl(urlOrPath: string) {
  if (urlOrPath.startsWith('s3://') && s3) {
    const parts = urlOrPath.replace('s3://', '').split('/')
    const bucket = parts.shift()!
    const key = parts.join('/')
    await s3.deleteObject({ Bucket: bucket, Key: key }).promise()
    logger.info({ msg: 'deleted s3 object', key })
    return true
  } else {
    try {
      await fs.promises.unlink(urlOrPath)
      logger.info({ msg: 'deleted local file', path: urlOrPath })
      return true
    } catch (e) {
      logger.warn({ msg: 'delete failed', err: e })
      return false
    }
  }
}
