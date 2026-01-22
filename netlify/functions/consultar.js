require('dotenv').config();
const { google } = require('googleapis');

// Función de limpieza de DNI
function limpiarDNI(texto) {
    if (!texto) return "";
    return texto.toString().replace(/[^0-9]/g, ""); 
}

exports.handler = async function(event, context) {
    // 1. Validaciones básicas
    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const query = event.queryStringParameters.q;
    if (!query) {
        return { statusCode: 400, body: JSON.stringify({ error: "Ingresa un DNI." }) };
    }

    const dniBuscado = limpiarDNI(query);

    try {
        // 2. CONEXIÓN EN VIVO (Aquí está la magia)
        // En lugar de leer data.json, nos autenticamos con Google ahora mismo.
        const auth = new google.auth.GoogleAuth({
            credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON),
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });

        const sheets = google.sheets({ version: 'v4', auth });
        
        // Rango de tu hoja de alumnos
        const RANGE = 'ALUMNADO!A2:J'; 

        // Pedimos los datos a Google (esto tarda unos milisegundos más, pero es fresco)
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.SPREADSHEET_ID,
            range: RANGE,
        });

        const rows = response.data.values;
        
        if (!rows || rows.length === 0) {
            return { statusCode: 404, body: JSON.stringify({ error: "La base de datos está vacía." }) };
        }

        // 3. FILTRADO (Buscamos al alumno en los datos frescos)
        const filasDelAlumno = rows.filter(row => {
            const dniFila = row[1] ? limpiarDNI(row[1]) : "";
            return dniFila === dniBuscado;
        });

        if (filasDelAlumno.length === 0) {
            return { 
                statusCode: 404, 
                body: JSON.stringify({ error: `No se encontraron inscripciones para el DNI ${query}.` }) 
            };
        }

        // 4. PROCESAMIENTO DE DATOS
        const inscripciones = filasDelAlumno.map(row => {
            // Lógica de Días
            const diaRaw = row[5] || ""; 
            const diaKey = diaRaw.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

            // Lógica de Horarios
            const inicio = row[6] || "";
            const fin = row[7] || "";
            const horarioConcatenado = (inicio && fin) ? `${inicio} - ${fin}` : "A confirmar";

            // Objeto Horarios
            const horarios = {
                lunes: "-", martes: "-", miercoles: "-", jueves: "-", viernes: "-", sabado: "-"
            };

            if (horarios.hasOwnProperty(diaKey)) {
                horarios[diaKey] = horarioConcatenado;
            }

            return {
                materia: row[2] || "Sin Materia",
                comision: row[3].trim(),
                docente: row[4] || "A designar",
                horarios: horarios,
                aula: `${row[8] || ""} - ${row[9] || ""}`.trim()
            };
        });

        // 5. RESPUESTA FINAL
        const respuesta = {
            alumno: filasDelAlumno[0][0] || "Sin Nombre",
            dni: filasDelAlumno[0][1].trim(),
            cantidad_materias: inscripciones.length,
            inscripciones: inscripciones
        };

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*", 
            },
            body: JSON.stringify(respuesta)
        };

    } catch (error) {
        console.error('Error conexión Google:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error interno conectando con la planilla.' })
        };
    }
};