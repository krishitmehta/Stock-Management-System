const express = require('express');
const router = express.Router();
const db = require('../connect');

router.post("/fetchSaleData",(req,res) => {
    const query = "SELECT sales_id,product_name,DATE(date) AS date,sale_quantity,paymode FROM sales";
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