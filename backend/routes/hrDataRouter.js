const express = require('express');
const HR_Form = require('../models/hrDataModel');
const { authenticateToken } = require('../authentication/auth');
require('dotenv').config();
const router = express.Router();


router.get('/hr/form', authenticateToken, async (req, res) => {
    try {
        const user = req.user
        console.log(user)
        const emailForm = await HR_Form.find({ user_Id: req.user.id });
        res.json(emailForm);
    } catch (err) {
        console.error('Error getting HR form:', err);
        res.status(500).json({ success: false, message: 'Error in getting HR form', error: err.message });
    }


});
router.post('/hr/create', authenticateToken, async (req, res) => {
    try {
       const  {formData} = req.body;
        const user_Id = req.user.id;
        const newHRForm = new HR_Form({ 
            user_Id, 
            companyName:formData.companyName, // Corrected type
            hrName: formData.hrName, // Fixed syntax
            hrEmail:formData.hrEmail, // Fixed syntax
            phone:formData.phone, // Fixed });

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
        const user_Id = req.user.id;
        const id = req.params.id;
        await HR_Form.findByIdAndUpdate(id, { user_Id, formData: formData }, { new: true });
        res.json({ success: true, message: 'HR form updated successfully' });
    } catch (err) {
        console.error('Error updating HR form:', err);
        res.status(500).json({ success: false, message: 'Error in updating HR form', error: err.message });
    }


});
router.delete('/hr/delete/:id', authenticateToken, async (req, res) => {

    try {
        const id = req.params.id;
        console.log('delete', id);
        await HR_Form.findByIdAndDelete(id);
        res.json({ success: true, message: 'HR form deleted successfully' });
    } catch (err) {
        console.error('Error deleting HR form:', err);
        res.status(500).json({ success: false, message: 'Error in deleting HR form', error: err.message });
    }




});


module.exports = router;