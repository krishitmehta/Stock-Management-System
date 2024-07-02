const express = require('express');
const router = express.Router();
const db = require('../connect');

router.post("/fetchBranchData", (req,res)=>{
    const query = "SELECT branch_name,branch_address FROM branch ORDER BY branch_name";
    db.query(query,(err,data)=>{
        if(err){
            console.log(err);
            res.status(500).json({success: false,message: "Internal server Error"})
        }
        else{
            res.json(data);
        }
    })
})

module.exports = router;