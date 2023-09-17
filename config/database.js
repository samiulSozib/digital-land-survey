
const mysql = require("mysql");
const database_user=process.env.DATABASE_USER
const database_password=process.env.DATABASE_PASSWORD
const database_name=process.env.DATABASE_NAME
const db = mysql.createConnection({
  host: "localhost",
  user: database_user,
  password:database_password,
  database: database_name,
});

module.exports = db;