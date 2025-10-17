import nodemailer from 'nodemailer'
import logger from './logger'

const SMTP_HOST = process.env.SMTP_HOST || ''
const SMTP_PORT = Number(process.env.SMTP_PORT || 587)
const SMTP_USER = process.env.SMTP_USER || ''
const SMTP_PASS = process.env.SMTP_PASS || ''
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@ai-hiring-suite.local'

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined
})

export async function sendMail(opts: { to: string | string[]; subject: string; text?: string; html?: string }) {
  const { to, subject, text, html } = opts
  const mail = {
    from: FROM_EMAIL,
    to,
    subject,
    text,
    html
  }
  try {
    const info = await transporter.sendMail(mail)
    logger.info({ msg: 'mail sent', to, subject, id: info.messageId })
    return info
  } catch (e) {
    logger.error({ msg: 'mail send failed', err: e })
    throw e
  }
}
