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
  name VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);

/*insert values into address_books*/
INSERT INTO address_books ( name)
VALUES
    ('Meine Kontakte'),
    ("Familie"),
    ('Uni');

/*add multiple users to a addressbook*/
CREATE TABLE IF NOT EXISTS address_book_users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  address_book_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (address_book_id) REFERENCES address_books(id)
);

INSERT INTO address_book_users (user_id, address_book_id)
VALUES
    (1, 1),
    (1, 2),
    (1, 3),
    (2, 3);


/*create table contacts*/
CREATE TABLE IF NOT EXISTS contacts (
  id INT UNSIGNED NOT NULL auto_increment,
  address_book_id INT UNSIGNED NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255),
  email VARCHAR(255),
  street VARCHAR(255),
  city VARCHAR(255),
  zip_code VARCHAR(20),
  birthday VARCHAR(20),
  PRIMARY KEY (id),
  FOREIGN KEY (address_book_id) REFERENCES address_books(id) ON DELETE CASCADE
);

/*insert values into contact*/
/*Geb format: MM-DD-YYYY*/
INSERT INTO contacts (address_book_id, first_name, last_name, email, street, city, zip_code, birthday)
VALUES
    (1, 'Julia', 'Wesel', 'julia.wesel@gmx.de', 'Baumstrasse 3a', 'Berlin', '00012', '01-01-2000'),
    (1, 'Bob', 'Schmidt', 'bob.schmidt@outlook.com', 'Blumenweg 12', 'Hamburg', '54678', '02-03-2001'),
    (2, 'Pascal', 'Thurow', 'pascal.thurow@example.com', 'Otto-Hahn Str 7', 'Oberkotzau', '95145', '07-07-2000'),
    (2, 'Ronja', 'Thurow', 'ronja.thurow@gmail.com', 'Otto-Hahn Str 7', 'Oberkotzau', '95145', '12-12-2001'),
    (2, 'Sven', 'Thurow', 'sven.thurow@gmx.com', 'Otto-Hahn Str 7', 'Oberkotzau', '95145', '02-01-1970'),
    (2, 'Corinna', 'Thurow', 'corrina.thurow@gmx.com', 'Otto-Hahn Str 7', 'Oberkotzau', '95145', '03-22-1974'),
    (3, 'Sheldon', 'Cooper', 'bazinga@gmail.com', '2311 Los Robles Ave', 'Pasadena', '91101', '02-26-1980'),
    (3, 'Richard', 'Hendricks', 'richard@piedpiper.com', '1234 Nerd Ave', 'San Francisco', '94103', '03-25-1987'),
    (3, 'Roy', 'Trenneman', 'areyoua@windowcleaner.com', '27 Dorking Rd', 'London', 'N1 5DL', '10-05-1983'),
    (3, 'Jar Jar', 'Binks', 'mesa_love_jarjar@naboo.com', '123 Naboo St', 'Theed', '99999', '01-01-1999'),
    (3, 'Wade', 'Wilson', 'chimichanga_lover@deadpool.com', '444 Hella Blvd', 'New York City', '10001', '04-01-1971'),
    (3, 'Peter', 'Parker', 'spiderman@dailybugle.com', '20 Ingram St', 'Queens', '11427', '08-10-2001'),
    (3, 'Tony', 'Stark', 'ironman@starkindustries.com', '10880 Malibu Point', 'Malibu', '90265', '05-29-1970'),
    (3, 'Hermione', 'Granger', 'bookworm@hogwarts.com', '12 Grimmauld Place', 'London', 'W1T 1JJ', '09-19-1979'),
    (3, 'Jack', 'Sparrow', 'savvy@blackpearl.com', '777 Treasure Isle', 'Port Royal', '00001', '07-07-1699'),
    (3, 'Willy', 'Wonka', 'golden_ticket@wonka.com', '29 Acacia Road', 'London', 'SE18 4AD', '09-10-1964');

/*create table phone_numbers*/
CREATE TABLE IF NOT EXISTS phone_numbers (
  id INT UNSIGNED NOT NULL auto_increment,
  contact_id INT UNSIGNED NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
);


/*insert values into phone_numbers*/
INSERT INTO phone_numbers (contact_id, phone_number)
VALUES 
    (1, '12345678990'),
    (2, '3847502194785'),
    (2, '6584687');


/*create accessToken table*/
CREATE TABLE access_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(255) NOT NULL,
  expiration_date DATETIME NOT NULL
);