const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
  ssl: {
    rejectUnauthorized: false 
}
});

pool.on('error', (err) => {
  console.error('Error occurred during PostgreSQL connection:', err);
  console.log(err)
});

pool.on('notice', notice => {
  console.log('PostgreSQL notice:', notice.message);
});

pool.connect()
  .then(() => {
    console.log('Database pool is ready and connected.');
  })
  .catch((err) => {
    console.log(err)
    console.error('Error connecting to the database!');
  });
exports.connection = pool;   