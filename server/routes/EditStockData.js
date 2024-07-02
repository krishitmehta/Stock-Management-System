const express = require('express');
const router = express.Router();
const db = require('../connect');

router.post('/editStockData', (req, res) => {
    const { product_name, added_stock } = req.body;
    const query = "UPDATE stock SET stock_left=-added_stock+stock_left+?,added_stock=? where product_name=?";
    db.query(query,[added_stock,added_stock,product_name],(err,data)=>{
        if (err) {
            return res.status(404).json({ message: 'Product not found' });
            
        } else {
            return res.json({ message: 'Stock updated successfully' });
        }
    })
  });
module.exports=router;