require('dotenv').config();
const { google } = require('googleapis');

// Función auxiliar para limpiar DNI
function limpiarDNI(texto) {
    if (!texto) return "";
    return texto.toString().replace(/[^0-9]/g, ""); 
}

exports.handler = async function(event, context) {
    // Solo permitimos GET
    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const query = event.queryStringParameters.q;

    if (!query) {
        return { statusCode: 400, body: JSON.stringify({ error: "Por favor, ingresa un DNI." }) };
    }

    const dniBuscado = limpiarDNI(query);

    try {
        // --- CONEXIÓN EN VIVO A GOOGLE SHEETS ---
        const auth = new google.auth.GoogleAuth({
            credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON),
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });

        const sheets = google.sheets({ version: 'v4', auth });
        const RANGE = 'ALUMNADO!A2:J'; // Asegúrate que este rango coincide con tu hoja

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.SPREADSHEET_ID,
            range: RANGE,
        });

        const rows = response.data.values;

        if (!rows || rows.length === 0) {
            return { statusCode: 404, body: JSON.stringify({ error: "No hay datos en la hoja de cálculo." }) };
        }

        // --- FILTRADO Y PROCESAMIENTO ---
        
        // 1. Filtramos las filas que coinciden con el DNI
        const filasDelAlumno = rows.filter(row => {
            // La columna 1 es el DNI en tu Excel
            const dniFila = row[1] ? limpiarDNI(row[1]) : "";
            return dniFila === dniBuscado;
        });

        if (filasDelAlumno.length === 0) {
            return { 
                statusCode: 404, 
                body: JSON.stringify({ error: `No se encontraron inscripciones para el DNI ${query}.` }) 
            };
        }

        // 2. Mapeamos las filas encontradas al formato que necesita el Front
        const inscripciones = filasDelAlumno.map(row => {
            // Lógica de días
            const diaRaw = row[5] || ""; 
            const diaKey = diaRaw.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

            // Lógica de horarios
            const inicio = row[6] || "";
            const fin = row[7] || "";
            const horarioConcatenado = (inicio && fin) ? `${inicio} - ${fin}` : "A confirmar";

            // Objeto base de horarios
            const horarios = {
                lunes: "-", martes: "-", miercoles: "-", jueves: "-", viernes: "-", sabado: "-"
            };

            // Asignar horario al día correspondiente
            if (horarios.hasOwnProperty(diaKey)) {
                horarios[diaKey] = horarioConcatenado;
            }

            return {
                materia: row[2] || "Sin Materia",
                comision: row[3].trim(),
                docente: row[4] || "A designar",
                horarios: horarios,
                aula: `${row[8] || ""} - ${row[9] || ""}`.trim() // Aula - Edificio
            };
        });

        // 3. Armamos la respuesta final agrupada
        const respuesta = {
            alumno: filasDelAlumno[0][0] || "Estudiante", // Nombre (Columna 0)
            dni: filasDelAlumno[0][1].trim(),             // DNI (Columna 1)
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
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error de conexión con la base de datos.' })
        };
    }
};