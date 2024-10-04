const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  Title: {
    type: String,
    required: true
  },
  BlogerName: {
    type: String,
    required: true
  },
  Body: {
    type: String,
    required: true
  },
  Video: {  // Changed from Image to Video
    type: String,
    required: false
  },
  CreatedBy : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, {
  timestamps: true
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
