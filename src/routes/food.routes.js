const express = require("express");
const multer = require("multer");
const foodController = require("../controllers/food.controller");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/", upload.single("file"), foodController.save);
router.get("/", foodController.findAll);
router.get("/search", foodController.foodSearch);
router.get("/:id", foodController.findOne);
router.put("/:id", upload.single("file"), foodController.update);
router.delete("/:id", foodController.delete);

module.exports = router;
