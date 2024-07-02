const express = require('express');
const router = express.Router();
const db = require('../connect');

router.post("/addUserData",(req,res) => {
    const {name, email, phone, branchName} = req.body
    const query = "INSERT INTO useremp(name,email,phone,branch_name) VALUES(?,?,?,?)";
    db.query(query, [name, email, phone, branchName],(err,data)=>{
        if (err) {
            console.error("Internal server error", err);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        } else {
            res.json({ success: true, message: 'User added successfully' });
        }
    })
})

module.exports = router;