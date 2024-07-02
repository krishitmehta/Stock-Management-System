const express = require('express');
const router = express.Router();
const db = require('../connect');

router.post('/editProductPrice', (req, res) => {
    const { product_name, new_price } = req.body;
    const query = "UPDATE product SET product_price=? where product_name=?";
    db.query(query,[new_price,product_name],(err,data)=>{
        if (err) {
            return res.status(404).json({ message: 'Product not found' });
            
        } else {
            return res.json({ message: 'Product price updated successfully' });
        }
    })
  });
module.exports=router;