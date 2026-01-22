require('dotenv').config();
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

async function run() {
    try {
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
            console.log('⚠️ No se encontraron datos.');
            return;
        }

        /* MAPA DE DATOS:
           0: APELLIDO Y NOMBRE 
           1: DNI (FILTRO)
           2: MATERIA 
           3: COMISIÓN 
           4: DOCENTE 
           5: DÍA (Lunes, Martes...)
           6: DESDE (8:00)
           7: HASTA (12:00)
           8: ESPACIO 
           9: EDIFICIO 
        */

        const datosProcesados = rows
        // Filtramos solo si hay DNI y Comisión
        .filter(row => row[1] && row[3])
        .map(row => {
            
            // Identificamos el día para saber en qué propiedad del objeto guardarlo
            const diaRaw = row[5] || ""; 
            const diaKey = diaRaw.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

            // CONCATENACIÓN: Unimos "Desde" (col 6) y "Hasta" (col 7)
            // Resultado ejemplo: "8:00 - 12:00"
            const inicio = row[6] || "";
            const fin = row[7] || "";
            const horarioConcatenado = (inicio && fin) ? `${inicio} - ${fin}` : "A confirmar";

            // Estructura de horarios vacía
            const horarios = {
                lunes: "-",
                martes: "-",
                miercoles: "-",
                jueves: "-",
                viernes: "-",
                sabado: "-"
            };

            // Insertamos el horario concatenado solo en el día que corresponde
            if (horarios.hasOwnProperty(diaKey)) {
                horarios[diaKey] = horarioConcatenado;
            }


            return {
                dni: row[1].trim(),             
                alumno: row[0] || "Sin Nombre", 
                materia: row[2] || "Sin Materia",
                comision: row[3].trim(),
                docente: row[4] || "A designar",
                horarios: horarios,             // Objeto con el día cargado
                aula: `${row[8] || ""} - ${row[9] || ""}`.trim() // Aula - Edificio
            };
        });

        const outputPath = path.resolve(__dirname, '../netlify/functions/data.json');
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        
        fs.writeFileSync(outputPath, JSON.stringify(datosProcesados, null, 2));
        
        console.log(`✅ Datos procesados: ${datosProcesados.length} registros generados.`);

    } catch (error) {
        console.error('error:', error.message);
        process.exit(1);
    }
}

run();