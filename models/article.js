const mongoose = require('mongoose'), Schema = mongoose.Schema

const articleBlog = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  createdAt: {    
    type: Date,
    required: true,
    default: Date.now()
  }
})

module.exports = mongoose.model('Article', articleBlog)