const express = require("express"); 
const router = express.Router();
const usuariofaceControllers = require('../controllers/usuariofaceControllers');

router.post('/facebooklogin', usuariofaceControllers.facebooklogin)


module.exports = router;
