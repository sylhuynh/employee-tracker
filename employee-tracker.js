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
        "Add Department",
        "Add Role",
        "Update Employee Role",
        "View All Departments",
        "View All Roles",
        "Quit"
      ],
    })
    .then((answer) => {
      // based on their answer, either call the bid or the post functions
      if (answer.starterQs === "View All Employees") {
        return viewAllEmployees();
      }
      else if (answer.starterQs === "View All Employees By Department") {
        return viewByDepartment();
      }
      // else if (answer.starterQs === "Add Employee") {
      //   return addEmployee();
      // }
      // else if (answer.starterQs === "Add Department") {
      //   return viewByDepartment();
      // }
      // else if (answer.starterQs === "Add Role") {
      //   return viewByDepartment();
      // }
      // else if (answer.starterQs === "Update Employee Role") {
      //   return bidAuction();
      // }
      else if (answer.starterQs === "View All Departments") {
        return viewDepartments();
      }
      // else if (answer.starterQs === "View All Roles") {
      //   return viewRoles();
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

function viewByDepartment() {
  inquirer
    .prompt({
      name: "department",
      type: "list",
      message: "Which department would you like to search for employees?",
      choices: ["Executive", "Development", "Operations"]
    }).then((answer) => {
      connection.query(
        "SELECT employees.id, employees.first, employees.last, roles.title AS roles, departments.department AS department, roles.salary AS salary, managers.first AS manager FROM employees LEFT JOIN employees AS managers ON employees.manager_id = managers.id JOIN roles ON employees.role_id = roles.id JOIN departments ON roles.dept_id = departments.id WHERE ? ORDER BY employees.id",
        { department: answer.department },
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
        }
      );
    });
}

// function addEmployee() {
//   inquirer
//     .prompt(
//       {
//         type: "input",
//         message: "What is the employee's first name?",
//         name: "newEmpFirst"
//     },
//     {
//         type: "input",
//         message: "What is your employee's last name?",
//         name: "newEmpLast"
//     },
//     {
//         type: "list",
//         message: "What is the employee's role?",
//         name: "newEmpRole",
//         choices: ["Lead Engineer", "Junior Engineer", "CEO", "Tech Support"]
//     },
//     {
//       type: "list",
//       message: "Who is the employee's manager?",
//       name: "newEmpManager",
//       choices: ["Jane Doe", "Amy Smith"]
//     }
//     )
//     .then((answer) => {
//       connection.query(
//         "INSERT INTO employees SET ?",
//         { first: answer.newEmpFirst,
//           last: answer.newEmpLast
//         },
//         (err, res) => {
//           for (let i = 0; i < res.length; i++) {
//             console.log(
//               "Id " +
//               res[i].id +
//               " || First Name: " +
//               res[i].first +
//               " || Last Name: " +
//               res[i].last +
//               " || Title: " +
//               res[i].roles +
//               " || Department: " +
//               res[i].department +
//               " || Salary: " +
//               res[i].salary +
//               " || Manager: " +
//               res[i].manager
//               );
//             }
//           start();
//         }
//       );
//     });
// }

function viewDepartments() {
  connection.query("SELECT department FROM departments",
    (err, res) => {
      for (let i = 0; i < res.length; i++) {
        console.log(
          res[i].department
        );
      }
      start();
    });
}