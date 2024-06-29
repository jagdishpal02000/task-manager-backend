const {queryExecuter} = require('../utils/query-executer');

exports.saveRefreshToken = async ({ uid, refreshToken,createdAt, expiryAt }) => {
    const response = await queryExecuter(`
    INSERT INTO temp_refresh_tokens
    (uid,token,created_at,expiry_at)
    VALUES
    ($1,$2,$3,$4)`,
    [uid, refreshToken,createdAt, expiryAt]);
    return response;
}

exports.getTokenData= async ({refreshToken}) => {
  const token = await queryExecuter(`SELECT * FROM temp_refresh_tokens WHERE token = $1 LIMIT 1`, [refreshToken]);
  return token;
}
      
exports.deleteRefreshToken= async ({refreshToken}) => {
  const token = await queryExecuter(`DELETE FROM temp_refresh_tokens WHERE token = $1 `, [refreshToken]);
  return token;
}
      