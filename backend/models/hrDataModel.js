const mongoose = require('mongoose');

const hrDataSchema = new mongoose.Schema(
  {
    user_Id: { type: String ,required: true},
    companyName: { type: String, required: true}, // Corrected type
    hrName: { type: String ,required: true}, // Fixed syntax
    hrEmail: { type: String,required: true }, // Fixed syntax
    phone: { type: String }, // You can add validation if needed
  },
  { timestamps: true } // Moved outside the object
);

const HR_Form = mongoose.model('HR_Form', hrDataSchema);

module.exports = HR_Form;
