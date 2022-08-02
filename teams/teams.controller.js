// aqui guardamos los equipos de los usuarios en la databse
const mongoose = require('mongoose');
const { to } = require('../tools/to');
const TeamsModel = mongoose.model('TeamsModel',
    {userId: String, team: []});

let cleanUpTeam = () => {
    return new Promise(async (resolve, reject) => {
        await TeamsModel.deleteMany({}).exec();
        resolve();
    })
}

// Función para crear un equipo vacío al usuario
const bootstrapTeam = (userId) => {
    return new Promise(async (resolve, reject) => {
        let newTeam = new TeamsModel({userId: userId, team: []})
        await newTeam.save();
        resolve();
    })
}
// Obtener el equipo del usuario
const getTeamOfUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        let [err, dbTeam] = await to(TeamsModel.findOne({userId: userId}).exec());
        if (err) {
            return reject(err);
        }
        resolve(dbTeam.team);
    });
}

// Añadir pokemons al equipo creado 
const addPokemon = (userId, pokemon) => {
    return new Promise(async (resolve, reject) => {
        let [err, dbTeam] = await to(TeamsModel.findOne({userId: userId}).exec());
        if (err) {
            return reject(err);
        }
        if (dbTeam.team.length == 6) {
            reject('Already have 6 pokemon');
        } else {
            dbTeam.team.push(pokemon);
            await dbTeam.save();
            resolve();
        }
    });
}

const deletePokemonAt = (userId, index) => {
    return new Promise(async (resolve, reject) => {
        let [err, dbTeam] = await to(TeamsModel.findOne({userId: userId}).exec());
        if (err || !dbTeam) {
            return reject(err);
        }
        if (dbTeam.team[index]) {
            dbTeam.team.splice(index, 1); // función que elimina elementos dado un indice de arrays
        }
        await dbTeam.save();
        resolve();
    })
}

// función para poner en el database al userId el equipo completo
const setTeam = (userId, team) => {
    return new Promise(async (resolve, reject) => {
        let [err, dbTeam] = await to(TeamsModel.udpateOne(
            {userId: userId},
            {$set: {team: team}},
            {upsert: true}).exec());
        if (err || !dbTeam) {
            return reject(err);
        }
        resolve();
    })   
}

exports.bootstrapTeam = bootstrapTeam;
exports.addPokemon = addPokemon;
exports.setTeam = setTeam;
exports.getTeamOfUser = getTeamOfUser;
exports.cleanUpTeam = cleanUpTeam;
exports.deletePokemonAt = deletePokemonAt;