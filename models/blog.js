const { Schema, model } = require("mongoose")

const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    coverImageURL: {
        type: String,
        required: false, // optional
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
}, { timestamps: true })

module.exports = model("blogs", blogSchema)