// CONTROLADOR DE USUARIOS
// vamos a hacer una base de datos que funcione solo cuando nuestro servidor está encendido
const uuid = require('uuid');
const crypto = require('../tools/crypto.js');
const teams = require('../teams/teams.controller');
const mongoose = require('mongoose');
const { to } = require('../tools/to');

const UserModel = mongoose.model('UserModel',
    { userName: String, password: String, userId: String });

//para guardar en un diccionario toda la info de los usuarios cada que se haga login
// userId -> password

const cleanUpUsers = () => {
    return new Promise(async (resolve, reject) => {
        await UserModel.deleteMany({}).exec();
        resolve();
    })
}

//guardar en la base de datos nuestro usuario
const registerUser = (userName, password) => {
    return new Promise (async (resolve, reject) => {
        let hashedPwd = crypto.hashPasswordSync(password);
        let userId = uuid.v4();
        let newUser = new UserModel({ //Aquí creamos un uuid con los datos del usuario
            userId: userId,
            userName: userName,
            password: hashedPwd
        });
        await newUser.save();
        await teams.bootstrapTeam(userId); // Esta función crea en la base de datos un equipo por cada usuario
        resolve();
    })
};

//OBtener el userId de la base de atos de usuariso
const getUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        let [err, result] = await to(UserModel.findOne({userId: userId}).exec());
        if (err) {
            return reject(err);
        }
        resolve(result);
    });
}

// Nos compruba en nuestra base de datos si tenemos un usuario con el userName y nos devuelve el usuario correspondiente
const getUserIdFromUserName = (userName) => {
    return new Promise(async (resolve, reject) => {
        let [err, result] = await to(UserModel.findOne({userName: userName}).exec());
        if (err) {
            return reject(err);
        }
        resolve(result);
    });
}

const checkUsersCredentials = (userName, password) => {
    return new Promise(async (resolve, reject) => {
        // comprobar que las credenciales sean correcras
        let [err, user] = await to(getUserIdFromUserName(userName));
        if (!err || user) {
            crypto.comparePassword(password, user.password, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        } else {
            reject(err);
        }
    });
}
    

exports.registerUser = registerUser;
exports.checkUsersCredentials = checkUsersCredentials;
exports.getUserIdFromUserName = getUserIdFromUserName;
exports.getUser = getUser;
exports.cleanUpUsers = cleanUpUsers;