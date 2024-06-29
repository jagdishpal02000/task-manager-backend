const {queryExecuter} = require('../utils/query-executer');

exports.getUser = async ({ email, uid }) => {
    if (email) {
        return await queryExecuter(`SELECT * FROM temp_user_login WHERE email = $1 `, [email]);
    }
    if (uid) {
        return await queryExecuter(`SELECT * FROM temp_user_login WHERE uid = $1 `, [uid]);
    }
};