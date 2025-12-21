const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

const Settings = require('../models/Settings');

// Create email transporter
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
      secure: port === 465,
      auth: { user, pass }
    }),
    fromEmail: settings?.smtpFromEmail || process.env.EMAIL_FROM,
    adminEmail: user || process.env.EMAIL_USER
  };
};

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
exports.submitContact = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    // Create contact message
    const contact = await Contact.create({
      name,
      email,
      message
    });

    // Send notification email to admin
    try {
      const { transporter, fromEmail, adminEmail } = await createTransporter();

      await transporter.sendMail({
        from: fromEmail,
        to: adminEmail,
        subject: `New Contact Form Submission from ${name}`,
        html: `
          <h2>New Contact Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
          <p><em>Received at: ${new Date().toLocaleString()}</em></p>
        `
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for your message. We will get back to you soon!',
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private
exports.getMessages = async (req, res, next) => {
  try {
    const messages = await Contact.find().sort('-createdAt');

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update message status
// @route   PUT /api/contact/:id
// @access  Private
exports.updateMessageStatus = async (req, res, next) => {
  try {
    const message = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, reply: req.body.reply },
      { new: true, runValidators: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // If replying, send email to user
    if (req.body.reply && req.body.status === 'replied') {
      try {
        const { transporter, fromEmail } = await createTransporter();

        await transporter.sendMail({
          from: fromEmail,
          to: message.email,
          subject: 'Re: Your message to Amenshi 4 Life',
          html: `
            <h2>Thank you for contacting Amenshi 4 Life</h2>
            <p>Dear ${message.name},</p>
            <p>${req.body.reply}</p>
            <br>
            <p><em>Your original message:</em></p>
            <p>${message.message}</p>
            <br>
            <p>Best regards,<br>Amenshi 4 Life Team</p>
          `
        });
      } catch (emailError) {
        console.error('Reply email failed:', emailError);
      }
    }

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete contact message
// @route   DELETE /api/contact/:id
// @access  Private
exports.deleteMessage = async (req, res, next) => {
  try {
    const message = await Contact.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
