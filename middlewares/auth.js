const auth = (req, res, next) => {
    if (!req.session.userToken) {
        res.json({ message: 'You are not authorized. Please login' });
    } else {
        next();
    }
};

module.exports = auth;