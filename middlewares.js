const authmiddleware = require('./tools/auth-middleware');
const bodyParser = require('body-parser');

const setupMiddlewares = (app) => {
    app.use(bodyParser.json());//lee los datos que recibe en formato json correctamente
    authmiddleware.init();
    app.use(authmiddleware.protectWithJwt);
}
exports.setupMiddlewares = setupMiddlewares;