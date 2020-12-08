const usuario =  require("../models/usuario");
const  {OAuth2Client} = require('google-auth-library');
const { response } = require("express");
const jwt = require('jsonwebtoken');

const client = new OAuth2Client('461564686457-ah096iok3dhnsimuqvhieom283j1d6ml.apps.googleusercontent.com')


exports.googlelogin = (req, res) => {
    const {tokenid} = req.body

    client.verifyIdToken({idToken: tokenid, audience: "461564686457-ah096iok3dhnsimuqvhieom283j1d6ml.apps.googleusercontent.com"}).then(response => {
        const {email_verfied, nombres, email} = response.payload;

        console.log(response.payload);
        if(email_verfied) {
            usuario.findOne({email}).exec((err, user) => {
                if(err) {
                    return res.status(400).json({
                        msg: "Problemas en la autentificacion"
                    })
                } else {
                    if(usuario){
                        const token = jwt.sign({_id: usuario._id}, process.env.JWT_SIGNIN_KEY, {expiresIn: '7d'});
                        const {_id, nombres, email} = usuario;
                        
                        res.json({
                            token,
                            usuario: {_id, nombres, email}
                        })
                    }else {
                        let password = email+process.env.JWT_SIGNIN_KEY;
                        let newUsuario = new usuario({nombres, email, password});
                        newUsuario.save((err, data) =>{
                            if(err) {
                                return res.status(400).json({
                                    msg: "Hubo un problema UPS!"
                                })
                            }
                            const token = jwt.sign({_id: usuario._id}, process.env.JWT_SIGNIN_KEY, {expiresIn: '7d'});
                        const {_id, nombres, email} = newUsuario;
                        
                        res.json({
                            token,
                            usuario: {_id, nombres, email}
                        })
                        }) 
                    }
                }
            })
        }
    })
}