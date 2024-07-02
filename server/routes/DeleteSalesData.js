const express = require('express');
const router = express.Router();
const db = require('../connect');

router.post('/deleteSalesData', async (req, res) => {
    const { sales_id, product_name, sale_quantity } = req.body;
    const salequery = "DELETE FROM sales WHERE sales_id = ?";
    const reportquery = "DELETE FROM report WHERE sales_id = ?";
    const stockquery = "UPDATE stock SET Stock_left=stock_left+? WHERE product_name=?";
    
    db.beginTransaction((err) => {
        if (err) {
            console.error("Transaction error:", err);
            return res.status(500).json({ success: false, message: 'Transaction error' });
        }

        db.query(stockquery, [sale_quantity,product_name], (err, data) => {
            if (err) {
                return db.rollback(() => {
                    console.error("Internal server error:", err);
                    res.status(500).json({ success: false, message: 'Internal Server Error in product table' });
                });
            }

            db.query(salequery, [sales_id], (err, data) => {
                if (err) {
                    return db.rollback(() => {
                        console.error("Internal server error:", err);
                        res.status(500).json({ success: false, message: 'Internal Server Error in stock table' });
                    });
                }

                db.query(reportquery, [sales_id], (err, data) => {
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

                        res.json({ success: true, message: 'sales deleted successfully' });
                    });
                });
            });
        });
    });
});
module.exports = router;
