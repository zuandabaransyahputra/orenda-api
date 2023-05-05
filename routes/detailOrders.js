var express = require("express");
var router = express.Router();
const detailOrderController = require("../controllers/detailOrders");

/* GET users listing. */
router.get("/", detailOrderController.findAll);

module.exports = router;
