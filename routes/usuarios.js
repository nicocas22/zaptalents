//Rutas para crear usuario
const express = require("express");
const router = express.Router();
const usuarioControllers = require("../controllers/usuariosControllers");
const upload = require('../libs/storage');
//Crea usuario
//Api/usuarios
router.post("/", usuarioControllers.crearUsuarios);

router.get(
  "/:idUsuario",
  usuarioControllers.mostarUsuarios
);

router.put(
  "/:iduser",
  upload.single("imageURL"),
  usuarioControllers.putUsuario
);

module.exports = router;
