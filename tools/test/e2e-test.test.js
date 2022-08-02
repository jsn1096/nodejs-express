// TEST DE INTEGRACIÓN

const chai = require('chai');
const chaiHttp = require('chai-http');
// chai-http da funcionalidades a chai para poder levantar servidores
// y poder hacer llamadas http sobre estos servidores
chai.use(chaiHttp); //chai.use recibe como parámetro un plugin

// necesitamos tener acceso al objeto que determina nuestro sistema
const app = require('../../app').app;

//Definimos los test de integracion que necesitamos

// describe(). Función es utilizada para agrupar casos de prueba. Permite anidamientos
// it(). Función utilizada para definir los casos de prueba mediante afirmaciones.
describe('Suite de prueba e2e para el curso', () => {
    it('should return hello world', (done) => { // function(done) es un callback para indicar que el test se ha completado después de verificar las afirmaciones xq end() es una funcón asincrona
        chai.request(app) //Aquí decimos a chai que queremos que use el servidor de app
            .get('/') // que haga esa llamada al servidor app
            .end((err, res) => { //end((err, res) {} recoge el resultado de la llamada
                chai.assert.equal(res.text, 'Hello World!') //aquí se comprueba que lo que obtuvimos sea lo correcto, que el primer parametro sea igual al segundo
                done(); //la done sirve para indicar que la función it acaba ahí, mandandole el callback done
                // porque queremos que el test se termine cuando ya se ha realizado la llamada http, no antes
            });
    });
});