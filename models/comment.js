const mongoose = require("mongoose")

const CommentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'blogs'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
}, { timestamps: true })

module.exports = mongoose.model("comment", CommentSchema)