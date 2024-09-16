-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 16, 2024 at 06:12 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sherepunjaab`
--

-- --------------------------------------------------------

--
-- Table structure for table `branch`
--

CREATE TABLE `branch` (
  `branch_name` text NOT NULL,
  `branch_address` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `branch`
--

INSERT INTO `branch` (`branch_name`, `branch_address`) VALUES
('NAVSARI', 'ABC, 123');

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `product_name` text NOT NULL,
  `product_price` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`product_name`, `product_price`) VALUES
('BLUEBERRY LASSI', 35),
('CHOCOLATE LASSI', 30);

-- --------------------------------------------------------

--
-- Table structure for table `report`
--

CREATE TABLE `report` (
  `product_name` text NOT NULL,
  `branch_name` text NOT NULL,
  `date` date NOT NULL,
  `sales_quantity` int(255) NOT NULL,
  `price` int(255) NOT NULL,
  `amount` int(255) NOT NULL,
  `sales_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `report`
--

INSERT INTO `report` (`product_name`, `branch_name`, `date`, `sales_quantity`, `price`, `amount`, `sales_id`) VALUES
('CHOCOLATE LASSI', 'NAVSARI', '2024-09-16', 20, 30, 600, 23),
('CHOCOLATE LASSI', 'NAVSARI', '2024-09-16', 10, 30, 300, 24),
('BLUEBERRY LASSI', 'NAVSARI', '2024-09-16', 20, 35, 700, 25),
('CHOCOLATE LASSI', 'NAVSARI', '2024-09-16', 30, 30, 900, 26);

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `sales_id` int(11) NOT NULL,
  `product_name` text NOT NULL,
  `branch_name` text NOT NULL,
  `date` date NOT NULL DEFAULT current_timestamp(),
  `sale_quantity` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sales`
--

INSERT INTO `sales` (`sales_id`, `product_name`, `branch_name`, `date`, `sale_quantity`) VALUES
(3, 'CHOCOLATE LASSI', 'PANCH HATTDI', '2024-08-17', 0),
(4, 'CHOCOLATE LASSI', 'PANCH HATTDI', '2024-08-17', 100),
(5, 'CHOCOLATE LASSI', 'PANCH HATTDI', '2024-08-23', 40),
(6, 'CHOCOLATE LASSI', 'PANCH HATTDI', '2024-08-23', 0),
(7, 'MANGO SHAKE', 'ASHAPURI', '2024-08-23', 10),
(8, 'CHOCOLATE LASSI', 'PANCH HATTDI', '2024-09-09', 0),
(9, 'CHOCOLATE LASSI', 'PANCH HATTDI', '2024-09-09', 20),
(10, 'CHOCOLATE LASSI', 'PANCH HATTDI', '2024-09-09', 20),
(11, 'CHOCOLATE LASSI', 'ASHAPURI', '2024-09-09', 10);

-- --------------------------------------------------------

--
-- Table structure for table `stock`
--

CREATE TABLE `stock` (
  `product_name` text NOT NULL,
  `branch_name` text NOT NULL,
  `date` date NOT NULL DEFAULT current_timestamp(),
  `opening_stock` int(255) NOT NULL,
  `added_stock` int(255) NOT NULL,
  `stock_left` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stock`
--

INSERT INTO `stock` (`product_name`, `branch_name`, `date`, `opening_stock`, `added_stock`, `stock_left`) VALUES
('CHOCOLATE LASSI', 'NAVSARI', '2024-09-16', 0, 40, 10),
('BLUEBERRY LASSI', 'NAVSARI', '2024-09-16', 0, 30, 10);

-- --------------------------------------------------------

--
-- Table structure for table `task_status`
--

CREATE TABLE `task_status` (
  `id` int(11) NOT NULL,
  `task_name` varchar(255) NOT NULL,
  `last_run_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `task_status`
--

INSERT INTO `task_status` (`id`, `task_name`, `last_run_date`) VALUES
(1, 'daily_stock_update', '2024-09-16');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` int(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `useremp`
--

CREATE TABLE `useremp` (
  `name` text NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` int(10) NOT NULL,
  `branch_name` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `branch`
--
ALTER TABLE `branch`
  ADD PRIMARY KEY (`branch_name`(255));

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`product_name`(255));

--
-- Indexes for table `report`
--
ALTER TABLE `report`
  ADD PRIMARY KEY (`sales_id`);

--
-- Indexes for table `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`sales_id`);

--
-- Indexes for table `task_status`
--
ALTER TABLE `task_status`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `useremp`
--
ALTER TABLE `useremp`
  ADD PRIMARY KEY (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `report`
--
ALTER TABLE `report`
  MODIFY `sales_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
  MODIFY `sales_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `task_status`
--
ALTER TABLE `task_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;