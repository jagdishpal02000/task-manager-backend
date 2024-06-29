const jwt = require("jsonwebtoken");
const { randomUUID } = require("crypto");
const date = require("date-and-time");
const tokenModel = require('../model/token');
const userModel = require('../model/user.js');

class Token {
  constructor() {
    this.privateKey = process.env.JWT_PRIVATE_KEY;
    this.accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY;
    this.refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY;
  }
  async accessToken({ refreshToken }) {
    const resp = { status: true };
    const [validateRefreshToken] = await tokenModel.getTokenData({refreshToken});
    const [userData] = await userModel.getUser({uid:validateRefreshToken.uid});
    //Checking whether the refresh token is valid or not.
    if (
      validateRefreshToken &&
      new Date(validateRefreshToken.expiry_at) >= new Date() 
    ) {
          const accessToken = jwt.sign(
            {
              uid: validateRefreshToken.uid,
              name : userData.name,
            },
            this.privateKey,
            {
              expiresIn: this.accessTokenExpiry,
            }
          );
          resp.data = accessToken;
    } else {
      resp.status = false;
      resp.error ="refresh token is expired,please login again.";
    }
    return resp;
  }
 

  /**
   *
   * @param {string} uid
   *
   * @returns {string} refreshToken/false
   */
  async createRefreshToken({ uid }) {
  
    let refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY;

    let now = new Date();
    const createdAt = date.format(now, "YYYY-MM-DD HH:mm:ss");
    const expiryAt = date.format(
      date.addDays(now, +refreshTokenExpiry),
      "YYYY-MM-DD HH:mm:ss"
    );

    // generate new refresh token value using uuid function
    let refreshToken = randomUUID();
    await tokenModel.saveRefreshToken({
      uid,
      refreshToken,
      createdAt,
      expiryAt,
    });
  
    return refreshToken;
  }

  decode(accessToken) {
    try {
      const decoded = jwt.verify(accessToken, this.privateKey);
      return decoded;
    } catch (err) {
      return false;
    }
  }
 
}

module.exports = Token;
