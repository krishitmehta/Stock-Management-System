const express = require('express');
const router = express.Router();
const db = require('../connect');

router.post("/addBranchData", (req,res)=>{
    const {branchName,branchAddress} = req.body;
    const query = "INSERT INTO branch(branch_name,branch_address) VALUES(?,?)";
    db.query(query,[branchName,branchAddress],(err,data)=>{
        if(err){
            if (err.code === "ER_DUP_ENTRY") {
                return res.json({ success: false, message: 'Branch already exists' });
            }
            console.log(err);
            return res.status(500).json({success: false,message: "Internal server Error"})
        }
        else{
            res.json({success: true, message: "Branch Added successfully"});
        }
    })
})

module.exports = router;