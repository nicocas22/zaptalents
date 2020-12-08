const Estudio = require("../models/estudios");
const upload = require("../libs/storageEstudios");
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
exports.crearEstudios = async (req, res) => {
  try {
    //Crear nuevo Estudio
    const estudio = new Estudio(req.body);
    //subida de archivo
    if (req.file) {
      console.log(req.file);
      const { filename } = req.file;
      estudio.setcertificado(filename);
    }

    //Guardar nuevo estudio
    await estudio.save();
    res.json(estudio);
  } catch (error) {
    res.status(500).json({ msg: "Hubo un error" });
  }
};

//OBTENER
exports.mostrarEstudio = async (req, res) => {
  try {
    const estudios = await Estudio.find({ idusuario: req.params.idusuario });
    res.json(estudios);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor." });
  }
};

//ACTUALIZAR
exports.putestudio = async (req, res) => {
  const idestudio = req.params.idestudio;
  try {
    Estudio.findById(idestudio, function (err, estudio) {
      if (req.file) {
        if (estudio.estudioURL === undefined) {
          //subida de imagen
          if (req.file) {
            const { filename } = req.file;
            estudio.setcertificado(filename);
          }
        } else {
          console.log("delete");
          var str = estudio.estudioURL;
          var tr = estudio.estudioURL.length;
          var ur = str.substr(28, tr.length);
          var stor =
            "C:/Users/Abraham/Desktop/SapReact/Server/storage/estudios";
          fs.unlink(stor.concat(ur))
            .then(() => {
              console.log("File removed");
            })
            .catch((err) => {
              console.log(err);
              console.error("Something wrong happened removing the file", err);
            });
        }
        if (req.file) {
          const { filename } = req.file;
          estudio.setcertificado(filename);
        }
      }
      if (err) return res.status(502).json({ msg: "Error al actualizar." });
      console.log(err);
      estudio.tipoestudio = req.body.tipoestudio;
      estudio.carrera = req.body.carrera;
      estudio.institucion = req.body.institucion;
      estudio.areaestudio = req.body.areaestudio;
      estudio.escalanotas = req.body.escalanotas;
      estudio.promedio = req.body.promedio;
      estudio.pais = req.body.pais;
      estudio.estado = req.body.estado;
      estudio.observacion = req.body.observacion;
      estudio.certificado = req.body.certificado;
      estudio.diainicio = req.body.diainicio;
      estudio.diafin = req.body.diafin;
      estudio.save(function (err) {
        if (err) {
          console.log(err);
          return res.status(501).json({ msg: "Error al actualizar." });
        }
        res.status(200).send(estudio);
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor." });
  }
};

//ELIMINAR
exports.deleteestudio = async (req, res) => {
  const idestudio = req.params.idestudio;
  try {
    Estudio.findById(idestudio, (err, estudio) => {
      if (err) res.status(402).json({ msg: `Error al borrar estudio` });
      estudio.remove((err) => {
        if (err) res.status(402).json({ msg: `Error al borrar estudio` });
        res.status(200).json({ msg: "Estudio Eliminado Exitosamente" });
      });
    });
  } catch (error) {
    res.status(404).json({ msg: "Error en el servidor." });
  }
};
