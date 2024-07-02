const express = require('express');
const router = express.Router();
const db = require('../connect');

router.post("/deleteProductData", (req, res) => {
    const { product_name } = req.body;
    const productquery = "DELETE FROM product WHERE product_name = ?";
    const stockquery = "DELETE FROM stock WHERE product_name = ?";

    db.beginTransaction((err) => {
        if (err) {
            console.error("Transaction error:", err);
            return res.status(500).json({ success: false, message: 'Transaction error' });
        }

        db.query(productquery, [product_name], (err, data) => {
            if (err) {
                return db.rollback(() => {
                    console.error("Internal server error:", err);
                    res.status(500).json({ success: false, message: 'Internal Server Error in product table' });
                });
            }

            db.query(stockquery, [product_name], (err, data) => {
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

                    res.json({ success: true, message: 'Product deleted successfully' });
                });
            });
        });
    });
});

module.exports = router;
