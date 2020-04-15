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
  return start();
});

function start() {
  return inquirer
    .prompt({
      name: "starterQs",
      type: "list",
      message: "Would you like to do?",
      choices: [
        "View All Employees",
        "View All Employees By Department",
        "Add Employee",
        "Update Employee Role",
        "View All Roles",
        "Quit"
      ],
    })
    .then((answer) => {
      // based on their answer, either call the bid or the post functions
      if (answer.starterQs === "View All Employees") {
        return viewAllEmployees();
      }
      // else if (answer.starterQs === "View All Employees By Department") {
      //   return bidAuction();
      // }
      // else if (answer.starterQs === "Add Employee") {
      //   return bidAuction();
      // }
      // else if (answer.starterQs === "Update Employee Role") {
      //   return bidAuction();
      // }
      // else if (answer.starterQs === "View All Roles") {
      //   return bidAuction();
      // }
      else if (answer.starterQs === "Quit") {
        console.log("Goodbye!")
        connection.end();
      }
      else {
        connection.end();
      }
    })
    .catch((error) => {
      console.log(error);
      process.exit(1);
    });
}

function viewAllEmployees() {
  connection.query("SELECT employees.id, employees.first, employees.last, roles.title AS roles, departments.department AS department, roles.salary AS salary, managers.first AS manager FROM employees LEFT JOIN employees AS managers ON employees.manager_id = managers.id JOIN roles ON employees.role_id = roles.id JOIN departments ON roles.dept_id = departments.id ORDER BY employees.id", 
  (err, res) => {
    for (let i = 0; i < res.length; i++) {
      console.log(
        "Id " +
        res[i].id +
        " || First Name: " +
        res[i].first +
        " || Last Name: " +
        res[i].last +
        " || Title: " +
        res[i].roles +
        " || Department: " +
        res[i].department +
        " || Salary: " +
        res[i].salary +
        " || Manager: " +
        res[i].manager
      );
    }
    start();
  });
}
