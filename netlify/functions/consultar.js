let data = [];
try {
    data = require('./data.json');
} catch (e) {
    console.log("⚠️ No se encontró data.json");
}

function limpiarDNI(texto) {
    if (!texto) return "";
    return texto.toString().replace(/[^0-9]/g, ""); 
}

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const query = event.queryStringParameters.q;

    if (!query) {
        return { statusCode: 400, body: JSON.stringify({ error: "Ingresa un DNI." }) };
    }

    const dniBuscado = limpiarDNI(query);

    // 1. Usamos FILTER en lugar de FIND para traer TODOS los registros
    const coincidencias = data.filter(item => {
        return item.dni && limpiarDNI(item.dni) === dniBuscado;
    });

    if (coincidencias.length === 0) {
        return { 
            statusCode: 404, 
            body: JSON.stringify({ error: `No se encontraron inscripciones para el DNI ${query}.` }) 
        };
    }

    // 2. Tomamos los datos personales del primer resultado (son iguales en todos)
    const datosAlumno = coincidencias[0];

    // 3. Estructuramos la respuesta final agrupando las materias
    const respuesta = {
        alumno: datosAlumno.alumno,
        dni: datosAlumno.dni,
        cantidad_materias: coincidencias.length,
        // Creamos un array limpio solo con los datos académicos de cada materia
        inscripciones: coincidencias.map(item => ({
            materia: item.materia,
            comision: item.comision,
            docente: item.docente,
            horarios: item.horarios,
            aula: item.aula
        }))
    };

    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*", 
        },
        body: JSON.stringify(respuesta)
    };
};