const { response } = require("express");
const { validationResult } = require("express-validator");
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async (req, res = response) => {

    const {email, password} = req.body; 

    try {

        const existeEmail = await Usuario.findOne({email});
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe una cuenta asociada a este correo electrónico.'
            });
        }

        const usuario = new Usuario(req.body);
        
        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        // Generar JWT
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Ocurrio un error interno en el servidor'
        });
    }
 }

 const login = async (req, res = response) => {
    const {email, password} = req.body; 

    try {

        const usuarioDB = await Usuario.findOne({email});

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña inválidos.'
            });
        }

        // Validar password
        const validPassword = bcrypt .compareSync(password, usuarioDB.password);
        
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña inválidos.'
            });
        }

        // Generar el jwt
        const token = await generarJWT(usuarioDB.id);


        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Ocurrio un error interno en el servidor'
        });
    }
 }

 const renewToken = async (req, res = response) => {
    const uid = req.uid;

    try {
        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario no encontrado.'
            });
        }

        // Generar el jwt
        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Ocurrio un error interno en el servidor'
        });
    }
 }

 module.exports = {
   crearUsuario,
   login,
   renewToken
 };