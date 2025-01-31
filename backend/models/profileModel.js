const mongoose = require('mongoose');

const profileModelSchema = new mongoose.Schema(
  {
    user_Id:{type:String ,required: true},
    firstName: { type: Object},
    lastName: { type: String},
    email: { type: String, required: true, unique: true},
    phone: { type: String},
    address: { type: String},
    city: { type: String },
    state: { type: String },
    zipCode: { type: String},
    programmingLanguages: { type: String},
    technologies: { type: String},
    skills: { type: String},
    experiences: { type: String},
    resume: { type: String , required: true},
  },
  { timestamps: true }
);

const Profile = mongoose.model('Profile', profileModelSchema);

module.exports = Profile;
