const Settings = require('../models/Settings');
const nodemailer = require('nodemailer');

// @desc    Get system settings
// @route   GET /api/settings
// @access  Private (Admin)
exports.getSettings = async (req, res, next) => {
    try {
        let settings = await Settings.findOne();
        
        if (!settings) {
            settings = await Settings.create({});
        }

        // Return settings but obfuscate password if it exists
        const settingsObj = settings.toObject();
        if (settingsObj.smtpPassword) {
            settingsObj.smtpPassword = '********'; // Do not send actual password back to client
        }

        res.status(200).json({
            success: true,
            data: settingsObj
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update system settings
// @route   PUT /api/settings
// @access  Private (Admin)
exports.updateSettings = async (req, res, next) => {
    try {
        let settings = await Settings.findOne();

        if (!settings) {
            settings = await Settings.create(req.body);
        } else {
            // Handle password update: if it's '********' or empty/undefined, don't update it
            if (req.body.smtpPassword === '********' || !req.body.smtpPassword) {
                delete req.body.smtpPassword;
            }
            
            settings = await Settings.findByIdAndUpdate(
                settings._id,
                req.body,
                { new: true, runValidators: true }
            );
        }

        res.status(200).json({
            success: true,
            data: settings
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Test SMTP connection
// @route   POST /api/settings/test-email
// @access  Private (Admin)
exports.testEmail = async (req, res, next) => {
    try {
        const { email } = req.body;
        // Fetch DB settings first
        const settings = await Settings.findOne();
        
        // Determine credentials: DB > Env
        const host = settings?.smtpHost || process.env.EMAIL_HOST;
        const port = settings?.smtpPort || process.env.EMAIL_PORT;
        const user = settings?.smtpUser || process.env.EMAIL_USER;
        const pass = settings?.smtpPassword || process.env.EMAIL_PASSWORD;
        const from = settings?.smtpFromEmail || process.env.EMAIL_FROM;

        if (!host || !user || !pass) {
            return res.status(400).json({
                success: false,
                message: 'SMTP settings are not fully configured.'
            });
        }

        const transporter = nodemailer.createTransporter({
            host,
            port,
            secure: port === 465, // true for 465, false for other ports
            auth: { user, pass }
        });

        // Verify connection
        await transporter.verify();

        // Send test email
        await transporter.sendMail({
            from: `Amenshi Test <${from}>`,
            to: email || user, // Send to provided email or the SMTP user
            subject: 'Amenshi 4 Life - SMTP Test',
            text: 'This is a test email to verify your SMTP settings are working correctly.',
            html: '<p>This is a <strong>test email</strong> to verify your SMTP settings are working correctly.</p>'
        });

        res.status(200).json({
            success: true,
            message: 'Connection successful and test email sent!'
        });
    } catch (error) {
        console.error('SMTP Test Error:', error);
        res.status(500).json({
            success: false,
            message: `Test failed: ${error.message}`
        });
    }
};
