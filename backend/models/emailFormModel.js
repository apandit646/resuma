const mongoose = require('mongoose');

const emailFromSchema = new mongoose.Schema(
  {
    user_Id: { type: String, required: true },
    formData: { type: String, required: true }
  },
  { timestamps: true }
);

const EmailFrom = mongoose.model('EmainForm', emailFromSchema);

module.exports = EmailFrom;
