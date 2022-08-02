// TEST DE AUTENTICACIÓN

const chai = require('chai');
const chaiHttp = require('chai-http');
const usersController = require('../users.controller');
const teamsController = require('../../teams/teams.controller');
chai.use(chaiHttp);

const app = require('../../app').app;

//Función de mocha para hacer acciones antes de realizar los test
beforeEach(async () => {
    usersController.registerUser('Juan', '12345'); //usuario registrado para hacer las pruebas con el hasheo sincrono para que no se realice el test antes de que se registre el usuario
    usersController.registerUser('Master', '1234');
})

afterEach(async () => {
    await usersController.cleanUpUsers();
    await teamsController.cleanUpTeam();
});

describe('Suite de pruebas auth', () => {
    it('should return 401 when no jwt token available', (done) => {
        // Cuando el usuario no tiene la llave para realizar la llamada
        chai.request(app)
            .get('/teams')
            .end((err, res) => {
                chai.assert.equal(res.statusCode, 401);
                done();
            });
    });
    // Aquí se mezclan llamadas para poder realizar el test correctamente
    it('should return 400 when data is not provided', (done) => {
        chai.request(app)
            .post('/auth/login')
            .end((err, res) => {
                chai.assert.equal(res.statusCode, 400);
                done();
            });
    });
    it('should return 200 and token for succesful login', (done) => {
        // Para loguear un usuario:
        chai.request(app)
            .post('/auth/login')
            .set('content-type', 'application/json')
            .send({user: 'Juan', password: '12345'})
            .end((err, res) => {
                chai.assert.equal(res.statusCode, 200);
                done();
            });
    });
    it('should return 200 when jwt is valid', (done) => {
        // Para loguear un usuario:
        chai.request(app)
            .post('/auth/login')
            .set('content-type', 'application/json')
            .send({user: 'Juan', password: '12345'})
            .end((err, res) => {
                chai.assert.equal(res.statusCode, 200);
                chai.request(app) // se realiza la llamada una vez se haya logueado el usuario
                    .get('/teams')
                    // Para poder enviar un token necesitamos, que el usuario exista y además esté logueado
                    .set('Authorization', `JWT ${res.body.token}`) // set() Para enviar un header
                    .end((err, res) => { //si el token es correcto se ejecuta un code 200
                        chai.assert.equal(res.statusCode, 200);
                        done();
                    });
            });
    });
});
