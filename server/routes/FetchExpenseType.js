const express = require('express');
const router = express.Router();
const db = require('../connect');

router.post('/fetchExpenseType', (req, res) => {
    const typeQuery = "SELECT * FROM expense_type";
    db.query(typeQuery, (err,data)=>{
        if (err) {
            console.error("Internal server error", err);
        } else {
            res.json(data);
        }
    })
})

module.exports = router;