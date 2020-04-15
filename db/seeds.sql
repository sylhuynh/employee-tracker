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
    (2, "John", "Brown", 2, 3),
    (3, "Jane", "Doe", 1, 1),
    (4, "Tom", "Nook", 4, 1);