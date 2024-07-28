const express = require('express');
const router = express.Router();
const db = require('../connect');

router.post("/addBranchData", (req, res) => {
    const { branchName, branchAddress } = req.body;
    const branchQuery = "INSERT INTO branch(branch_name, branch_address) VALUES(?, ?)";
    const stockQuery = "INSERT INTO stock(product_name, branch_name, opening_stock, added_stock, stock_left) SELECT product_name, ?, ?, ?, ? FROM product";

    db.beginTransaction((err) => {
        if (err) {
            console.error("Transaction error:", err);
            return res.status(500).json({ error: "Transaction error" });
        }

        db.query(branchQuery, [branchName, branchAddress], (branchErr, branchResult) => {
            if (branchErr) {
                if (branchErr.code === "ER_DUP_ENTRY") {
                    return res.status(409).json({ success: false, message: 'Branch already exists' });
                }
                return db.rollback(() => {
                    console.error("Error inserting into branch table:", branchErr);
                    res.status(500).json({ error: "Internal server error" });
                });
            }

            db.query(stockQuery, [branchName, 0, 0, 0], (stockErr, stockResult) => {
                if (stockErr) {
                    return db.rollback(() => {
                        console.error("Error inserting into stock table:", stockErr);
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

                    res.json({ success:true,message: "Branch and stock data added successfully" });
                });
            });
        });
    });
});

module.exports = router;
