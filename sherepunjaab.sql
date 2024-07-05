-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 05, 2024 at 08:21 AM
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
('NAVSARI', 'XYZ,123456'),
('SURAT', 'ABC,789654');

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
('BANANA JUICE', 30),
('BANANA MILKSHAKE', 70),
('BANANA SMOOTHE', 35),
('BLUEBERRY LASSI', 35),
('CHICKOO JUICE', 30),
('CHICO JUICE', 40),
('CHOCOLATE LASSI', 25),
('MANGO LASSI', 45),
('MANGO MILKSHAKE', 30),
('MANGO SHAKE', 25),
('PINEAPPLE LASSI', 30);

-- --------------------------------------------------------

--
-- Table structure for table `report`
--

CREATE TABLE `report` (
  `product_name` text NOT NULL,
  `date` date NOT NULL,
  `sales_quantity` int(255) NOT NULL,
  `price` int(255) NOT NULL,
  `amount` int(255) NOT NULL,
  `paymode` text NOT NULL,
  `sales_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `report`
--

INSERT INTO `report` (`product_name`, `date`, `sales_quantity`, `price`, `amount`, `paymode`, `sales_id`) VALUES
('BANANA JUICE', '2024-06-11', 30, 20, 600, 'Zomato', 24),
('BANANA JUICE', '2024-06-14', 20, 20, 400, 'Zomato', 25),
('PINEAPPLE LASSI', '2024-06-14', 30, 30, 900, 'Cash', 27),
('BANANA JUICE', '2024-06-14', 20, 30, 600, 'Online', 28),
('BANANA JUICE', '2024-06-14', 30, 30, 900, 'Online', 29),
('BLUEBERRY LASSI', '2024-07-05', 5, 35, 175, 'Cash', 30);

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `sales_id` int(11) NOT NULL,
  `product_name` text NOT NULL,
  `date` date NOT NULL DEFAULT current_timestamp(),
  `sale_quantity` int(255) NOT NULL,
  `paymode` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sales`
--

INSERT INTO `sales` (`sales_id`, `product_name`, `date`, `sale_quantity`, `paymode`) VALUES
(24, 'BANANA JUICE', '2024-06-11', 30, 'Zomato'),
(25, 'BANANA JUICE', '2024-06-14', 20, 'Zomato'),
(27, 'PINEAPPLE LASSI', '2024-06-14', 30, 'Cash'),
(28, 'BANANA JUICE', '2024-06-14', 20, 'Online'),
(29, 'BANANA JUICE', '2024-06-14', 30, 'Online'),
(30, 'BLUEBERRY LASSI', '2024-07-05', 5, 'Cash');

-- --------------------------------------------------------

--
-- Table structure for table `stock`
--

CREATE TABLE `stock` (
  `product_name` text NOT NULL,
  `date` date NOT NULL DEFAULT current_timestamp(),
  `opening_stock` int(255) NOT NULL,
  `added_stock` int(255) NOT NULL,
  `stock_left` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stock`
--

INSERT INTO `stock` (`product_name`, `date`, `opening_stock`, `added_stock`, `stock_left`) VALUES
('BANANA JUICE', '2024-06-11', 125, 0, 125),
('BANANA MILKSHAKE', '2024-06-11', 0, 0, 0),
('BANANA SMOOTHE', '2024-06-11', 32, 0, 32),
('BLUEBERRY LASSI', '2024-06-05', 13, 0, 8),
('CHICKOO JUICE', '2024-06-11', 0, 0, 0),
('CHICO JUICE', '2024-06-11', 0, 0, 0),
('CHOCOLATE LASSI', '2024-06-05', 0, 0, 0),
('MANGO LASSI', '2024-06-05', 0, 0, 0),
('MANGO MILKSHAKE', '2024-06-11', 0, 0, 0),
('MANGO SHAKE', '2024-06-05', 1, 0, 1),
('PINEAPPLE LASSI', '2024-06-11', 4, 0, 4);

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
(1, 'daily_stock_update', '2024-07-05');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` int(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`username`, `password`, `role`) VALUES
('admin@gmail.com', '$2b$10$LeFr/ZsPRIzEhtjMRdiAWuqBGeaMzvuDzI5SZ5u0NC3SRDJx2q5Pi', 0);

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
-- Dumping data for table `useremp`
--

INSERT INTO `useremp` (`name`, `email`, `phone`, `branch_name`) VALUES
('HET SHAH', 'hetshah17003@gmail.com', 2147483647, 'NAVSARI'),
('KRISHIT MEHTA', 'krishitajbani@gmail.com', 2147483647, 'SURAT');

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
-- Indexes for table `stock`
--
ALTER TABLE `stock`
  ADD PRIMARY KEY (`product_name`(255));

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
  MODIFY `sales_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
  MODIFY `sales_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `task_status`
--
ALTER TABLE `task_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
