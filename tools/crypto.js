// LÓGICA DE FUNCIONES DE CRIPTOGRAFÍA
// Esto se saca de la documentación

const bcrypt = require('bcrypt');
// Función para hashear la password
const hashPassword = (plainTextPwd, done) => {
    bcrypt.hash(plainTextPwd, 10, done) // done: función de callbacks de exito
};
// Función de hashear contraseña de forma sincrona
const hashPasswordSync = (plainTextPwd) => {
    return bcrypt.hashSync(plainTextPwd, 10); 
};

// Función para comparar las contraseñas 
const comparePassword = (plainPassword, hashPassword, done) => { //donde: devuelve true si las dos funciones son equivalentes o false si no
    bcrypt.compare(plainPassword, hashPassword, done)
};

exports.hashPassword = hashPassword;
exports.hashPasswordSync = hashPasswordSync;
exports.comparePassword = comparePassword;