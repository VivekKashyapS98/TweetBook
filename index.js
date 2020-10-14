require('dotenv').config();
const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const app = express();

const userAuth = require('./routes/auth');
const errorHandler = require('./handlers/error');
const userProfile = require('./routes/userProfile');
const messages = require('./routes/messages');
const { loginRequired, ensureCorrectUser } = require('./middlewares/auth');
const db = require('./models');

const PORT = 8081;

app.use(cors());
app.use(bodyparser.json());
app.use('/api/auth', userAuth);
app.use('/api/users/:id', loginRequired, userProfile);
app.use('/api/users/:id/messages', loginRequired, ensureCorrectUser, messages);
app.use('/api/messages', loginRequired, async function(req, res, next) {
    db.Messages.find({})
               .sort({ createdAt: "desc" })
                .populate("user", {
                    username: true,
                    profileImgUrl: true
                })
                .then(data => res.status(200).json(data))
                .catch(err => next(err));
});

app.use((req, res, next) => {
    let err = new Error("Not Found");
    err.status = 404;
    next(err);
});
app.use(errorHandler);

app.listen(PORT, () => console.log(`The Server is running on port: ${PORT}`));
