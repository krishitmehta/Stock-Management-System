const express = require('express');
const router = express.Router();
const db = require('../connect');

router.post("/addSaleData", (req, res) => {
    const { product_name, sale_quantity, branch_name } = req.body; // Include branch_name
    console.log('Received data:', { product_name, sale_quantity, branch_name });

    const addsalequery = "INSERT INTO sales(product_name, sale_quantity, branch_name) VALUES (?, ?, ?)";
    const stockleftquery = "UPDATE stock SET stock_left = stock_left - ? WHERE product_name = ? AND stock_left >= ? AND branch_name=?";
    const reportquery = `INSERT INTO report(sales_id, product_name, date, sales_quantity, price, amount, branch_name) 
                         SELECT sales.sales_id, product.product_name, DATE(sales.date) AS date, sales.sale_quantity, 
                                product.product_price, product.product_price * sales.sale_quantity AS amount, sales.branch_name 
                         FROM product 
                         INNER JOIN sales ON sales.product_name = product.product_name 
                         WHERE sales.sales_id = ?`;

    db.beginTransaction((err) => {
        if (err) {
            console.error("Transaction error:", err);
            return res.status(500).json({ success: false, message: 'Transaction error' });
        }

        db.query(stockleftquery, [sale_quantity, product_name, sale_quantity, branch_name], (err, data) => {
            if (err) {
                return db.rollback(() => {
                    console.error("Stock update error:", err);
                    res.status(500).json({ success: false, message: 'Internal Server Error' });
                });
            } else if (data.affectedRows === 0) {
                return db.rollback(() => {
                    console.log('Insufficient stock for product:', product_name, 'at branch:', branch_name);
                    res.json({ success: false, message: 'Insufficient Stock' });
                });
            } else {
                db.query(addsalequery, [product_name, sale_quantity, branch_name], (err, result) => {
                    if (err) {
                        return db.rollback(() => {
                            console.error("Sales insert error:", err);
                            res.status(500).json({ success: false, message: 'Internal Server Error' });
                        });
                    } else {
                        const sales_id = result.insertId; // Get the last inserted sale ID
                        console.log('Sales entry added with ID:', sales_id);

                        db.query(reportquery, [sales_id], (err, data) => {
                            if (err) {
                                return db.rollback(() => {
                                    console.error("Report insert error:", err);
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

                                    console.log('Report added successfully for sales ID:', sales_id);
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
