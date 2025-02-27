const express = require('express');
const router = express.Router();
const db = require('../connect');

router.post('/fetchExpenseNote', (req, res) => {
    const noteQuery = "SELECT * FROM expense_note";
    db.query(noteQuery, (err,data)=>{
        if (err) {
            console.error("Internal server error", err);
        } else {
            res.json(data);
        }
    })
})

module.exports = router;