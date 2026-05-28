const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobileNumber: { type: String, required: true, unique: true }, // ഒരു നമ്പറിൽ ഒരു അക്കൗണ്ട് മാത്രം
  password: { type: String, required: true }, // ലോഗിൻ ചെയ്യാൻ
  whatsappNumber: { type: String },
  address: { type: String, required: true },
  photoUrl: { type: String },
  amountPaid: { type: Number, default: 0 },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);