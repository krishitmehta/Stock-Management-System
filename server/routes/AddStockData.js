const express = require('express');
const router = express.Router();
const db = require('../connect');

router.post("/addStockData",(req,res) => {
    const {product_name,added_stock,branch_name} = req.body;
    const query = "UPDATE stock SET added_stock=added_stock+?, stock_left=stock_left+? where product_name = ? AND branch_name = ?";
    db.query(query, [added_stock,added_stock,product_name,branch_name],(err,data)=>{
        if (err) {
            console.error("Internal server error", err);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        } else {
            res.json(data);
        }
    })
})

module.exports = router;