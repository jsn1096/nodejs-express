// MÓDULO DE AUTH USANDO ROUTERS (RUTAS)
const express = require('express');
const router = express.Router();

const authHttpHandler = require('./auth.http')
// En vez de definir las rutas directamente en app, estamos definiendo las rutas en un router
// Definimos el endpoint comun y luego las operaciones que se han de ejecutar

router.route('/login')
    .post(authHttpHandler.loginUser);

exports.router = router;