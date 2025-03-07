const express = require('express');
const EmailFrom = require('../models/emailFormModel')
const { authenticateToken } = require('../authentication/auth');
require('dotenv').config();
const router = express.Router();



router.get('/email/formats', authenticateToken, async (req, res) => {
    try {
        const emailForm = await EmailFrom.find({ user_Id: req.user.id });
        console.log(emailForm)
        res.json(emailForm);
    } catch (err) {
        console.error('Error getting HR form:', err);
        res.status(500).json({ success: false, message: 'Error in getting HR form', error: err.message });
    }
});
router.post('/email/create', authenticateToken, async (req, res) => {
    try {
        const { formData } = req.body;
        const user_Id = req.user.id;
        console.log("-------------",formData)
        const newEmailForm = new EmailFrom({ user_Id, formData });
        await newEmailForm.save();
        res.json(newEmailForm);
    } catch (err) {
        console.error('Error creating HR form:', err);
        res.status(500).json({ success: false, message: 'Error in creating HR form', error: err.message });


    }
});

router.put('/email/update/:id', authenticateToken, async (req, res) => {
    try {
        const { formData } = req.body;
        const user_Id = req.user.id;
        const id = req.params.id;
        await EmailFrom.findByIdAndUpdate(id, { user_Id, formData: formData }, { new: true });
        res.json({ success: true, message: 'HR form updated successfully' });
    } catch (err) {
        console.error('Error updating HR form:', err);
        res.status(500).json({ success: false, message: 'Error in updating HR form', error: err.message });
    }


});
router.delete('/email/delete/:id', authenticateToken, async (req, res) => {

    try {
        const id = req.params.id;
        await EmailFrom.findByIdAndDelete(id);
        res.json({ success: true, message: 'HR form deleted successfully' });
    } catch (err) {
        console.error('Error deleting HR form:', err);
        res.status(500).json({ success: false, message: 'Error in deleting HR form', error: err.message });
    }




});


module.exports = router;




