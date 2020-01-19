DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(50) NOT NULL,
  department_name VARCHAR(40) NOT NULL,
  price DECIMAL(8,2) default 0,
  stock_quantity INT default 0,
  PRIMARY KEY (item_id)
);

INSERT INTO products(product_name, department_name, price, stock_quantity) 
VALUES("Addidas Y-3 Adizero Runner", "Sports", 240.50, 80),
("Penn Tennis Balls 2-packs", "Sports", 10.20, 100),
("Spalding NBA Basketball", "Sports", 9.90, 90),
("Pedegree Adult Dry Dog Food 20lb", "Pet Supplies", 14.99, 130),
("Friskies Adult Cat Treats", "Pet Supplies", 7.97, 150),
("Dell ChromeBook 11", "Computers", 78.99, 50),
("Dell Bluetooth Mouse WM615", "Computers", 41.74, 70),
("HP Pavillion 27-inch monitor", "Computers", 199.99, 60),
("Duracell AA alkaine batteries", "Office Supplies", 15.40, 200),
("HP Printer Papers", "Office Supplies", 17.49, 300);