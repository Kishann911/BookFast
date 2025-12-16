import nodemailer from 'nodemailer';

// Email templates
const templates = {
    welcome: (data) => `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
                .footer { text-align: center; margin-top: 30px; color: #777; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to BookFast!</h1>
                </div>
                <div class="content">
                    <h2>Hello ${data.name}!</h2>
                    <p>Thank you for joining BookFast, your real-time resource booking solution.</p>
                    <p>With BookFast, you can:</p>
                    <ul>
                        <li>Book resources in real-time with instant confirmation</li>
                        <li>Avoid booking conflicts with our advanced conflict detection</li>
                        <li>Manage all your bookings in one place</li>
                        <li>Receive notifications for all booking activities</li>
                    </ul>
                    <p>Get started by exploring our available resources!</p>
                    <a href="${process.env.CLIENT_URL}/resources" class="button">Browse Resources</a>
                </div>
                <div class="footer">
                    <p>© ${new Date().getFullYear()} BookFast. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `,

    bookingConfirmation: (data) => `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #1DE9B6 0%, #22C55E 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1DE9B6; }
                .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
                .button { display: inline-block; padding: 12px 30px; background: #1DE9B6; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
                .footer { text-align: center; margin-top: 30px; color: #777; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>✅ Booking Confirmed!</h1>
                </div>
                <div class="content">
                    <h2>Hello ${data.userName}!</h2>
                    <p>Your booking has been successfully confirmed. Here are the details:</p>
                    
                    <div class="booking-details">
                        <div class="detail-row">
                            <strong>Resource:</strong>
                            <span>${data.resourceName}</span>
                        </div>
                        <div class="detail-row">
                            <strong>Start Time:</strong>
                            <span>${data.startTime}</span>
                        </div>
                        <div class="detail-row">
                            <strong>End Time:</strong>
                            <span>${data.endTime}</span>
                        </div>
                        <div class="detail-row">
                            <strong>Booking ID:</strong>
                            <span>${data.bookingId}</span>
                        </div>
                    </div>
                    
                    <p>You can view or manage this booking from your dashboard.</p>
                    <a href="${process.env.CLIENT_URL}/my-bookings" class="button">View My Bookings</a>
                </div>
                <div class="footer">
                    <p>© ${new Date().getFullYear()} BookFast. All rights reserved.</p>
                    <p>Need help? Contact us at support@bookfast.com</p>
                </div>
            </div>
        </body>
        </html>
    `,

    bookingCancellation: (data) => `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #EF4444; }
                .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
                .footer { text-align: center; margin-top: 30px; color: #777; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>❌ Booking Cancelled</h1>
                </div>
                <div class="content">
                    <h2>Hello ${data.userName}!</h2>
                    <p>Your booking has been cancelled.</p>
                    
                    <div class="booking-details">
                        <p><strong>Resource:</strong> ${data.resourceName}</p>
                        <p><strong>Start Time:</strong> ${data.startTime}</p>
                        <p><strong>Booking ID:</strong> ${data.bookingId}</p>
                    </div>
                    
                    <p>If you didn't cancel this booking, please contact support immediately.</p>
                    <a href="${process.env.CLIENT_URL}/resources" class="button">Book Another Resource</a>
                </div>
                <div class="footer">
                    <p>© ${new Date().getFullYear()} BookFast. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `,

    passwordReset: (data) => `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .button { display: inline-block; padding: 12px 30px; background: #3B82F6; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
                .warning { background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin: 20px 0; border-radius: 5px; }
                .footer { text-align: center; margin-top: 30px; color: #777; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔐 Password Reset Request</h1>
                </div>
                <div class="content">
                    <h2>Hello ${data.name}!</h2>
                    <p>We received a request to reset your password. Click the button below to reset it:</p>
                    
                    <a href="${data.resetUrl}" class="button">Reset Password</a>
                    
                    <div class="warning">
                        <strong>⚠️ Important:</strong> This link will expire in 10 minutes.
                    </div>
                    
                    <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
                    <p style="color: #777; font-size: 12px; margin-top: 30px;">
                        If the button doesn't work, copy and paste this URL into your browser:<br>
                        ${data.resetUrl}
                    </p>
                </div>
                <div class="footer">
                    <p>© ${new Date().getFullYear()} BookFast. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `
};

// Create reusable transporter
const createTransporter = () => {
    // Use different transport based on environment
    if (process.env.NODE_ENV === 'production') {
        // Production: Use real SMTP service (e.g., SendGrid, Mailgun, AWS SES)
        return nodemailer.createTransporter({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        });
    } else {
        // Development: Use Ethereal (fake SMTP for testing)
        // In production, replace with real SMTP credentials
        return nodemailer.createTransporter({
            host: process.env.SMTP_HOST || 'smtp.ethereal.email',
            port: process.env.SMTP_PORT || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER || 'test@ethereal.email',
                pass: process.env.SMTP_PASSWORD || 'testpassword'
            }
        });
    }
};

/**
 * Send email using templates
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.template - Template name (welcome, bookingConfirmation, etc.)
 * @param {Object} options.data - Data to populate template
 */
export const sendEmail = async ({ to, subject, template, data }) => {
    try {
        const transporter = createTransporter();

        // Get HTML content from template
        const htmlContent = templates[template]
            ? templates[template](data)
            : `<p>${data.message || 'No content'}</p>`;

        const mailOptions = {
            from: `BookFast <${process.env.EMAIL_FROM || 'noreply@bookfast.com'}>`,
            to,
            subject,
            html: htmlContent
        };

        const info = await transporter.sendMail(mailOptions);

        console.log('Email sent:', info.messageId);

        // Log preview URL for development (Ethereal only)
        if (process.env.NODE_ENV !== 'production') {
            console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
        }

        return info;
    } catch (error) {
        console.error('Email sending error:', error);
        throw new Error('Failed to send email');
    }
};

/**
 * Send custom email (without template)
 * @param {Object} options - Email options
 */
export const sendCustomEmail = async ({ to, subject, html, text }) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `BookFast <${process.env.EMAIL_FROM || 'noreply@bookfast.com'}>`,
            to,
            subject,
            html,
            text
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Custom email sent:', info.messageId);

        return info;
    } catch (error) {
        console.error('Custom email error:', error);
        throw new Error('Failed to send custom email');
    }
};

export default { sendEmail, sendCustomEmail };
