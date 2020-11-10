const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const schema = mongoose.Schema;

const userSchema = new schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    bio: {
        type: String
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    profileImgUrl: {
        type: String
    },
    following: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "user"
        }
    ],
    followers: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "user"
        }
    ],
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message"
        }
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message"
        }
    ],
    notifications: [
        {
            text: {
                type: String
            },
            read: {
                type: Boolean,
                default: false
            }
        }
    ]
});

userSchema.pre('save', async function(next) { 
    try {
        if(!this.isModified("password")) {
            return next();
        }
        let hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        return next();
    } catch (err) {
        return next(err);
    }
})

userSchema.methods.comparePassword = async function(userPasswd, next) {
    try {
        let isMatch = await bcrypt.compare(userPasswd, this.password);
        return isMatch;
    } catch (err) {
        return next(err);
    }
}

const user = mongoose.model("user", userSchema);

module.exports = user;
