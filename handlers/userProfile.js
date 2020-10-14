const db = require('../models');

exports.getMessages = async function(req, res, next) {
    let user = db.User;
    await user.findById(req.params.id, ["username", "bio", "messages"])
                  .sort({ createdAt: "desc" })
                  .populate("messages", {
                    text: true
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
        return res.status(200).json({tweet: "posted"});
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
        return res.status(200).json({tweet: "deleted"});
    } catch (err) {
        return next(err);
    }
}