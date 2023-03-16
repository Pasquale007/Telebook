/*create Database APP*/
CREATE DATABASE IF NOT EXISTS APP;
USE APP;

/*create Table for users */
CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED NOT NULL auto_increment,
    name VARCHAR(50),
    email VARCHAR(255),
    password VARCHAR(50),
    role VARCHAR(20),
    PRIMARY KEY (id)
);

/*insert values into users*/
INSERT IGNORE INTO users (name, email, password, role)
VALUES
    ('admin', 'admin@example.de', MD5('admin'), "admin"),
    ('user', 'user@example.de', MD5('user'), "user");

/*create table for address_books*/
CREATE TABLE IF NOT EXISTS address_books (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

/*insert values into address_books*/
INSERT INTO address_books (user_id, name)
VALUES
    (1, 'Meine Kontakte'),
    (1, "Familienkontakte");

/*create table contacts*/
CREATE TABLE IF NOT EXISTS contacts (
  id INT UNSIGNED NOT NULL auto_increment,
  address_book_id INT UNSIGNED NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255),
  email VARCHAR(255),
  address VARCHAR(255),
  city VARCHAR(255),
  zip_code VARCHAR(20),
  PRIMARY KEY (id),
  FOREIGN KEY (address_book_id) REFERENCES address_books(id)
);

/*insert values into contact*/
INSERT INTO contacts (address_book_id, first_name, last_name, email, address, city, zip_code)
VALUES
    (1, 'Jane', 'Doe', 'jane.doe@example.com', '123 Main St', 'Anytown', '12345'),
    (2, 'Pascal', 'Thurow', 'pascal.thurow@example.com', 'Otto-Hahn Str 7', 'Oberkotzau', '95145'),
    (1, 'Bob', 'Smith', 'bob.smith@example.com', '456 Elm St', 'Anytown', '12345');

/*create table phone_numbers*/
CREATE TABLE IF NOT EXISTS phone_numbers (
  id INT UNSIGNED NOT NULL auto_increment,
  contact_id INT UNSIGNED NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (contact_id) REFERENCES contacts(id)
);


/*insert values into phone_numbers*/
INSERT INTO phone_numbers (contact_id, phone_number)
VALUES 
    (1, '555-1234'),
    (2, '555-5678'),
    (2, '555-9999');
