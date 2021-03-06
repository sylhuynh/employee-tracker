const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");

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
      else if (answer.starterQs === "Add Employee") {
        return addEmployee();
      }
      else if (answer.starterQs === "Add Department") {
        return addDepartment();
      }
      else if (answer.starterQs === "Add Role") {
        return addRole();
      }
      else if (answer.starterQs === "Update Employee Role") {
        return updateEmpRole();
      }
      else if (answer.starterQs === "View All Departments") {
        return viewDepartments();
      }
      else if (answer.starterQs === "View All Roles") {
        return viewRoles();
      }
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
};

// VIEW ALL EMPLOYEES 
function viewAllEmployees() {
  connection.query("SELECT employees.id, employees.first, employees.last, roles.title AS roles, departments.department AS department, roles.salary AS salary, managers.first AS manager FROM employees LEFT JOIN employees AS managers ON employees.manager_id = managers.id JOIN roles ON employees.role_id = roles.id JOIN departments ON roles.dept_id = departments.id ORDER BY employees.id",
    (err, res) => {
      console.table(res);
      start();
    });
};

// VIEW BY DEPARTMENT
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
          console.table(res);
          start();
        }
      );
    });
};

// ADD EMPLOYEE
function addEmployee() {
  connection.query("SELECT id, title FROM roles", (err, roles) => {
    if (err) {
      throw err;
    }
    const roleNames = roles.map((row) => row.title);

    connection.query("SELECT id, first, last FROM employees", (err, employees) => {
      if (err) {
        throw err;
      }
      const empNames = employees.map((row) => `${row.first} ${row.last}`);

      return inquirer
        .prompt([
          {
            type: "input",
            message: "What is the employee's first name?",
            name: "newEmpFirst"
          },
          {
            type: "input",
            message: "What is your employee's last name?",
            name: "newEmpLast"
          },
          {
            type: "list",
            message: "What is the employee's role?",
            name: "newEmpRole",
            choices: roleNames
          },
          {
            type: "list",
            message: "Who is the employee's manager?",
            name: "newEmpManager",
            choices: empNames
          }
        ])
        .then((answer) => {
          const chosenManager = employees.find(
            (row) => `${row.first} ${row.last}` === answer.newEmpManager
          );
          const chosenRole = roles.find(
            (row) => row.title === answer.newEmpRole
          );
          connection.query(
            "INSERT INTO employees SET ?",
            {
              first: answer.newEmpFirst,
              last: answer.newEmpLast,
              role_id: chosenRole.id,
              manager_id: chosenManager.id
            },
            (err, res) => {
              if (err) throw err;
            })

          start();
        })
    });
  });
};

//ADD DEPARTMENT
function addDepartment() {
  inquirer
    .prompt({
      name: "department",
      type: "input",
      message: "What department would you like to add?"
    }).then((answer) => {
      connection.query(
        "INSERT INTO departments SET ?",
        { department: answer.department },
        (err, res) => {
          if (err) throw err;
        })

      start();
    });
};

//ADD ROLE
function addRole() {
  connection.query("SELECT id, department FROM departments", (err, departments) => {
    if (err) {
      throw err;
    }
    const departmentNames = departments.map((row) => row.department);
    return inquirer
      .prompt([
        {
          type: "input",
          message: "What is the title of the role?",
          name: "newRoleTitle"
        },
        {
          type: "input",
          message: "What is the expected salary for such role?",
          name: "newRoleSalary"
        },
        {
          type: "list",
          message: "What department is this role assigned to?",
          name: "newRoleDep",
          choices: departmentNames
        },
      ])
      .then((answer) => {
        const chosenRole = departments.find(
          (row) => row.department === answer.newRoleDep
        );
        connection.query(
          "INSERT INTO roles SET ?",
          {
            title: answer.newRoleTitle,
            salary: answer.newRoleSalary,
            dept_id: chosenRole.id
          },
          (err, res) => {
            if (err) throw err;
          })

        start();
      })
  });
};

//UPDATE EMPLOYEE ROLE
function updateEmpRole() {
  connection.query("SELECT id, title FROM roles", (err, roles) => {
    if (err) {
      throw err;
    }
    const roleNames = roles.map((row) => row.title);

    connection.query("SELECT id, first, last FROM employees", (err, employees) => {
      if (err) {
        throw err;
      }
      const empNames = employees.map((row) => `${row.first} ${row.last}`);

      return inquirer
        .prompt(
          [{
            name: "selectedEmp",
            type: "list",
            message: "Which employee do you want to update?",
            choices: empNames
          },
          {
            name: "selectedRole",
            type: "list",
            message: "Which role do you want to set for the selected employee?",
            choices: roleNames
          }]).then((answer) => {
            const chosenEmp = employees.find(
              (row) => `${row.first} ${row.last}` === answer.selectedEmp
            );
            const chosenRole = roles.find(
              (row) => row.title === answer.selectedRole
            );
            connection.query(
              "UPDATE employees SET ? WHERE ?",
              [{
                role_id: chosenRole.id
              },
              {
                id: chosenEmp.id
              }],
              (err, res) => {
                if (err) throw err;
              })
            start();
          }
          );
    });
  });
}

// VIEW ALL DEPARTMENTS
function viewDepartments() {
  connection.query("SELECT department FROM departments",
    (err, res) => {
      console.table(res);
      start();
    });
};

//VIEW ALL ROLES
function viewRoles() {
  connection.query("SELECT title FROM roles",
    (err, res) => {
      console.table(res);
      start();
    });
};