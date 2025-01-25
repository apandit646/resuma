const mongoose = require('mongoose');
const { encrypt, decrypt, authenticateToken } = require('../authentication/auth');


const userLoginSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: {
    type: String, required: true, 
    set: encrypt, // Encrypt the password before saving
    get: decrypt
  },
  // Fixed typo "conformPassword" to "confirmPassword"
}, { timestamps: true });

const UserLogin = mongoose.model('User', userLoginSchema);
userLoginSchema.set('toObject', { getters: true })
userLoginSchema.set('toJSON', { getters: true })

module.exports = UserLogin;
