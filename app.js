// IMPLEMENTACIÓN DE ENDPOINTS

const express = require('express');
const middlewares = require('./middlewares');
require('./database');
// Routes
const authRoutes = require('./auth/auth.router').router; //ahora para hacer llamadas al router va /auth/login
const teamRouthes = require('./teams/teams.router').router;

//app Es nuestro objeto servidor, el ejecutable para levantar nuestro servidor
const app = express(); //variable que va a tener todas las capacidades de gestionar peticiones

const port = 3000; //puerto a través de la que se hace la conexión

middlewares.setupMiddlewares(app);

app.get('/', (req, res) => {
    // req es la request, la petición
    // res es la response, la respuesta
    res.status(200).send('Hello World!')
})

app.use('/auth', authRoutes);
app.use('/teams', teamRouthes);

app.listen(port, () => {
    console.log('server started at port 3000');
}) //para empezar a escuchar peticiones

//para poder ofrecer el modulo app para usar en otros ficheros
exports.app = app;
