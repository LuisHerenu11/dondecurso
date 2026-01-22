require('dotenv').config();
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

async function run() {
    try {
        console.log("🔄 Conectando a Google Sheets...");
        
        const auth = new google.auth.GoogleAuth({
            credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON),
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });

        const sheets = google.sheets({ version: 'v4', auth });
        const RANGE = 'ALUMNADO!A2:J'; 

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.SPREADSHEET_ID,
            range: RANGE,
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) {
            console.log('⚠️ No se encontraron datos en la hoja.');
            return;
        }

        // Procesamos TODOS los datos para guardar en JSON local
        // Agruparemos por DNI para mantener la estructura correcta
        const alumnosMap = new Map();

        rows.forEach(row => {
            if (!row[1] || !row[3]) return; // Si no hay DNI o Comisión, saltar

            const dni = row[1].toString().replace(/[^0-9]/g, "");
            
            // Lógica de horarios
            const diaRaw = row[5] || ""; 
            const diaKey = diaRaw.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
            const inicio = row[6] || "";
            const fin = row[7] || "";
            const horarioConcatenado = (inicio && fin) ? `${inicio} - ${fin}` : "A confirmar";
            
            const horarios = { lunes: "-", martes: "-", miercoles: "-", jueves: "-", viernes: "-", sabado: "-" };
            if (horarios.hasOwnProperty(diaKey)) horarios[diaKey] = horarioConcatenado;

            const materiaObj = {
                materia: row[2] || "Sin Materia",
                comision: row[3].trim(),
                docente: row[4] || "A designar",
                horarios: horarios,
                aula: `${row[8] || ""} - ${row[9] || ""}`.trim()
            };

            if (alumnosMap.has(dni)) {
                // Si el alumno ya existe, agregamos la materia
                alumnosMap.get(dni).inscripciones.push(materiaObj);
            } else {
                // Si es nuevo, creamos el registro
                alumnosMap.set(dni, {
                    alumno: row[0] || "Sin Nombre",
                    dni: row[1].trim(),
                    inscripciones: [materiaObj]
                });
            }
        });

        // Convertir el Mapa a Array
        const datosProcesados = Array.from(alumnosMap.values());

        const outputPath = path.resolve(__dirname, '../netlify/functions/data.json');
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        
        fs.writeFileSync(outputPath, JSON.stringify(datosProcesados, null, 2));
        
        console.log(`✅ ÉXITO: Se generó data.json con ${datosProcesados.length} alumnos únicos.`);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

run();