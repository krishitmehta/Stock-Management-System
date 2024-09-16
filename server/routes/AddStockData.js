const express = require('express');
const router = express.Router();
const db = require('../connect');

router.post("/addStockData", (req, res) => {
    const { product_name, added_stock, stock_left, branch_name, price, opening_stock } = req.body;
    const sales_quantity = opening_stock+added_stock-stock_left;
    const addquery = "UPDATE stock SET added_stock = ?, stock_left = ? WHERE product_name = ? AND branch_name = ?";
    const reportquery = "INSERT INTO report(product_name, sales_quantity, price, amount, branch_name, date) VALUES (?,?,?,?,?,CURRENT_DATE)";
    db.beginTransaction((err) => {
        if (err) {
            console.error("Transaction error:", err);
            return res.status(500).json({ success: false, message: 'Transaction error' });
        }

        db.query(reportquery, [product_name,sales_quantity,price,sales_quantity*price,branch_name], (err, data) => {
            if (err) {
                return db.rollback(() => {
                    console.error("Internal server error:", err);
                    res.status(500).json({ success: false, message: 'Internal Server Error in product table' });
                });
            }

            db.query(addquery, [added_stock,stock_left,product_name,branch_name], (err, data) => {
                if (err) {
                    return db.rollback(() => {
                        console.error("Internal server error:", err);
                        res.status(500).json({ success: false, message: 'Internal Server Error in stock table' });
                    });
                }

                db.commit((err) => {
                    if (err) {
                        return db.rollback(() => {
                            console.error("Commit error:", err);
                            res.status(500).json({ success: false, message: 'Commit error' });
                        });
                    }

                    res.json({ success: true, message: 'Stock updated successfully' });
                });
            });
        });
    });
});

module.exports = router;