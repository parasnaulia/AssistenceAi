import mysql from "mysql2/promise";

const mysqlpool = mysql.createPool({
  host: "localhost", // e.g., 'localhost'
  user: "root", // e.g., 'root'
  password: "root", // e.g., 'password'
  database: "AiDatabase", // e.g., 'mydatabase'
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default mysqlpool;
