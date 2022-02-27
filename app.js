const express = require("express");
const mysql = require("mysql");
const app = express();
const PORT = 5000;

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "fetan-db",
});

db.connect((err) => {
  if (err) throw new Error("Error Found!");
  console.log("DB Connected Successfully ");
});

// app.get("/getEmployeeById_", (req, res) => {
//   var sql =
//     "CREATE TABLE customers (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(250), address VARCHAR(250))";

//   db.query(sql, (err, results) => {
//     if (err) console.log(err);
//     res.send(results);
//   });
// });

app.listen(PORT, () => {
  console.log(`Server is listing on port ${PORT}`);
});
