// definimos una estrategia de auntenticación que en este caso es JWT
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport');

// pasamos la librería de passport
const init = () => {
    const opts = { //Objeto JSON con la config de la estrategía
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("JWT"), // sacamos el JWT del header de authorization con el esquma JWT
        secretOrKey: 'secretPassword' //TODO debería estar en una variable de entorno, solo el servidor puede verla
    } //le decimos a passport que use una estrategía JWT que es la que se importó arriba para decodificar los tokens
    // si le enviamos el token al usuario, passport dejará pasar ese token si este está correctamente autenticado
    passport.use(new JwtStrategy(opts, (decoded, done) => { //(decode, done) función de resultado
        return done(null, decoded);
    }));
}
// Aquí protegemos todas los endpoints menos los del hello world del inicio y el de login obviamente xq la gente necesita loguearse para conseguir un token de auth
const protectWithJwt = (req, res, next) => {
    if (req.path == '/' || req.path == '/auth/login') {
        return next();
    }
    return passport.authenticate('jwt', {session: false})(req, res, next);
}

exports.init = init;
exports.protectWithJwt = protectWithJwt;
