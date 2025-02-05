const mongoose = require('mongoose');

const historMail = new mongoose.Schema(
  {
    user_id:{type: 'string', required: true},
    from: { type: String, required: true },
    too: { type: String, required: true },
    subject: { type: String, required: true },
    mail: { type: String, required: true },
    
  },
  { timestamps: true }
);

const History = mongoose.model('History', historMail);

module.exports = History;
