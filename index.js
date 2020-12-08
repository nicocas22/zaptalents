//import  express  from 'express';
const express = require("express");
const conectarDB = require("./config/db");
const passport = require("passport");
const cors = require("cors");
//Creacion de servidor
const server = express();

//conectar a la bd
conectarDB();
server.use(cors());
//Habiltiar express.json
server.use(express.json({ extended: true }));

//puerto de la app
const port = process.env.PORT || 4000;

//Login ne general
//Login Face
server.use(passport.initialize());
// import de rutas Usuario
server.use("/public", express.static(`${__dirname}/storage/usuario`));
server.use("/public/cv", express.static(`${__dirname}/storage/cv`));
server.use("/public/estudios", express.static(`${__dirname}/storage/estudios`));
server.use(
  "/public/certificados",
  express.static(`${__dirname}/storage/certificados`)
);
server.use("/public/adns", express.static(`${__dirname}/storage/adns`));
server.use("/api/usuarios", require("./routes/usuarios"));
//autenticacion
server.use("/api/auth", require("./routes/auth"));
//ruta confirmacion
server.use("/api/confirmar", require("./routes/confirmar"));
//import ruta user facebook
server.use("/api/facebooklogin", require("./routes/usuarioface"));
//google login
server.use("/api/googleauth", require("./routes/googlelogin"));
//importar rutas de trabajos
server.use("/api/trabajos", require("./routes/mistrabajos"));
//importar rutas de estudios
server.use("/api/estudios", require("./routes/estudios"));
//importar rutas de certificaciones
server.use("/api/certificacion", require("./routes/certificacion"));
//Importar ruta de AdnSap
server.use("/api/adnsap", require("./routes/adnsap"));
//arrancar app
server.listen(port,"0.0.0.0" , () => {
  console.log(`El servidor esta funcionando en el puerto ${port}`);
});

require("./handlers/email");
