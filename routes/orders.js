var express = require('express');
var router = express.Router();
const { create, findAll } = require('../controllers/orders');

/* GET users listing. */
router.get('/', findAll);
router.post('/', create);

module.exports = router;
