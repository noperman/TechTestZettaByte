const mongoose = require('mongoose'), Schema = mongoose.Schema

const commentArticle = new mongoose.Schema({
  articleID:  { type: Schema.Types.ObjectId, ref: 'Article' },
  name: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  createdAt: {    
    type: Date,
    required: true,
    default: Date.now()
  }
})

module.exports = mongoose.model('Comment', commentArticle)