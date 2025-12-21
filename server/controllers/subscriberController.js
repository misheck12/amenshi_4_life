const Subscriber = require('../models/Subscriber');
const Settings = require('../models/Settings');
const nodemailer = require('nodemailer');

const createTransporter = async () => {
    const settings = await Settings.findOne();
    
    const host = settings?.smtpHost || process.env.EMAIL_HOST;
    const port = settings?.smtpPort || process.env.EMAIL_PORT;
    const user = settings?.smtpUser || process.env.EMAIL_USER;
    const pass = settings?.smtpPassword || process.env.EMAIL_PASSWORD;
  
    return {
      transporter: nodemailer.createTransporter({
        host,
        port,
        secure: port === 465, // true for 465, false for other ports
        auth: { user, pass }
      }),
      fromEmail: settings?.smtpFromEmail || process.env.EMAIL_FROM,
      adminEmail: user || process.env.EMAIL_USER
    };
  };

// @desc    Subscribe to newsletter
// @route   POST /api/subscribers
// @access  Public
exports.subscribe = async (req, res, next) => {
    try {
        const { email, source } = req.body;

        // Check if already exists
        let subscriber = await Subscriber.findOne({ email });

        if (subscriber) {
            subscriber.active = true;
            await subscriber.save();
        } else {
            subscriber = await Subscriber.create({ email, source });
        }

        res.status(201).json({
            success: true,
            message: 'Successfully subscribed to newsletter!',
            data: subscriber
        });
    } catch (error) {
        // Handle duplicate key error strictly if race condition
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Email already subscribed' });
        }
        next(error);
    }
};

// @desc    Unsubscribe
// @route   POST /api/subscribers/unsubscribe
// @access  Public
exports.unsubscribe = async (req, res, next) => {
    try {
        const { email } = req.body;
        
        const subscriber = await Subscriber.findOne({ email });
        
        if (subscriber) {
            subscriber.active = false;
            await subscriber.save();
        }

        res.status(200).json({
            success: true,
            message: 'Successfully unsubscribed.'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all subscribers
// @route   GET /api/subscribers
// @access  Private (Admin)
exports.getSubscribers = async (req, res, next) => {
    try {
        const subscribers = await Subscriber.find().sort('-createdAt');
        res.status(200).json({
            success: true,
            count: subscribers.length,
            data: subscribers
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Send broadcast email
// @route   POST /api/subscribers/broadcast
// @access  Private (Admin)
exports.sendBroadcast = async (req, res, next) => {
    try {
        const { subject, message } = req.body;
        
        // Get active subscribers
        const subscribers = await Subscriber.find({ active: true });
        
        if (subscribers.length === 0) {
            return res.status(400).json({ success: false, message: 'No active subscribers found' });
        }

        const { transporter, fromEmail } = await createTransporter();
        
        // Send emails
        // Ideally should use a queue, but doing simple loop for now
        let sentCount = 0;
        let failedCount = 0;

        // Send in parallel batches or sequential? Sequential is safer for rate limits without a queue system.
        for (const sub of subscribers) {
            try {
                await transporter.sendMail({
                    from: `Amenshi 4 Life <${fromEmail}>`,
                    to: sub.email,
                    subject: subject,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            ${message}
                            <hr style="margin-top: 30px; border: 0; border-top: 1px solid #eee;">
                            <p style="font-size: 12px; color: #888; text-align: center;">
                                You received this email because you subscribed to Amenshi 4 Life updates.
                                <br>
                                <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/unsubscribe?email=${sub.email}" style="color: #666;">Unsubscribe</a>
                            </p>
                        </div>
                    `
                });
                sentCount++;
            } catch (err) {
                console.error(`Failed to send to ${sub.email}:`, err);
                failedCount++;
            }
        }

        res.status(200).json({
            success: true,
            message: `Broadcast sent to ${sentCount} subscribers. Failed: ${failedCount}.`
        });
    } catch (error) {
        next(error);
    }
};
