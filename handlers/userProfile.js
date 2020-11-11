const db = require('../models');
const { notifyFollow, notifyLike } = require('./notify');

exports.updateProfile = async function(req, res, next) {
    await db.User.findByIdAndUpdate(req.params.id, req.body)
                    .then(() => res.status(200).json({message: "Updated!"}))
                    .catch(err => next(err));
}

exports.getNotifications = async function(req, res, next) {
    await db.User.findById(req.params.id)
                    .then(data => res.status(200).json([...data.notifications]))
                    .catch(err => next(err));
}

exports.markNotifications = async function(req, res, next) {
    try {
        let user = db.User.findById(req.params.id);
        try {
            let newNotify = user.notifications.map(item => {
                return {...item, read: true};
            });
            user.notifications = [...newNotify];
            await user.save();
            return res.status(200).json({message: "Notifications marked read..."});
        } catch (err) {
            return res.status(200).json({message: "Notifications are empty..."});
        }
    } catch (err){
        next(err);
    }
}

exports.likeMessage = async function(req, res, next) {
    try {
        let message = await db.Messages.findById(req.params.messageId);
        message.likes.push(req.params.id);
        await message.save();
        let user = await db.User.findById(req.params.id);
        user.likes.push(req.params.messageId);
        await user.save();
        notifyLike(req.params.messageId, req.params.id);
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
        let user = await db.User.findById(req.params.id);
        user.likes.pop(req.params.messageId);
        await user.save();
        return res.status(200).json({message: "unliked"});
    } catch (err) {
        return next(err);
    }
}

exports.getMessages = async function(req, res, next) {
    let user = db.User;
    await user.findById(req.params.id, ["username", "bio", "profileImgUrl", "following", "followers", "messages", "notifications"])
                  .sort({ createdAt: "desc" })
                  .populate("messages", {
                    text: true,
                    updatedAt: true,
                    user: true,
		            likes: true
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
        notifyFollow(req.params.id, req.params.id2);
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
