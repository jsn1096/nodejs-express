// Esta función engloba promesas de forma genérica y gestiona errores por nosotros

const to = (promise) => { //recibe una promesa
    return promise.then(data => { //En el then entramos si la promesa resuelve con éxito por lo tanto no tenemos ningun error
        return [null, data]; // Devolvemos un null en el error y la información (En el caso de éxito) en un array
    }).catch(err => [err, null]); // En caso fallido, nos devuelve el error, y null en la información en un array
}

exports.to = to;