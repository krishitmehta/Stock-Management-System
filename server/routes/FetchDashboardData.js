const express = require('express');
const router = express.Router();
const db = require('../connect');

router.post('/fetchDashboardData/sales',(req,res) => {
    const query = "SELECT SUM(amount) AS total_amount, SUM(sales_quantity) AS total_sales FROM report"
    db.query(query,(err,data) => {
        if(err){
            console.error("Internal server error", err);
        }
        else{
            res.json(data);
        }
    })
})

router.post('/fetchDashboardData/group',(req,res) => {
    const {paymode} = req.body;
    const query = "SELECT SUM(amount) AS total_amount FROM report WHERE paymode=?"
    db.query(query,[paymode],(err,data) => {
        if(err){
            console.error("Internal server error", err);
        }
        else{
            res.json(data);
        }
    })
})

module.exports = router;