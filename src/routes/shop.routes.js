const express = require("express");
const multer = require("multer");
const shopController = require("../controllers/shop.controller");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/", upload.single("file"), shopController.create);
router.get("/", shopController.findAll);
router.get("/search", shopController.search);
router.get("/:id", shopController.findOne);
router.put("/:id", upload.single("file"), shopController.update);
router.delete("/:id", shopController.delete);

module.exports = router;
