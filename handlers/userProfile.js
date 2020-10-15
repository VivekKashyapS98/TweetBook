const db = require('../models');

exports.likeMessage = async function(req, res, next) {
    try {
        let message = await db.Messages.findById(req.params.messageId);
        message.likes.push(req.params.id);
        await message.save();
        return res.status(200).json({message: "liked"});
    } catch (err) {
        return next(err);
    }
}

exports.unlikeMessage = async function(req, res, next) {
    try {
        let message = await db.Messages.findById(req.params.messageId);
        message.likes.pop(req.params.id);
        await message.save();
        return res.status(200).json({message: "unliked"});
    } catch (err) {
        return next(err);
    }
}

exports.getMessages = async function(req, res, next) {
    let user = db.User;
    await user.findById(req.params.id, ["username", "bio", "following", "followers", "messages"])
                  .sort({ createdAt: "desc" })
                  .populate("messages", {
                    text: true
                  })
                  .populate("followers", {
                      username: true,
                      profileImgUrl: true
                  })
                  .populate("following", {
                    username: true,
                    profileImgUrl: true
                })
                  .then(data => res.status(200).json(data))
                  .catch(err => next(err));
}

exports.userFollow = async function(req, res, next) {
    try {
        let user = await db.User.findById(req.params.id);
        user.following.push(req.params.id2);
        await user.save();
        let user2 = await db.User.findById(req.params.id2);
        user2.followers.push(req.params.id);
        await user2.save();
        return res.status(200).json({tweet: "followed"});
    } catch (err) {
        return next(err);
    }
}

exports.userUnfollow = async function(req, res, next) {
    try {
        let user = await db.User.findById(req.params.id);
        user.following.pop(req.params.id2);
        await user.save();
        let user2 = await db.User.findById(req.params.id2);
        user2.followers.pop(req.params.id);
        await user2.save();
        return res.status(200).json({tweet: "unfollowed"});
    } catch (err) {
        return next(err);
    }
}