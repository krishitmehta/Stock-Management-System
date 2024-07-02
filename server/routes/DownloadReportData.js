const express = require('express');
const router = express.Router();
const db = require('../connect');
const fastcsv = require('fast-csv');
const fs = require('fs');

router.post("/downloadReportData",(req,res)=>{
    const query = "SELECT product_name,date,sales_quantity,price,amount,paymode FROM report";
    db.query(query,(err,data)=>{
        if(err){
            console.error("Internal server error", err);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
        else{
            const ws = fs.createWriteStream('products.csv');
                fastcsv
                    .write(data, { headers: true })
                    .pipe(ws)
                    .on('finish', () => {
                    res.download('products.csv', 'products.csv', (err) => {
                    if (err) {
                        console.error('Error downloading file:', err);
                        res.status(500).send('Error downloading file');
                    }
                    fs.unlinkSync('products.csv');
                });
            });
        }
    })
})

module.exports = router;