const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  // rating: {
  //   type: Number,
  //   required: true
  // },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ownerEmail: String
}, {
  timestamps: true
})

module.exports = mongoose.model('Review', reviewSchema)
