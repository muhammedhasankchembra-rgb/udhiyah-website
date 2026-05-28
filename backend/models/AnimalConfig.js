const mongoose = require('mongoose');

const animalConfigSchema = new mongoose.Schema({
  pricePerAnimal: { type: Number, required: true, default: 35000 } // ഉദാഹരണത്തിന് 35000 രൂപ
});

module.exports = mongoose.model('AnimalConfig', animalConfigSchema);