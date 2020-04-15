INSERT INTO departments (id, department)
VALUES
	(1, "Executive"),
    (2, "Development"),
    (3, "Operations");
    
INSERT INTO roles (id, title, salary, dept_id)
VALUE 
	(1, "Lead Engineer", 100000, 2),
	(2, "Junior Engineer", 60000, 2),
	(3, "CEO", 100000, 1),	
    (4, "Tech Support", 70000, 3);
    
INSERT INTO employees (id, first, last, role_id, manager_id)
VALUES
    (1, "Amy", "Smith", 3, null),
    (2, "Jane", "Doe", 1, 1),
    (3, "Tom", "Nook", 4, 1),
	(4, "John", "Brown", 2, 2);

--Show all employees
SELECT employees.id, employees.first, employees.last, roles.title AS roles, departments.department AS department, roles.salary AS salary, managers.first AS manager
FROM employees
LEFT JOIN employees AS managers ON employees.manager_id = managers.id
JOIN roles 
ON employees.role_id = roles.id JOIN departments
ON roles.dept_id = departments.id ORDER BY employees.id;

--Show all employees based on department
SELECT employees.id, employees.first, employees.last, roles.title AS roles, departments.department AS department, roles.salary AS salary, managers.first AS manager
FROM employees
LEFT JOIN employees AS managers ON employees.manager_id = managers.id
JOIN roles 
ON employees.role_id = roles.id JOIN departments
ON roles.dept_id = departments.id 
WHERE departments.department = "Development"
ORDER BY employees.id;