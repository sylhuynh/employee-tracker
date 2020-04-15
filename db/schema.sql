DROP DATABASE IF EXISTS employee_trackerDb;

CREATE DATABASE employee_trackerDb;

USE employee_trackerDb;

CREATE TABLE departments (
    id INT AUTO_INCREMENT,
    department VARCHAR(50) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE roles (
    id INT AUTO_INCREMENT,
    title VARCHAR(50) NOT NULL,
    salary INT ,
    dept_id INT,
    PRIMARY KEY(id),
    FOREIGN KEY(dept_id) REFERENCES departments(id)
);

CREATE TABLE employees (
    id INT AUTO_INCREMENT,
    first VARCHAR(50) NOT NULL,
    last VARCHAR(50) NOT NULL,
    role_id INT,
    manager_id INT,
    PRIMARY KEY(id),
    FOREIGN KEY(manager_id) REFERENCES employees(id),
	FOREIGN KEY(role_id) REFERENCES roles(id)
);