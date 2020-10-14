const db = require('../models');

exports.createMessage = async function(req, res, next) {
    try {
        let message = await db.Messages.create({
            text:req.body.text,
            user: req.params.id
        });
        let foundUser = await db.User.findById(req.params.id);
        foundUser.messages.push(message.id);
        await foundUser.save();
        let foundMessage = (await db.Messages.findById(message.id)).populate("user", {
            username: true,
            profileImgUrl: true
        });
        return res.status(200).json(foundMessage);
    } catch (err) {
        return next(err);
    }
}

exports.getMessage = async function(req, res, next) {
    let message = db.Messages;
    await message.findById(req.params.message_id)
            .then(data => res.status(200).json(data))
            .catch(err => next(err));
}

exports.deleteMessage = async function(req, res, next) {
    let message = db.Messages;
    await message.deleteOne({_id: req.params.message_id})
            .then(data => res.status(200).json(data))
            .catch(err => next(err));
}
