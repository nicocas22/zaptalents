const Usuario = require("../models/usuario");
const bcryptjs = require("bcryptjs");
const fs = require("fs").promises;
const jwt = require("jsonwebtoken");
const enviarEmail = require("../handlers/email");
const juice = require("juice");

exports.crearUsuarios = async (req, res) => {
  //extraer email y pass
  const { email, password } = req.body;

  try {
    // //Revisar el usuario registrado sea unico
    let usuario = await Usuario.findOne({ email });

    // console.log(req.body);
    if (usuario) {
      return res
        .status(400)
        .json({ msg: "El email ya se encuentra registrado" });
    }

    //Crear nuevo usuario
    usuario = new Usuario(req.body);

    //Hasheo de pass
    const salt = await bcryptjs.genSalt(15);
    usuario.password = await bcryptjs.hash(password, salt);

    //guardar nuevo usuario
    await usuario.save();

    //Creacion y firma de JWT
    const payload = {
      usuario: {
        id: usuario.id,
      },
    };

    //Firma jwt
    jwt.sign(
      payload,
      process.env.SECRETA,
      {
        expiresIn: 3600000,
      },
      (error, token) => {
        if (error) throw error;

        //mensaje de confirmacion
        res.json({ token });
      }
    );

    //Crear URL de confirmacion
    // const confirmarUrl = `http://${req.headers.host}/api/confirmar/${email}`;
    const confirmarUrl = `http://zaptalent.cl/login-register`;
    //crear objeto usuario
    const userconfi = {
      email,
    };
    //Enviar email
    await enviarEmail.enviar({
      userconfi,
      subject: "Confirma tu Cuenta de ZapTalent",
      confirmarUrl,
      archivo: juice(`<!doctype html>
      <div>
      <div style="width: 100%; margin-left: 6%; display: flex;align-items: center; justify-content: center;  ">
          <div style="background-color: rgb(255, 255, 255); box-shadow: whitesmoke;  display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 200px;
          width: 60%;
          box-shadow: rgba(243, 243, 243, 0.788) 2px 3px 2px 2px; 
          border-radius: 10px;
          border-color: rgb(250, 125, 125);
          margin-left: 30%;
          ">
             
              <div > <h3 style="margin-left: 25%; color: rgb(35, 86, 255); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 25px;"><b>¡Ya casi!</b></h3><p style="color: grey;display: flex; align-items: center; justify-content: center;">Activa tu cuenta SAPTalent y encuentra el</p>
              <p style="color: grey;display: flex; align-items: center; justify-content: center; margin-left: 25%;">trabajo ideal para ti</p>  <div style="display: flex;align-items: center; justify-content: center">
         <div style="margin-left: 20%;">
                      <a href="${confirmarUrl}"><button type="button" class="btn btn-primary" style="margin-left: 250px; background-color: rgb(49, 97, 255); margin: 10px; font-size: 14px; color: whitesmoke; border-radius: 5px; height: 35px; border: transparent; font-family:'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif ;">Activar mi cuenta</button> </a>
                  </div>     </div>     
              </div>
             
            
          </div>
      </div>
      <div class="footer">
          <p style="color: grey; font-weight: 800; ">® SAPTalent 2020 - Todos los derechos reservados</p>
          <p style="color: grey; font-weight: 800; ">Barros Borgoño #110 - Of 1003 Providencia, Santiago </p>
          <p style="color: grey; font-weight: 800; "> Teléfono + 562 323 6789</p>
          <img class="footer-help" src="../assets/images/SAPTalent/Logotipo-SAPTalent-original.svg" alt="">
      </div></div>`),
    });

    console.log("Correo de confirmacion enviado por favor Confirme su correo");
  } catch (error) {
    console.log(error);
    res.status(400).send("hubo un error");
  }
};

exports.mostarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findById(req.params.idUsuario);

    if (!usuarios) {
      res.status(400).json({ msg: "Usuario no existe" });
    }

    res.json({ usuarios });
  } catch (error) {
    console.log(error);
  }
};

exports.putUsuario = async (req, res) => {
  console.log(req.file);
  const {
    rut,
    passport,
    nombres,
    apellidos,
    phone,
    email,
    passwordActual,
    password,
    ecivil,
    comuna,
    region,
    direccion,
    nacion,
    sexo,
    consultor,
    anosExp,
    anosZap,
    registro,
    habilidades,
  } = req.body;

  try {
    const iduser = req.params.iduser;
    await Usuario.findById(iduser, function (err, usuario) {
      if (password) {
        const passant = usuario.password;
        bcryptjs.compare(passwordActual, passant, (err, resultado) => {
          console.log(err);
          if (err) return res.status(500).json({ msg: "Error en el servidor" });

          if (resultado === true) {
            usuario.password = bcryptjs.hashSync(
              password,
              bcryptjs.genSaltSync(15)
            );
            usuario.save(function (err) {
              if (err) {
                return res.status(500).json({ msg: "Error en el servidor" });
              }
              res
                .status(200)
                .json({ msg: "Contraseña actualizada correctamente" });
            });
          } else {
            return res.status(470).json({ msg: "Contraseña incorrecta" });
          }
        });
      } else {
        //Eliminacion Imagen y Archivo anterior
        if (req.file) {
          console.log(req.file.mimetype.substring(0, 2));
          if (req.file.mimetype.substring(0, 3) === "ima") {
            console.log("imagen");
            if (usuario.imageURL === undefined) {
              //subida de imagen
              if (req.file) {
                const { filename } = req.file;
                usuario.setImgUrl(filename);
              }
            } else {
              var str = usuario.imageURL;
              var tr = usuario.imageURL.length;
              var ur = str.substr(28, tr.length);
              var stor =
                "C:/Users/Abraham/Desktop/SapReact/Server/storage/usuario";
              fs.unlink(stor.concat(ur))
                .then(() => {
                  console.log("File removed");
                })
                .catch((err) => {
                  console.log(err);
                  console.error(
                    "Something wrong happened removing the file",
                    err
                  );
                });
              console.log(req.file.type);
              console.log(req.file);
              if (req.file) {
                const { filename } = req.file;
                usuario.setImgUrl(filename);
              }
            }
          } else {
            console.log("funcion entra con todo");
            if (usuario.cvURL === undefined || usuario.cvURL === null) {
              //subida de imagen
              if (req.file) {
                const { filename } = req.file;
                usuario.setCvUrl(filename);
              }
              console.log("funcion entra con todo 2");
            } else {
              console.log("funcion entra con todo 3");
              var str = usuario.cvURL;
              var tr = usuario.cvURL.length;
              console.log(str);
              var ur = str.substr(28, tr.length);
              var stor = "C:/Users/Abraham/Desktop/SapReact/Server/storage/cv";
              fs.unlink(stor.concat(ur))
                .then(() => {
                  console.log("File removed");
                })
                .catch((err) => {
                  console.log(err);
                  console.error(
                    "Something wrong happened removing the file",
                    err
                  );
                });
              console.log("funcion entra con todo finish");
              if (req.file) {
                const { filename } = req.file;
                usuario.setCvUrl(filename);
              }
            }
          }
        }

        if (err) {
          console.log(err);
          return res.status(404).json({ msg: "Usuario no encontrado" });
        }
        if (rut) usuario.rut = rut;
        if (passport) usuario.passport = passport;
        if (nombres) usuario.nombres = nombres;
        if (apellidos) usuario.apellidos = apellidos;
        if (phone) usuario.phone = phone;
        if (email) usuario.email = email;
        // if (password) usuario.password = bcryptjs.hashSync(password, bcryptjs.genSaltSync(15));
        if (ecivil) usuario.ecivil = ecivil;
        if (comuna) usuario.comuna = comuna;
        if (region) usuario.region = region;
        if (direccion) usuario.direccion = direccion;
        if (nacion) usuario.nacion = nacion;
        if (sexo) usuario.sexo = sexo;
        if (consultor) usuario.consultor = consultor;
        if (anosExp) usuario.anosExp = anosExp;
        if (anosZap) usuario.anosZap = anosZap;
        if (registro) usuario.registro = registro;
        if (habilidades) usuario.habilidades = habilidades;

        usuario.save(function (err) {
          if (err)
            return res.status(500).json({ msg: "error al actualizar datos" });
          res.status(200).send(usuario);
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en Servidor" });
  }
};

exports.confirmarCuenta = async (req, res) => {
  console.log(req.params.correo);
  const usuario = Usuario.findOne({
    where: {
      email: req.params.correo,
    },
  });

  //si el usuario no existe
  if (!usuario) {
    res.status(404).send("No valido");
    res.redirect("/login-register");
  } else {
    return;
  }

  usuario.activo = 1;
  await usuario.save();
  res.send("CUenta activada Correctamente");
  res.redirect("/login-register");
};

exports.confirmarCuenta = async (req, res) => {
  console.log(req.params.correo);
  const usuario = Usuario.findOne({
    where: {
      email: req.params.correo,
    },
  });

  //si el usuario no existe
  if (!usuario) {
    res.status(404).send("No valido");
    res.redirect("/login-register");
  } else {
    return;
  }

  usuario.activo = 1;
  await usuario.save();
  res.send("CUenta activada Correctamente");
  res.redirect("/login-register");
};
