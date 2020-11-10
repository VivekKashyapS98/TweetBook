const db = require('../models');

const getDate = () => {
    let d = new Date();
    let n = d.toDateString();
    return n;
}

exports.notifyLike = async function(messageId, likedUserId) {
    const message = await db.Messages.findById(messageId);
    const user = await db.User.findById(message.user);
    const likedUser = await db.User.findById(likedUserId);
    user.notifications.push({text: `<b>${likedUser.username}</b> liked your message: <i>${message.text}</i>....on <b></b>`});
    await user.save();
}

exports.notifyFollow = async function(followerId, followedId) {
    const user = await db.User.findById(followedId);
    const follower = await db.User.findById(followerId);
    user.notifications.push({text: `<b>${follower.username}</b> followed you....on <b>${getDate()}</b>`});
    await user.save();
}