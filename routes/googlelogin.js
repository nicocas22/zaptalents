const express = require('express');
const router = express.Router();

//import controlador
const usergooglecontroller = require('../controllers/usergooglecontroller');

router.post('/googlelogin', usergooglecontroller.googlelogin );

module.exports = router;