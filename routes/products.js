var express = require("express");
var router = express.Router();
const productController = require("../controllers/products");

/* GET users listing. */
router.get("/", productController.findAll);
router.post("/", productController.create);
router.get("/:id", productController.findById);
router.put("/:id", productController.update);
router.delete("/:id", productController.delete);

module.exports = router;
