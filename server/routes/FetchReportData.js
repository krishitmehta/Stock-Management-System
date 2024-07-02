const express = require('express');
const router = express.Router();
const db = require('../connect');

router.post("/fetchReportData",(req,res) => {
    const query = "SELECT product_name,date,sales_quantity,price,amount,paymode FROM report ORDER BY sales_id DESC";
    db.query(query, (err,data)=>{
        if (err) {
            console.error("Internal server error", err);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        } else {
            res.json(data);
        }
    })
})

module.exports = router;