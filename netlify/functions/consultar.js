let data = [];
try {
    data = require('./data.json');
} catch (e) {
    console.log("⚠️ No se encontró data.json");
}

// Función para limpiar el DNI (quita puntos, espacios y letras, deja solo números)
function limpiarDNI(texto) {
    if (!texto) return "";
    return texto.toString().replace(/[^0-9]/g, ""); 
}

exports.handler = async function(event, context) {
    // 1. Validar método
    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const query = event.queryStringParameters.q;

    // 2. Validar input
    if (!query) {
        return { 
            statusCode: 400, 
            body: JSON.stringify({ error: "Por favor ingresa un DNI." }) 
        };
    }

    // 3. Limpiar el DNI que viene de la búsqueda (ej: "40.123.456" -> "40123456")
    const dniBuscado = limpiarDNI(query);

    if (!dniBuscado) {
        return { 
            statusCode: 400, 
            body: JSON.stringify({ error: "El DNI ingresado no es válido." }) 
        };
    }

    // 4. Buscar coincidencia exacta en el campo 'dni' que generó run.js
    // Nota: Usamos 'filter' en lugar de 'find' por si el alumno cursa más de una materia
    const resultados = data.filter(item => {
        if (!item.dni) return false;
        return limpiarDNI(item.dni) === dniBuscado;
    });

    // 5. Si no hay resultados
    if (resultados.length === 0) {
        return { 
            statusCode: 404, 
            body: JSON.stringify({ error: `No encontramos registros para el DNI ${query}.` }) 
        };
    }

    // 6. Devolver el PRIMER resultado encontrado
    // (Si necesitas devolver todas las materias del alumno, cambia esto para devolver el array 'resultados')
    const alumnoEncontrado = resultados[0]; 

    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*", 
        },
        body: JSON.stringify(alumnoEncontrado)
    };
};