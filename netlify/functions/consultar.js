let data = [];
try {
    data = require('./data.json');
} catch (e) {
    console.log("⚠️ No se encontró data.json");
}

// limpia texto
function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Quita tildes
        .replace(/[^a-z0-9]/g, ""); // cualquier cosa que no sea a-z o de 0 a 9, lo reemplaza por vacío.
}

// extraer el número de una cadena (ej: "Comisión_018-TM" -> 18)
function extraerNumero(texto) {
    const match = texto.match(/(\d+)/); // busca la primera secuencia de números
    return match ? parseInt(match[0], 10) : null;
}

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const query = event.queryStringParameters.q;

    if (!query) {
        return { 
            statusCode: 400, 
            body: JSON.stringify({ error: "Por favor ingresa un número de comisión." }) 
        };
    }

    // lógica de busqueda
    const queryNumero = extraerNumero(query);
    const queryTexto = normalizarTexto(query);

    const resultado = data.find(item => {
    // busqueda por numero (Prioridad Alta)
    // Si el usuario escribió un número (ej: "18" o "Comision 18"), comparamos los números.
        if (queryNumero !== null) {
            const itemNumero = extraerNumero(item.id);
            // Comparamos 18 con 18 (ignorando si es 018)
            if (itemNumero === queryNumero) return true;
        }

    // busqueda por texto (Fallback)
    // Si no coinciden los números, buscamos coincidencias de texto relajadas
        const itemIdLimpio = normalizarTexto(item.id);
        return itemIdLimpio.includes(queryTexto);
    });

    if (!resultado) {
        return { 
            statusCode: 404, 
            body: JSON.stringify({ error: `No encontramos la comisión "${query}". Prueba escribiendo solo el número.` }) 
        };
    }

    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*", 
        },
        body: JSON.stringify(resultado)
    };
};