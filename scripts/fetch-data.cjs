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
        const RANGE = 'GRILLA!A5:L'; // Ajusta esto si tu hoja tiene otro nombre

        console.log('⏳ Conectando con Google Sheets...');
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.SPREADSHEET_ID,
            range: RANGE,
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) {
            console.log('⚠️ No se encontraron datos.');
            return;
        }

        const datosProcesados = rows
        .filter(row => row[1] && row[1].includes('COMISIÓN'))
        .map(row => ({
            id: row[1].trim(),            // Col B: Comisión (ID Real)
            turno: row[2] || "",          // Col C: Turno
            carrera: row[3] || "",        // Col D: Carrera
            horarios: {
                lunes: row[4] || "-",       // Col E
                martes: row[5] || "-",      // Col F
                miercoles: row[6] || "-",   // Col G
                jueves: row[7] || "-",      // Col H
                viernes: row[8] || "-",     // Col I
                sabado: row[9] || "-"       // Col J
            },
            aula: row[10] || "A confirmar" // Columna K Aula
        }));

        const outputPath = path.resolve(__dirname, '../netlify/functions/data.json');
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, JSON.stringify(datosProcesados, null, 2));
    
        console.log(`✅ ¡Éxito! Se generaron ${datosProcesados.length} registros en ${outputPath}`);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

run();