const TOKEN_LIB = require("../utils/token.js");
// const tokenModel = require('../token/token_model');
const authModel = require('../model/auth.js');
const userModel = require('../model/user.js');
const tokenModel = require('../model/token.js');

exports.signup = asyncWrapper(async (req, res, next) => {
    let {
        email,
        name,
        password,
    } = req.body;

    let status = 400;
    let flag = true;
    let message = "";

    if (!email) {
        flag = false;
        message = "Email cannot be empty";
    } else {
        email = email.toLowerCase().trim();
    }

    if (!name) {
        flag = false;
        message = "name cannot be empty";
    }

    if (!password) {
        flag = false;
        message = "password cannot be empty";
    }


    if (flag) {
        const user = await userModel.getUser({email});
        if(user && user.length > 0) {
            message="user already exists,please login";
            return res.status(status).json({
                message: message,
            });
        }else{
           await authModel.createUser({email,name});
           await authModel.updatePassword({email,password});
            status = 200;
           return  res.status(status).json({
            message: "user created successfully!",
        });
        }
    } else {
        res.status(status).json({
            message: message,
        });
    }
});

exports.login = asyncWrapper(async (req, res, next) => {
    let {
        email,
        password,
    } = req.body;

    let status = 400;
    let flag = true;
    let message = "";

    if (!email) {
        flag = false;
        message = "Email cannot be empty";
    } else {
        email = email.toLowerCase().trim();
    }
    if (!password) {
        flag = false;
        message = "password cannot be empty";
    }

    
    if (flag) {
        const verifyPassword = await authModel.verifyPassword({email,password});
        if(verifyPassword.status){
            const Token = new TOKEN_LIB();
            const [user] = await userModel.getUser({email});
            const refreshToken = await Token.createRefreshToken({uid:user.uid});
            status=200;
            return res.status(status).json({
                message:'login successfully',
                refresh_token: refreshToken,
            });      
        }else{
            return res.status(status).json({
                message: verifyPassword.message,
            });      
        }
    }else {
        res.status(status).json({
            message: message,
        });
    }
});

exports.refreshToken = asyncWrapper(async (req, res) => {
    const {
        refresh_token,
    } = req.body;
    if (refresh_token ) {
        const token = new TOKEN_LIB();
        
        const accessToken = await token.accessToken({
            refreshToken: refresh_token,
        });
        if (accessToken.status) {
            res.json({
                access_token: accessToken.data,
            });
        } else {
            res.status(400).json({
                message: accessToken.error,
            });
        }

    }
     
     else {
        res.status(400).json({
            message: 
                "Refresh token is required"
        });
    }
});

exports.logout = asyncWrapper(async (req, res) => {

    let httpStatus = 200;
    let httpResponse = {};

    const { refresh_token } = req.body;


    if (refresh_token) {
        await tokenModel.deleteRefreshToken({refreshToken:refresh_token});
        httpResponse.message = 'successfully logout';
    } else {
        httpStatus = 400;
        httpResponse.message = "Refresh token required"
    }

    if (httpResponse.error && !httpResponse.message) {
        httpResponse.message = "Something went wrong."
    }
    return res.status(httpStatus).json(httpResponse);

});

