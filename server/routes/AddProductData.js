const express = require('express');
const router = express.Router();
const db = require('../connect');

router.post("/addProductData", (req, res) => {
    const { product_name, product_price } = req.body;

    const stockQuery = "INSERT INTO stock(product_name, branch_name, opening_stock, added_stock, stock_left) SELECT ?,branch_name,?,?,? FROM branch";
    const productQuery = "INSERT INTO product(product_name, product_price) VALUES (?, ?)";

    db.beginTransaction((err) => {
        if (err) {
            console.error("Transaction error:", err);
            return res.status(500).json({ error: "Transaction error" });
        }

        db.query(stockQuery, [product_name, 0, 0, 0], (stockErr, stockResult) => {
            if (stockErr) {
                return db.rollback(() => {
                    console.error("Error inserting into stock table:", stockErr);
                    res.status(500).json({ error: "Internal server error" });
                });
            }

            db.query(productQuery, [product_name, product_price], (productErr, productResult) => {
                if (productErr) {
                    return db.rollback(() => {
                        console.error("Error inserting into product table:", productErr);
                        res.status(500).json({ error: "Internal server error" });
                    });
                }

                db.commit((commitErr) => {
                    if (commitErr) {
                        return db.rollback(() => {
                            console.error("Commit error:", commitErr);
                            res.status(500).json({ error: "Commit error" });
                        });
                    }

                    res.json({ message: "Product added successfully" });
                });
            });
        });
    });
});

module.exports = router;