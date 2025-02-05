const express = require('express');
const History = require('../models/historyMail');
const HR_Form = require('../models/hrDataModel');
const EmailFrom = require('../models/emailFormModel');
const { authenticateToken } = require('../authentication/auth');
const mongoose = require('mongoose');
require('dotenv').config();
const router = express.Router();
const axios = require('axios');


const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


router.post('/mail/send', authenticateToken, async (req, res) => {
    try {
        const { data, hr_id, form_id } = req.body;

        if (!data || !hr_id || !form_id) {
            return res.status(400).json({ success: false, message: 'Missing required fields.' });
        }

        console.log("Resume Data:", data);

        const objectHrId = new mongoose.Types.ObjectId(hr_id);
        const objectformId = new mongoose.Types.ObjectId(form_id);

        // Fetch HR details
        const hr = await HR_Form.findOne({ _id: objectHrId });
        if (!hr) {
            return res.status(404).json({ success: false, message: 'HR details not found.' });
        }

        console.log("HR Details:", hr);

        // Fetch Form Data
        const form_data = await EmailFrom.findOne({ _id: objectformId });
        if (!form_data) {
            return res.status(404).json({ success: false, message: 'Form data not found.' });
        }

        console.log("Form Data:", form_data);

        // Fetch Resume as PDF Buffer
        const response = await axios.get(data.resume, { responseType: 'arraybuffer' });
        const pdfBuffer = Buffer.from(response.data, 'binary');

        console.log("PDF Buffer Retrieved");

        // Send Email
        
        const msg = {
            to: hr.hrEmail, // Replace with recipient's email
            from: data.email, // Must be a verified sender email
            subject: 'Sending with Twilio SendGrid is Fun',
            text: form_data.formData,
            html: '<strong>and easy to do anywhere, even with Node.js</strong>',
            attachments: [
                {
                    content: pdfBuffer.toString('base64'),
                    filename: 'yourfile.pdf', // Change to your file name
                    type: 'application/pdf', // Change based on file type (e.g., 'image/png', 'text/plain')
                    disposition: 'attachment',
                },
            ],
        };
        (async () => {
            try {
                await sgMail.send(msg);
                console.log('Email sent successfully!');
            } catch (error) {
                console.error('Error sending email:', error);

                if (error.response) {
                    console.error(error.response.body);
                }
            }
        })();
        res.status(200).json({ success: true, message: 'Email sent successfully!' });

    } catch (err) {
        console.error('Error in /mail/send route:', err);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
    }
});

module.exports = router;
