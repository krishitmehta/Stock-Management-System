const express = require('express');
const router = express.Router();
const db = require('../connect');

router.post("/fetchStockData",(req,res) => {
    const query = "SELECT stock.product_name,branch_name,opening_stock,product_price FROM stock INNER JOIN product ON product.product_name=stock.product_name ORDER BY product_name";
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