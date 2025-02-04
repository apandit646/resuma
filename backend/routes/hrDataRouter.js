const express = require('express');
const HR_Form = require('../models/hrDataModel');
const { authenticateToken } = require('../authentication/auth');
require('dotenv').config();
const router = express.Router();

router.get('/hr/form', authenticateToken, async (req, res) => {
    try {
        const user = req.user;
        console.log(user);
        const emailForm = await HR_Form.find({ user_Id: user.id });
        res.json(emailForm);
    } catch (err) {
        console.error('Error getting HR form:', err);
        res.status(500).json({ success: false, message: 'Error in getting HR form', error: err.message });
    }
});

router.post('/hr/create', authenticateToken, async (req, res) => {
    try {
        const { formData } = req.body;
        const user_Id = req.user.id;

        const newHRForm = new HR_Form({ 
            user_Id, 
            companyName: formData.companyName,
            hrName: formData.hrName,
            hrEmail: formData.hrEmail,
            phone: formData.phone
        });

        await newHRForm.save();
        res.json(newHRForm);
    } catch (err) {
        console.error('Error creating HR form:', err);
        res.status(500).json({ success: false, message: 'Error in creating HR form', error: err.message });
    }
});

router.put('/hr/update/:id', authenticateToken, async (req, res) => {
    try {
        const { formData } = req.body;
        const id = req.params.id;
        console.log(id, 'update', formData);
        const updatedHRForm = await HR_Form.findByIdAndUpdate(
            id, 
            { ...formData },  // Spread formData to update each field
            { new: true }
        );

        if (!updatedHRForm) {
            return res.status(404).json({ success: false, message: 'HR form not found' });
        }

        res.json({ success: true, message: 'HR form updated successfully', updatedHRForm });
    } catch (err) {
        console.error('Error updating HR form:', err);
        res.status(500).json({ success: false, message: 'Error in updating HR form', error: err.message });
    }
});

router.delete('/hr/delete/:id', authenticateToken, async (req, res) => {
    try {
        const id = req.params.id;
        console.log('Deleting HR form with ID:', id);

        const deletedHRForm = await HR_Form.findByIdAndDelete(id);

        if (!deletedHRForm) {
            return res.status(404).json({ success: false, message: 'HR form not found' });
        }

        res.json({ success: true, message: 'HR form deleted successfully' });
    } catch (err) {
        console.error('Error deleting HR form:', err);
        res.status(500).json({ success: false, message: 'Error in deleting HR form', error: err.message });
    }
});

module.exports = router;
