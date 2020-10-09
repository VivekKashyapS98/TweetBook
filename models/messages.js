const mongoose = require('mongoose');
const User = require('./user.js');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    text: {
        type: String,
        required: true,
        maxlength: 180
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
}, {timestamps: true});

messageSchema.pre("deleteOne", { document: true }, async function(next) {
    try {
        let user = await User.findById(this.user);
        console.log(this.user);
        user.messages.pull(this.id);
        await user.save();
        return next();
    } catch (err) {
        return next(err);
    }
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
