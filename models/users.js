const mongoose = require("mongoose")
const { createHmac, randomBytes } = require("crypto")
const { createTokenForUser } = require("../services/authentication")

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    profileImageAvatar: {
        type: String,
        default: 'https://xsgames.co/randomusers/assets/avatars/female/70.jpg'
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default : "USER"
    }
})

// Trigger while our data is saving
UserSchema.pre('save', function(next){
 const user = this

 if(!user.isModified("password")) return

 const salt = randomBytes(16).toString();
 const hashedPassword = createHmac("sha256", salt)
 .update(user.password)
 .digest("hex")

 this.salt = salt
 this.password = hashedPassword

 next()
})

UserSchema.static("matchPasswordAndGenerateToken", async function(email, password){
    const user = await this.findOne({ email })
    console.log(user)
    if(!user) throw new Error("User not found!")

    const salt = user.salt;
    const hashedPassword = user.password

    const userProvidedHash = createHmac("sha256", salt)
    .update(password)
    .digest("hex")
    
    if(hashedPassword !== userProvidedHash) 
    throw new Error("Incorrect Password")
    
    const token = createTokenForUser(user._doc)
    return token
})

module.exports = mongoose.model("user", UserSchema)