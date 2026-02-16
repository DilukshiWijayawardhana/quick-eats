const authRoutes = require("./auth.routes");
const foodRoutes = require("./food.routes");
const shopRoutes = require("./shop.routes");
const orderRoutes = require("./order.routes");
const express = require("express");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/food", foodRoutes);
router.use("/shop", shopRoutes);
router.use("/orders", orderRoutes);

module.exports = router;
