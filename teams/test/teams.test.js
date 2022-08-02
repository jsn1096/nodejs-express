// AUNTENTICACIÓN DE TEAMS

const chai = require('chai');
const chaiHttp = require('chai-http');
const usersController = require('../../auth/users.controller');
const teamsController = require('../teams.controller');

chai.use(chaiHttp);

const app = require('../../app').app;

//Función de mocha para hacer acciones antes de realizar los test
beforeEach(async () => {
    await usersController.registerUser('Juan', '12345'); //usuario registrado para hacer las pruebas con el hasheo sincrono para que no se realice el test antes de que se registre el usuario
    await usersController.registerUser('Master', '1234');
})

afterEach(async () => {
    await usersController.cleanUpUsers();
    await teamsController.cleanUpTeam();
})

describe('Suite de pruebas teams', () => {
    // Cuando la llamada no tiene correctamente la llave
    it('should return the team of the given user', (done) => {
        let team = [{name: 'pikachu'}, {name: 'Blastoise'}, {name: 'Charmander'}];
        chai.request(app)
            .post('/auth/login')
            .set('content-type', 'application/json')
            .send({user: 'Juan', password: '12345'})
            .end((err, res) => {
                let token = res.body.token;
                chai.assert.equal(res.statusCode, 200);
                chai.request(app) // se realiza la llamada una vez se haya logueado el usuario
                    .put('/teams')
                    .send({team: team})
                    // Para poder enviar un token necesitamos, que el usuario exista y además esté logueado
                    .set('Authorization', `JWT ${token}`) // set() Para enviar un header
                    .end((err, res) => { //si el token es correcto se ejecuta un code 200
                        chai.request(app) // se realiza la llamada una vez se haya logueado el usuario
                            .get('/teams')
                            .set('Authorization', `JWT ${token}`) 
                            .end((err, res) => {
                                // tiene equipo con Charizard y Blastoise
                                // {trainer: 'Juan', team:[pokemon]}
                                chai.assert.equal(res.statusCode, 200);
                                chai.assert.equal(res.body.trainer, 'Juan');
                                chai.assert.equal(res.body.team.length, team.length);
                                chai.assert.equal(res.body.team[0].name, team[0].name);
                                chai.assert.equal(res.body.team[1].name, team[1].name);
                                done();
                            });
                    });    
            });
    });
    it('Should remove the pokemon at index', (done) => {
        let team = [{name: 'pikachu'}, {name: 'Blastoise'}, {name: 'Charmander'}];
        chai.request(app)
            .post('/auth/login')
            .set('content-type', 'application/json')
            .send({user: 'Juan', password: '12345'})
            .end((err, res) => {
                let token = res.body.token;
                chai.assert.equal(res.statusCode, 200);
                chai.request(app) // se realiza la llamada una vez se haya logueado el usuario
                    .put('/teams/')
                    .send({team: team})
                    // Para poder enviar un token necesitamos, que el usuario exista y además esté logueado
                    .set('Authorization', `JWT ${token}`) // set() Para enviar un header
                    .end((err, res) => { //si el token es correcto se ejecuta un code 200
                        chai.request(app) // se realiza la llamada una vez se haya logueado el usuario
                            .delete('/teams/pokemons/1')
                            .set('Authorization', `JWT ${token}`) 
                            .end((err, res) => {
                                chai.request(app)
                                .get('/teams')
                                .set('Authorization', `JWT ${token}`) 
                                .end((err, res) => {
                                    // tiene equipo con Charizard y Blastoise
                                    // {trainer: 'Juan', team:[pokemon]}
                                    chai.assert.equal(res.statusCode, 200);
                                    chai.assert.equal(res.body.trainer, 'Juan');
                                    chai.assert.equal(res.body.team.length, team.length - 1);
                                    done();
                                })
                            });
                    });    
            });
    });
    it('should return the pokedex number', (done) => {
        let pokemonName = 'Bulbasaur'
        chai.request(app)
            .post('/auth/login')
            .set('content-type', 'application/json')
            .send({user: 'Juan', password: '12345'})
            .end((err, res) => {
                let token = res.body.token;
                chai.assert.equal(res.statusCode, 200);
                chai.request(app) // se realiza la llamada una vez se haya logueado el usuario
                    .post('/teams/pokemons')
                    .send({name: pokemonName})
                    // Para poder enviar un token necesitamos, que el usuario exista y además esté logueado
                    .set('Authorization', `JWT ${token}`) // set() Para enviar un header
                    .end((err, res) => { //si el token es correcto se ejecuta un code 200
                        chai.request(app) // se realiza la llamada una vez se haya logueado el usuario
                            .get('/teams')
                            .set('Authorization', `JWT ${token}`) 
                            .end((err, res) => {
                                // tiene equipo con Charizard y Blastoise
                                // {trainer: 'Juan', team:[pokemon]}
                                chai.assert.equal(res.statusCode, 200);
                                chai.assert.equal(res.body.trainer, 'Juan');
                                chai.assert.equal(res.body.team.length, 1);
                                chai.assert.equal(res.body.team[0].name, pokemonName);
                                chai.assert.equal(res.body.team[0].pokedexNumber, 1);
                                done();
                            });
                    });    
            });
    });
    it('should not be able to add pokemon if you have already 6 pokemon', (done) => {
        let team = [{name: 'pikachu'}, 
                    {name: 'Blastoise'}, 
                    {name: 'Charmander'},
                    {name: 'pikachu'}, 
                    {name: 'Blastoise'}, 
                    {name: 'Charmander'}];
        chai.request(app)
            .post('/auth/login')
            .set('content-type', 'application/json')
            .send({user: 'Juan', password: '12345'})
            .end((err, res) => {
                let token = res.body.token;
                chai.assert.equal(res.statusCode, 200);
                chai.request(app) // se realiza la llamada una vez se haya logueado el usuario
                    .put('/teams')
                    .send({team: team})
                    .set('Authorization', `JWT ${token}`) 
                    .end((err, res) => { 
                        chai.request(app) // se realiza la llamada una vez se haya logueado el usuario
                            .post('/teams/pokemons')
                            .send({name: 'Vibrava'})
                            .set('Authorization', `JWT ${token}`) 
                            .end((err, res) => { 
                                chai.assert.equal(res.statusCode, 400);
                                done();
                            });   
                    });
            });    
    });
});
