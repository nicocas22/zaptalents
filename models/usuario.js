const mongoose = require("mongoose");
const { appConfig } = require("../config/config");

const UsuariosSchema = mongoose.Schema({
  rut: {
    type: String,
    trim: true,
  },
  passport: {
    type: String,
    trim: true,
  },
  nombres: {
    type: String,
    required: true,
    trim: true,
  },
  apellidos: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  ecivil: {
    type: String,
    required: true,
    trim: true,
  },
  comuna: {
    type: String,
    required: true,
    trim: true,
  },
  region: {
    type: String,
    required: true,
    trim: true,
  },
  direccion: {
    type: String,
    required: true,
    trim: true,
  },
  nacion: {
    type: String,
    required: true,
    trim: true,
  },
  sexo: {
    type: String,
    required: true,
    trim: true,
  },
  consultor: {
    type: String,
    required: true,
    trim: true,
  },
  anosExp: {
    type: String,
    required: true,
    trim: true,
  },
  anosZap: {
    type: String,
    required: true,
    trim: true,
  },
  registro: {
    type: Date,
    default: Date.now(),
  },
  imageURL: {
    type: String,
  },
  habilidades: [
    {
      key: String,
      name: String,
    },
  ],
  cvURL: {
    type: String,
  },
});

UsuariosSchema.methods.setImgUrl = function setImgUrl(filename) {
  const { host, port } = appConfig;
  this.imageURL = `https://zaptalents.azurewebsites.net/public/${filename}`;
};
UsuariosSchema.methods.setCvUrl = function setCvUrl(filename) {
  const { host, port } = appConfig;
  this.cvURL = `https://zaptalents.azurewebsites.net/public/cv/${filename}`;
  
};

module.exports = mongoose.model("Usuario", UsuariosSchema);
