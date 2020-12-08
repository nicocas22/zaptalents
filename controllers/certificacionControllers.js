const Certificacion = require("../models/certificacion");
const upload = require("../libs/storageCertificados");
const fs = require("fs").promises;

exports.SubirArchivo = (req, res, next) => {
  upload(req, res, function (error) {
    if (error) {
      res.json({ msg: error });
    }
    return next();
  });
};

//GUARDAR
exports.crearCertificacion = async (req, res) => {
  try {
    //Crear nueva certificacion
    const certificado = new Certificacion(req.body);
    //Guardar Certificacion
    //subida de imagen
    if (req.file) {
      const { filename } = req.file;
      certificado.setcertificado(filename);
    }
    await certificado.save();
    res.json(certificado);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error" });
  }
};

//OBTENER
exports.mostrarCertificacion = async (req, res) => {
  try {
    const certificado = await Certificacion.find({
      idusuario: req.params.idusuario,
    });
    res.json(certificado);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor." });
  }
};

//ACTUALIZAR
exports.putCertificacion = async (req, res) => {
  const idcertificacion = req.params.idcertificacion;
  console.log(req.body);
  try {
    Certificacion.findById(idcertificacion, function (err, certificacion) {
      if (req.file) {
        if (certificacion.certificadoURL === undefined) {
          //subida de imagen
          if (req.file) {
            const { filename } = req.file;
            certificacion.setcertificado(filename);
          }
        } else {
          var str = certificacion.certificadoURL;
          var tr = certificacion.certificadoURL.length;
          var ur = str.substr(28, tr.length);
          var stor =
          "C:/Users/Abraham/Desktop/SapReact/Server/storage/estudios";
          fs.unlink(stor.concat(ur))
            .then(() => {
              console.log("File removed");
            })
            .catch((err) => {
              console.error("Something wrong happened removing the file", err);
            });
        }
        if (req.file) {
          const { filename } = req.file;
          certificacion.setcertificado(filename);
        }
      }

      certificacion.certificacion = req.body.certificacion;
      certificacion.universidad = req.body.universidad;
      certificacion.fecha = req.body.fecha;
      certificacion.pais = req.body.pais;
      certificacion.estado = req.body.estado;
      certificacion.obs = req.body.obs;
      certificacion.certificado = req.body.certificado;

      if (err)
        return res.status(404).json({ msg: "Certificado no encontrado" });
      certificacion.save(function (err) {
        if (err) return res.status(500).json({ msg: "Error al actualizar." });
        res.status(200).send(certificacion);
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor." });
  }
};

//ELIMINAR
exports.deleteCertificacion = async (req, res) => {
  const certifiid = req.params.idcertificacion;
  try {
    Certificacion.findById(certifiid, (err, certificacion) => {
      if (err) res.status(402).json({ msg: `Error al borrar el trabajo ` });
      certificacion.remove((err) => {
        if (err) res.status(402).send({ msg: "Error al borrar certificado" });
        res.status(200).send({ msg: "Certificado eliminado exitosamente." });
      });
    });
  } catch (error) {
    res.status(500).send({ msg: "Error en el servidor." });
  }
};
