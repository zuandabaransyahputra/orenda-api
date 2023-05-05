var express = require("express");
var router = express.Router();
const customerController = require("../controllers/customers");

/* GET users listing. */
router.get("/", customerController.findAll);
router.post("/", customerController.create);
router.get("/:id", customerController.findById);
router.put("/:id", customerController.update);
router.delete("/:id", customerController.delete);

module.exports = router;
