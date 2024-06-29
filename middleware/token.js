const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const date = require('date-and-time');

const privateKey = process.env.JWT_PRIVATE_KEY;

const  Decode = (accessToken) => {
    try {
        const decoded = jwt.verify(accessToken, privateKey);
        return decoded;
    } catch (err) {
        return false;
    }
}

const TokenMiddleware = async (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];

        const result = Decode(bearerToken);
        if (result) {
            req.uid = result.uid;
            next();
        } else {
            res.status(401).json({
                'error': "Unauthorized access."
            });
        }
    } else {
        res.status(401).json({
            'error': "Unauthorized access."
        });
    }

};
module.exports = {TokenMiddleware,Decode};