const jwt = require('jsonwebtoken');
const { User } = require('../Models/DB');
const { TOKEN_SECRET } = require('../../Config');
const bcrypt = require('bcrypt');


module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : '';

        if (!token) {
            res.status(401).json({ message: 'Authorized token not found', data: null, status: 401, success: false });
            return;
        }

        const tokenData = jwt.verify(token, TOKEN_SECRET);
        const user = await User.findById(tokenData._id)

        if (user) {
            const isTokenValid = await bcrypt.compare(token, user.jwtToken)
            if (isTokenValid) {
                req.user = user
            }
            else {
                res.status(401).json({ message: 'Please Login to continue', data: null, status: 401, success: false })
                return
            }
        } else {
            res.status(401).json({ message: 'You are not authorized', data: null, status: 401, success: false });
            return
        }
        next();
    } catch (e) {
        console.log(e)
        res.status(401).json({ message: 'jwt expired', data: null, status: 401, success: false });
    }
};