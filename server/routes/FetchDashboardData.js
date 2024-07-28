const express = require('express');
const router = express.Router();
const db = require('../connect');

router.post('/fetchDashboardData/sales', (req, res) => {
  const { branch } = req.body;
  let query = "SELECT SUM(amount) AS total_amount, SUM(sales_quantity) AS total_sales FROM report";
  let params = [];

  if (branch && branch !== 'All') {
    query += " WHERE branch_name = ?";
    params.push(branch);
  }

  db.query(query, params, (err, data) => {
    if (err) {
      console.error("Internal server error", err);
      res.status(500).send("Internal server error");
    } else {
      res.json(data);
    }
  });
});

router.post('/fetchDashboardData/group', (req, res) => {
  const { paymode, branch } = req.body;
  let query = "SELECT SUM(amount) AS total_amount FROM report WHERE paymode = ?";
  let params = [paymode];

  if (branch && branch !== 'All') {
    query += " AND branch_name = ?";
    params.push(branch);
  }

  db.query(query, params, (err, data) => {
    if (err) {
      console.error("Internal server error", err);
      res.status(500).send("Internal server error");
    } else {
      res.json(data);
    }
  });
});

module.exports = router;