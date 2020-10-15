const express = require('express');
const router = express.Router({mergeParams: true});
const { getMessages, userFollow, userUnfollow, likeMessage, unlikeMessage } = require('../handlers/userProfile');


router.get('/',getMessages);
router.route('message/:messageId/like')
            .post(likeMessage)
            .delete(unlikeMessage);
router.route('/follow/:id2')
            .post(userFollow)
            .delete(userUnfollow);

module.exports = router;