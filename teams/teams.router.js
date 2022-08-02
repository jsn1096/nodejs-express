const express = require('express');
const router = express.Router();

const teamsHttpHandler = require('./teams.http');

router.route('/')
    .get(teamsHttpHandler.getTeamFromUser)
    .put(teamsHttpHandler.setTeamToUser)

router.route('/pokemons')
    .post(teamsHttpHandler.addPokemonToTeam)
// req.body para todo lo que enviamos por body
// req.params para todo lo que envíamos por URL
router.route('/pokemons/:pokeid') //los dos puntos significa que puede ir un numero o cualquier cosa
    .delete(teamsHttpHandler.deletePokemonFromTeam)

/*
// los endpoints los protegemos con un sistema que se llama middelware
// esto permite pasar una llamada de usuario entre middelwares hasta llegar al handler que es la función final
*/
exports.router = router;