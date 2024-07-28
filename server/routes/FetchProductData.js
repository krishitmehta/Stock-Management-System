const express = require('express');
const router = express.Router();
const db = require('../connect');

router.post("/fetchProductData",(req,res) => {
    const query = "SELECT product_name,product_price FROM product";
    db.query(query, (err,data)=>{
        if (err) {
            console.error("Internal server error", err);
        } else {
            res.json(data);
        }
    })
})

module.exports = router;