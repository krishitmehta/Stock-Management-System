const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const cron = require('node-cron');
const moment = require('moment-timezone');
const db = require('./connect');
const authRoutes = require('./routes/FetchAuth');
const fetchReportData = require('./routes/FetchReportData');
const fetchDashboardData = require('./routes/FetchDashboardData');
const fetchProductData = require('./routes/FetchProductData');
const fetchStockData = require('./routes/FetchStockData');
const addAuth = require('./routes/AddAuth');
const addProductData = require('./routes/AddProductData');
const addStockData = require('./routes/AddStockData');
const addSaleData = require('./routes/AddSaleData');
const fetchSaleData = require('./routes/FetchSaleData');
const addBranchData = require('./routes/AddBranchData');
const fetchBranchData = require('./routes/FetchBranchData');
const addUserData = require('./routes/AddUserData');
const fetchUserData = require('./routes/FetchUserData');
const deleteProductData = require('./routes/DeleteProductData');
const downloadReportData = require('./routes/DownloadReportData');
const editProductPrice = require('./routes/EditProductPrice');
const deleteSalesData = require('./routes/DeleteSalesData');
const deleteBranchData = require('./routes/DeleteBranchData');
const app = express();

app.use(cors());
app.use(express.json());

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api', fetchReportData);
app.use('/api', fetchDashboardData);
app.use('/api', fetchProductData);
app.use('/api', fetchStockData);
app.use('/api/auth', addAuth);
app.use('/api', addProductData);
app.use('/api', addStockData);
app.use('/api', addSaleData);
app.use('/api', fetchSaleData);
app.use('/api', addBranchData);
app.use('/api', fetchBranchData);
app.use('/api', fetchUserData);
app.use('/api', addUserData);
app.use('/api', deleteProductData);
app.use('/api', downloadReportData);
app.use('/api', editProductPrice);
app.use('/api', deleteSalesData);
app.use('/api', deleteBranchData);

const port = process.env.PORT || 5000;

const runDailyQuery = () => {
  const query = "UPDATE stock SET opening_stock = stock_left, added_stock = 0 WHERE product_name IS NOT NULL";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error running the query:", err);
    } else {
      console.log("Query ran successfully, affected rows:", results.affectedRows);

      const updateFlagQuery = "UPDATE task_status SET last_run_date = CURDATE() WHERE task_name = 'daily_stock_update'";
      db.query(updateFlagQuery, (err, results) => {
        if (err) {
          console.error("Error updating the task status:", err);
        } else {
          console.log("Task status updated successfully.");
        }
      });
    }
  });
};

const checkAndRunDailyTask = () => {
  const tz = 'Asia/Kolkata';
  const now = moment().tz(tz).format('YYYY-MM-DD');

  const checkQuery = "SELECT last_run_date FROM task_status WHERE task_name = 'daily_stock_update'";
  db.query(checkQuery, (err, results) => {
    if (err) {
      console.error("Error checking the task status:", err);
    } else {
      const lastRunDate = results.length > 0 ? results[0].last_run_date : null;
      
      if (!lastRunDate || moment(lastRunDate).format('YYYY-MM-DD') < now) {
        console.log(`Last run date: ${lastRunDate}, current date: ${now}. Running the daily task...`);
        runDailyQuery();
      } else {
        console.log(`Daily task already run today.`);
      }
    }
  });
};

cron.schedule('0 0 * * *', () => {
  const tz = 'Asia/Kolkata';
  const now = moment().tz(tz).format();
  console.log(`Scheduled task is about to run at midnight (${tz}):`, now);
  runDailyQuery();
}, {
  scheduled: true,
  timezone: 'Asia/Kolkata'
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log('Checking and running daily task if needed...');
  checkAndRunDailyTask();
});
