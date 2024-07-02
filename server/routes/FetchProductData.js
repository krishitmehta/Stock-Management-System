const express = require('express');
const router = express.Router();
const db = require('../connect');

router.post("/fetchProductData",(req,res) => {
    const query = "SELECT product.product_name,product.product_price,stock.stock_left FROM product INNER JOIN stock on stock.product_name=product.product_name ORDER BY product.product_name";
    db.query(query, (err,data)=>{
        if (err) {
            console.error("Internal server error", err);
        } else {
            res.json(data);
        }
    })
})

module.exports = router;