/*create Database APP*/
CREATE DATABASE IF NOT EXISTS APP;
USE APP;

/*create Table for users */
CREATE TABLE IF NOT EXISTS USERS (
    id INT UNSIGNED NOT NULL auto_increment,
    name VARCHAR(50),
    email VARCHAR(20),
    password VARCHAR(50),
    PRIMARY KEY (id)
);

/*insert values into users*/
INSERT IGNORE INTO USERS (name, email, password)
VALUES
    ('admin', 'admin@example.de', MD5('admin')),
    ('user', 'user@example.de', MD5('user'));

/*create table for entries*/
CREATE TABLE IF NOT EXISTS ENTRIES(
    id INTEGER NOT NULL,
    name VARCHAR(50),
    description VARCHAR(50),
    PRIMARY KEY (id)
);

/*insert values into entries*/
INSERT IGNORE INTO ENTRIES (name, description)
VALUES
    ('Test', 'Test123');
