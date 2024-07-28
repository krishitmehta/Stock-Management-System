const express = require('express');
const router = express.Router();
const db = require('../connect');

router.post("/deleteBranchData", (req, res) => {
    const { branch_name } = req.body;
    const branchquery = "DELETE FROM branch WHERE branch_name = ?";
    const stockquery = "DELETE FROM stock WHERE branch_name = ?";

    db.beginTransaction((err) => {
        if (err) {
            console.error("Transaction error:", err);
            return res.status(500).json({ success: false, message: 'Transaction error' });
        }

        db.query(branchquery, [branch_name], (err, data) => {
            if (err) {
                return db.rollback(() => {
                    console.error("Internal server error:", err);
                    res.status(500).json({ success: false, message: 'Internal Server Error in product table' });
                });
            }

            db.query(stockquery, [branch_name], (err, data) => {
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

                    res.json({ success: true, message: 'Branch deleted successfully' });
                });
            });
        });
    });
});

module.exports = router;
