const mongoose = require("mongoose");
const Schema = mongoose.Schema

const blogSchema = new Schema({
    title : {
        type: String ,
        required:true,
    },
    subtitle: {
        type: String,
        required:true,
    },
    description:{
        type: String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    author:{
        type:String,
        required:true,
    },
},
{
  timestamps:true,
})
const Blog = mongoose.model("Blog",blogSchema)
module.exports = Blog;