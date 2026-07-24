import nodemailer from 'nodemailer'

export const emailEnabled = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD)

let transporter = null
if (emailEnabled) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })
  console.log('Email notifications enabled.')
} else {
  console.log('Email notifications not configured — submissions still save, but no alert email will be sent.')
}

// Fire-and-forget — a failed notification email should never break the
// actual form submission, which has already been saved to the database
// by the time this is called.
export async function sendNotification({ subject, text }) {
  if (!emailEnabled) return
  const to = process.env.NOTIFY_EMAIL
  if (!to) return

  try {
    await transporter.sendMail({
      from: `"Website Notifications" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
    })
  } catch (err) {
    console.error('Failed to send notification email:', err.message)
  }
}
