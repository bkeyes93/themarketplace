const mongoose = require('mongoose');
const validator = require('validator');
const Schema  = mongoose.Schema;

const itemSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    seller: {
        type: String,
        default: 'anonymous'
    },
    category: {
        type: String,
        enum: ['Electronics', 'Furniture', 'Clothing', 'Other'],
        required: true
    },
    price: {
        type: Number,
        min: 0,
        required: true
    },
    latitude: {
        type: Number,
        min: -90,
        max: 90,
        required: true
      },
      longitude: {
        type: Number,
        min: -180,
        max: 180,
        required: true
      },
      contact: {
          type: String,
          required: true,
          validate: {
              validator: value => (validator.isEmail(value) || validator.isMobilePhone(value)),
              message: props => props.value + ' isn\'t a valid email address or phone number.'
          }
      }
}, {timestamps: true});

const item = mongoose.model('item', itemSchema);
module.exports = item;