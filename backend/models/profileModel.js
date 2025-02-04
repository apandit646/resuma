const mongoose = require('mongoose');

const profileModelSchema = new mongoose.Schema(
  {
    user_Id:{type:String ,required: true},
    fullname: { type: Object},
    email: { type: String, required: true, unique: true},
    phone: { type: String},
    resume: { type: String , required: true},
  },
  { timestamps: true }
);

const Profile = mongoose.model('Profile', profileModelSchema);

module.exports = Profile;
