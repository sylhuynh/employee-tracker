const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employee_trackerDb",
})

connection.connect((err) => {
    if (err) {
      throw err;
    }
    console.log("connected as id " + connection.threadId);
    afterConnection();
  });
  
  function afterConnection() {
    connection.query("SELECT * FROM songs", (err, res) => {
      if (err) {
        throw err;
      }
      console.log(res);
      connection.end();
    });
  }
  