var mysql = require("mysql");
var inquirer = require("inquirer");
var colors = require('colors');
var cTable = require("console.table");
var passKey = require("./keys.js");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon_db"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    console.log("WELCOME TO BAMAZON SHOPPING EXPERIENCE!");
    console.log("---------------------------------------------------");
    startShop();
});

function startShop() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "Please select your options below",
            choices: [
                "View Inventory",
                "Exit"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View Inventory":
                    showProducts();
                    break;
                case "Exit":
                    exitShop();
                    break;
            }
        });
}

function exitShop() {
    console.log("");
    console.log("Thank you for your business & please visit BAMAZON soon!".rainbow);
    connection.end();
}

function showProducts() {
    let query = "SELECT item_id, product_name, department_name, price, stock_quantity FROM products";
    connection.query(query, function (error, response) {
        if (error) {
            throw error;
        } else {
            console.log("");
            console.table(response);
            db = response;
            orderProduct();          
        }
    });
}

function orderProduct() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "Please select what you like to do",
            choices: [
                "Place an order",
                "Exit"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "Place an order":
                    getOrder();
                    break;
                case "Exit":
                    exitShop();
                    break;
            }
        });
}

function getOrder() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.table(res);
        console.log("Table shows available products in USD not including tax (tax will be added to total amount).".italic);
        console.log("");
        inquirer.
            prompt([{
                name: "userItem",
                type: "input",
                message: "Please enter unique Item ID for your order: "
            }, {
                name: "userAmount",
                type: "input",
                message: "Please enter the quantity: "
            }]).
                then(function (inq) {
                connection.query("SELECT * FROM products WHERE ?", [{
                    item_id: inq.userItem
                }], function (err, resOne) {
                    
                    if (err) throw err;
                    
                    if (resOne[0] != undefined) {
                        if (resOne[0].stock_quantity >= inq.userAmount) {
                            connection.query("UPDATE products SET stock_quantity = stock_quantity - ? WHERE ?",
                                [parseInt(inq.userAmount),
                                    {
                                        item_id: inq.userItem
                                    }
                                ],
                                function (err, resTwo) {
                                    if (err) throw err;

                                    var total = (inq.userAmount * resOne[0].price + (.06 * (inq.userAmount * resOne[0].price)));
                                    var roundedTotal = (Math.round(total * 100) / 100).toFixed(2);

                                    if (inq.userAmount > 1) {
                                        console.log("");
                                        console.log(colors.brightGreen("Confirmed Orders: \n" + 
                                        "--------------------------------------" + "\n" +
                                        "Item: " + resOne[0].product_name + "\n" +
                                        "Quantity: " + inq.userAmount + "\n" +
                                        "Total Price (incl tax): $" + roundedTotal + "\n" +
                                        "--------------------------------------"));
                                        console.log("");

                                    } else {
                                        console.log("");
                                        console.log(colors.brightGreen("Confirmed Orders: \n" + 
                                        "--------------------------------------" + "\n" +
                                        "Item: " + resOne[0].product_name + "\n" +
                                        "Quantity: " + inq.userAmount + "\n" +
                                        "Total Price (incl tax): $" + roundedTotal + "\n" +
                                        "--------------------------------------"));
                                        console.log("");
                                    }
                                    shopAgain();
                                }
                            )
                        } else {
                            console.log("");
                            console.log(colors.brightRed("Sorry there is insufficient stock for " + resOne[0].product_name + ". Please try again."));
                            console.log("");
                            startShop();
                        }
                    } else {
                        console.log("");
                        console.log(colors.brightRed("Sorry item is not available in our database. Please try another item ID from the table."));
                        console.log("");
                        startShop();
                    };
                });
            });
    });
};

function shopAgain() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "Would you like to continue shopping?",
            choices: [
                "Yes", 
                "No"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case ("Yes"):
                    showProducts();
                    break;

                case ("No"):
                    exitShop();
                    break;
            }
        })
}

