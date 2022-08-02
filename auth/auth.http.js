const jwt = require('jsonwebtoken');
const usersController = require('./users.controller');
const {to} = require('../tools/to');

const loginUser = async (req, res) => {
    // Comprobar que realmente nos llegue un usuario y una contraseña
    if (!req.body) { //si no llegan datos devolveremos un 400
        return res.status(400).json({message: 'Missing data'});
    } else if (!req.body.user || !req.body.password) { // si llegan datos y no son usuario y password se devuelve 400
        return res.status(400).json({message: 'Missing data'});
    }
    // Comprobamos credenciales
    let [err, resp] = await to(usersController.checkUsersCredentials(req.body.user, req.body.password))
        //si no son validas, error
    if (err || !resp) {
        return res.status(401).json({message: 'Invalid Credentials'});
    }
    // si no son validas generamos un JWT y lo devolvemos
    let user = await usersController.getUserIdFromUserName(req.body.user);
    const token = jwt.sign({userId: user.userId}, 'secretPassword'); //sign() crea un nuevo token
    res.status(200).json(
        {token: token}
    )
}


exports.loginUser = loginUser;
