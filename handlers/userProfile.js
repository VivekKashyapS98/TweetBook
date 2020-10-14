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
    
}