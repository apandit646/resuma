const mongoose = require('mongoose');

const hrDataSchema = new mongoose.Schema(
  {
    user_id: { type: 'string', required: true},
    companyName: { type: String }, // Corrected type
    hrName: { type: String }, // Fixed syntax
    hrEmail: { type: String }, // Fixed syntax
    phone: { type: String }, // You can add validation if needed
  },
  { timestamps: true } // Moved outside the object
);

const HR_Form = mongoose.model('HR_Form', hrDataSchema);

module.exports = HR_Form;
