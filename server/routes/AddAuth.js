const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../connect');
const saltRounds = 10;

router.post("/signup", (req, res) => {
    const { email, password } = req.body;
    bcrypt.hash(password, saltRounds, function(err, hash) {
        if (err) {
            console.error('Error hashing password:', err);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
            return;
        }
        const hashedPassword = hash; // Store the hashed password in a new variable
        const query = "INSERT INTO user(username, password, role) VALUES (?, ?, ?)";
        db.query(query, [email, hashedPassword, 0], (err, data) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    return res.json({ success: false, message: 'User already exists' });
                }
                console.error('MySQL Query Error:', err);
                return res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
            return res.json({ success: true, message: 'User created successfully' });
        });
    });
});
module.exports = router;