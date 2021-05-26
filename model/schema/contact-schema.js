const mongoose = require('mongoose');
const { Schema, SchemaTypes } = mongoose;

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for contact'],
      unique: true,
      min: 3,
      max: 30,
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Set email for contact'],
    },
    phone: {
      type: String,
      unique: true,
      required: [true, 'Set phone for contact'],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: SchemaTypes.ObjectId,
      ref: 'user',
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Contact = mongoose.model('contacts', contactSchema);

module.exports = Contact;
