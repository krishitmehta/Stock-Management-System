const express = require('express');
const router = express.Router();
const db = require('../connect');

router.post("/addExpenseData", (req, res) => {
    const {expense_type, expense_note}= req.body
    const expenseTypeQuery = "INSERT INTO expense_type (cash,gpay,zomato,expenses) VALUES (?,?,?,?)"
    const expenseNoteQuery = "INSERT INTO expense_note (note,amount) VALUES ?"
    db.beginTransaction((err) => {
        if (err) {
            console.error("Transaction error:", err);
            return res.status(500).json({ error: "Transaction error" });
        }
        db.query(expenseTypeQuery, [expense_type.cash,expense_type.gpay,expense_type.zomato,expense_type.expenses], (err, data) => {
            if (err) {
                return db.rollback(() => {
                    console.error("Internal server error:", err);
                    res.status(500).json({ success: false, message: 'Internal Server Error in expense_type table' });
                });
            }
            const expenseValues = expense_note.map(expense => [expense.note, expense.price]);
            db.query(expenseNoteQuery, [expenseValues], (err, data) => {
                if (err) {
                    return db.rollback(() => {
                        console.error("Internal server error:", err);
                        res.status(500).json({ success: false, message: 'Internal Server Error in expense_note table' });
                    });
                }
        
                db.commit((err) => {
                    if (err) {
                        return db.rollback(() => {
                            console.error("Commit error:", err);
                            res.status(500).json({ success: false, message: 'Commit error' });
                        });
                    }
        
                    res.json({ success: true, message: 'Stock and expenses updated successfully' });
                });
            });
        });
    });
});

module.exports = router;
