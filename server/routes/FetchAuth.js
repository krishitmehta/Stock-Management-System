const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../connect');
router.post("/login", (req, res) => {
    const { email, password } = req.body;
    const query = "SELECT * FROM user WHERE username=?";
    db.query(query, [email], (err, data) => {
        if (err) {
            console.error('MySQL Query Error:', err);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
            return;
        }
        if (data.length === 0) {
            res.json({ success: false, message: 'User not found' });
            return;
        }
        const hashedPasswordFromDB = data[0].password;
        bcrypt.compare(password, hashedPasswordFromDB, function(err, result) {
            if (err) {
                console.error('Error comparing passwords:', err);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
                return;
            }
            if (result) {
                res.json({ success: true, message: 'Login successful' });
            } else {
                res.json({ success: false, message: 'Invalid username or password' });
            }
        });
    });
});

module.exports = router;