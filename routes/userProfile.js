const express = require('express');
const router = express.Router({mergeParams: true});
const { getMessages, userFollow, userUnfollow } = require('../handlers/userProfile');

router.get('/',getMessages);
router.route('/:id2')
            .post(userFollow)
            .delete(userUnfollow)

module.exports = router;