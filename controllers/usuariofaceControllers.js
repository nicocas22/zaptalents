const passport  =  require("passport");
const dotenv    =  require("dotenv");
const strategy  =  require("passport-facebook");
const usuario =  require("../models/usuario");
const { response } = require("express");

const FacebookStrategy = strategy.Strategy;

dotenv.config();

exports.facebooklogin = (req, res) =>{
  const {userID, accesToken} = req.body;
  let urlGraphFacebook = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accesToken}`;
  fetch(urlGraphFacebook, {
    method: 'GET'
  })
  .then(res => res.json())
  .then(res => {
    const {email, name} = res;
   usuario.findOne({email}).exec((err, Usuario)=> {

  }
   ) 
  })
}