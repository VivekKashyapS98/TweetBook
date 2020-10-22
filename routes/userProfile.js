const express = require('express');
const router = express.Router({mergeParams: true});
const { ensureCorrectUser } = require('../middlewares/auth.js');
const { updateProfile, getMessages, userFollow, userUnfollow, likeMessage, unlikeMessage } = require('../handlers/userProfile');


router.route('/').get(getMessages)
                 .put(ensureCorrectUser, updateProfile);
router.route('/message/:messageId/like')
            .post(likeMessage)
            .delete(unlikeMessage);
router.route('/follow/:id2')
            .post(userFollow)
            .delete(userUnfollow);

module.exports = router;