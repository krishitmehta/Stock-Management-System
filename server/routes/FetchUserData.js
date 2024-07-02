const express = require('express');
const router = express.Router();
const db = require('../connect');

router.post("/fetchUserData",(req,res) => {
    const query = "SELECT name,email,phone,branch_name FROM useremp ORDER BY name";
    db.query(query, (err,data)=>{
        if (err) {
            console.error("Internal server error", err);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        } else {
            res.json(data);
        }
    })
})

module.exports = router;