const express = require('express');
const router = express.Router();
const db = require('../connect');

router.post("/addSaleData", (req, res) => {
    const { product_name, sale_quantity, paymode } = req.body;
    const addsalequery = "INSERT INTO sales(product_name, sale_quantity, paymode) VALUES (?, ?, ?)";
    const stockleftquery = "UPDATE stock SET stock_left = stock_left - ? WHERE product_name = ? AND stock_left >= ?";
    const reportquery = `INSERT INTO report(sales_id, product_name, date, sales_quantity, price, amount, paymode)
                         SELECT sales.sales_id, product.product_name, DATE(sales.date) AS date, sales.sale_quantity,
                                product.product_price, product.product_price * sales.sale_quantity AS amount, sales.paymode
                         FROM product
                         INNER JOIN sales ON sales.product_name = product.product_name
                         WHERE sales.sales_id = ?`;

    db.beginTransaction((err) => {
        if (err) {
            console.error("Transaction error:", err);
            return res.status(500).json({ success: false, message: 'Transaction error' });
        }

        db.query(stockleftquery, [sale_quantity, product_name, sale_quantity], (err, data) => {
            if (err) {
                return db.rollback(() => {
                    console.error("Internal server error:", err);
                    res.status(500).json({ success: false, message: 'Internal Server Error' });
                });
            } else if (data.affectedRows === 0) {
                return db.rollback(() => {
                    res.json({ success: false, message: 'Insufficient Stock' });
                });
            } else {
                db.query(addsalequery, [product_name, sale_quantity, paymode], (err, result) => {
                    if (err) {
                        return db.rollback(() => {
                            console.error("Internal server error:", err);
                            res.status(500).json({ success: false, message: 'Internal Server Error' });
                        });
                    } else {
                        const sales_id = result.insertId; // Get the last inserted sale ID

                        db.query(reportquery, [sales_id], (err, data) => {
                            if (err) {
                                return db.rollback(() => {
                                    console.error("Internal server error:", err);
                                    res.status(500).json({ success: false, message: 'Internal Server Error' });
                                });
                            } else {
                                db.commit((err) => {
                                    if (err) {
                                        return db.rollback(() => {
                                            console.error("Commit error:", err);
                                            res.status(500).json({ success: false, message: 'Commit error' });
                                        });
                                    }

                                    res.json({ success: true, message: 'Report added successfully' });
                                });
                            }
                        });
                    }
                });
            }
        });
    });
});

module.exports = router;
