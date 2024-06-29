const {queryExecuter} = require('../utils/query-executer');
const bcrypt = require('bcrypt');
const DATABASE_SCHEMA = process.env.DATABASE_SCHEMA;

const verifyPassword = async ({ email, password }) => {
  const response = {status : true};
  const fetchUser = await queryExecuter(
    `SELECT password, uid FROM temp_user_login WHERE email = $1`,
    [email]
  );

  if (fetchUser?.length) {
      const passwordMatch = await bcrypt.compare(password, fetchUser[0].password);
      if (!passwordMatch) {
        response.status = false;
        response.message = "Password is incorrect";
      }
  } else {
    response.status = false;
    response.message = "User not found";
  }
  return response;
}


const createUser= async ({name,email}) =>{
    const user = await queryExecuter(`INSERT INTO temp_user_login(name,email,created_datetime) VALUES($1,$2,$3)`,[name,email,new Date()]);
    return user;
}

const updatePassword = async ({ email, password }) => {
    // Generate a salt
    const saltRounds = 11;
    const salt = bcrypt.genSaltSync(saltRounds);
    // Hash the password with the salt
    const hashPassword = bcrypt.hashSync(password, salt);
    const updateQuery = await queryExecuter(
        `UPDATE temp_user_login SET password=$1 WHERE email=$2`,
        [hashPassword, email]
    );
    return updateQuery;
}
  

module.exports = {verifyPassword,createUser,updatePassword};