const express = require('express');
const History = require('../models/historyMail');
const HR_Form = require('../models/hrDataModel');
const EmailFrom = require('../models/emailFormModel')
const { authenticateToken } = require('../authentication/auth');
const mongoose = require('mongoose');
require('dotenv').config();
const router = express.Router();
const axios = require('axios');
const supabase = require('../common/supabaseClient');





router.post('/mail/send', authenticateToken, async (req, res) => {
    try {
        const { data, hr_id, form_id } = req.body;
        console.log("hrrrrrrrrrrrrrr", hr_id);
        console.log("fommain", form_id);
        console.log("resum_data", data);
        const objectHrId = new mongoose.Types.ObjectId(hr_id);// hr mail coverted in object
        const objectformId = new mongoose.Types.ObjectId(form_id);// from convered in boject
        // hr deail 
        const hr = await HR_Form.findOne({ _id: objectHrId });

        // // profile details
        const form_data = await EmailFrom.findOne({ _id: objectformId });
        console.log(data.resume);
        const response = await axios.get(data.resume, { responseType: 'arraybuffer' }); // Get binary data
        const pdfBuffer = Buffer.from(response.data, 'binary');
        console.log(pdfBuffer);

    } catch (err) {
        console.error('Error creating HR form:', err);
        res.status(500).json({ success: false, message: 'Error in creating HR form', error: err.message });
    }
});



module.exports = router;
