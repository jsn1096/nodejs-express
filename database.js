const mongoose = require('mongoose');
let password = 'admin';
let databaseName = 'db'
// Para acceder a variables de entorno
if (process.env.NODE_ENV === 'test') {
    databaseName = 'testdb'
}

mongoose.connect(`mongodb+srv://admin:${password}@cluster0.81mb2t5.mongodb.net/${databaseName}?retryWrites=true&w=majority`);

