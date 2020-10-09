const express = require('express');
const router = express.Router({mergeParams: true});
const { getMessages, createMessage, getMessage, deleteMessage } = require('../handlers/messages');

router.route('/').get(getMessages)
		 .post(createMessage);
router.route('/:message_id')
        .get(getMessage)
        .delete(deleteMessage);

module.exports = router;
