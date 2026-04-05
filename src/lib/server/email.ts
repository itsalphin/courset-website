import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const FROM = process.env.EMAIL_FROM || 'COURSET <hello@courset.com>';

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[EMAIL] To: ${to} | Subject: ${subject}`);
    return;
  }

  await transporter.sendMail({ from: FROM, to, subject, html });
}

export async function sendPasswordResetEmail(to: string, token: string): Promise<void> {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;
  await sendEmail(to, 'Reset Your COURSET Password', `
    <div style="font-family: 'Helvetica Neue', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
      <h1 style="font-size: 24px; font-weight: 300; color: #1A1A1A; letter-spacing: 0.08em;">COURSET</h1>
      <hr style="border: none; border-top: 1px solid #E0E0E0; margin: 24px 0;" />
      <p style="color: #6B6B6B; font-size: 15px; line-height: 1.6;">
        You requested a password reset. Click the link below to set a new password.
        This link expires in 1 hour.
      </p>
      <a href="${resetUrl}" style="display: inline-block; background: #C9A96E; color: white; padding: 12px 32px; text-decoration: none; font-size: 13px; letter-spacing: 0.15em; text-transform: uppercase; margin: 20px 0;">
        Reset Password
      </a>
      <p style="color: #999; font-size: 13px; margin-top: 24px;">
        If you didn't request this, you can safely ignore this email.
        We will never ask for your password via email.
      </p>
    </div>
  `);
}

export async function sendLoginAlertEmail(to: string, ip: string, userAgent: string): Promise<void> {
  await sendEmail(to, 'New Login to Your COURSET Account', `
    <div style="font-family: 'Helvetica Neue', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
      <h1 style="font-size: 24px; font-weight: 300; color: #1A1A1A; letter-spacing: 0.08em;">COURSET</h1>
      <hr style="border: none; border-top: 1px solid #E0E0E0; margin: 24px 0;" />
      <p style="color: #6B6B6B; font-size: 15px; line-height: 1.6;">
        A new login was detected on your account.
      </p>
      <p style="color: #6B6B6B; font-size: 14px;">
        <strong>IP:</strong> ${ip}<br/>
        <strong>Device:</strong> ${userAgent.substring(0, 100)}<br/>
        <strong>Time:</strong> ${new Date().toISOString()}
      </p>
      <p style="color: #999; font-size: 13px; margin-top: 24px;">
        If this wasn't you, reset your password immediately.
      </p>
    </div>
  `);
}

export async function sendOrderConfirmationEmail(to: string, orderId: string, total: string): Promise<void> {
  await sendEmail(to, `COURSET Order Confirmed — ${orderId}`, `
    <div style="font-family: 'Helvetica Neue', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
      <h1 style="font-size: 24px; font-weight: 300; color: #1A1A1A; letter-spacing: 0.08em;">COURSET</h1>
      <hr style="border: none; border-top: 1px solid #E0E0E0; margin: 24px 0;" />
      <h2 style="font-size: 20px; font-weight: 400; color: #1A1A1A;">Your Commission Has Begun</h2>
      <p style="color: #6B6B6B; font-size: 15px; line-height: 1.6;">
        Thank you for your order. Our master jewelers are now reviewing your commission.
      </p>
      <p style="color: #1A1A1A; font-size: 16px;">
        <strong>Order:</strong> ${orderId}<br/>
        <strong>Total:</strong> ${total}
      </p>
      <p style="color: #999; font-size: 13px; margin-top: 24px;">
        You'll receive updates as your piece progresses. Questions? Contact our concierge team.
      </p>
    </div>
  `);
}

// DNS records needed for domain authentication:
// SPF: v=spf1 include:_spf.google.com ~all
// DKIM: Configure via your email provider
// DMARC: v=DMARC1; p=reject; rua=mailto:dmarc@courset.com
