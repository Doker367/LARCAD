require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); // Añade esto para verificar archivos
const dialogflow = require('@google-cloud/dialogflow');

const app = express();
const PORT = process.env.PORT || 3000;

// ======================================
// CONFIGURACIÓN CRÍTICA DE DIALOGFLOW
// ======================================
try {
    // Verifica que el archivo de credenciales exista
    const credentialsPath = path.resolve(__dirname, '../config/dialogflow-wey.json');
    if (!fs.existsSync(credentialsPath)) {
        throw new Error(`❌ Archivo de credenciales no encontrado en: ${credentialsPath}`);
    }

    process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;
    
    const sessionClient = new dialogflow.SessionsClient();
    app.locals.sessionClient = sessionClient;
    
    // Verifica la conexión con Dialogflow
    sessionClient.getProjectId()
        .then(projectId => {
            console.log(`✅ Dialogflow configurado. Project ID: ${projectId}`);
        })
        .catch(error => {
            console.error('🔥 Error configurando Dialogflow:', error);
            process.exit(1);
        });
} catch (error) {
    console.error('❌ Error inicializando Dialogflow:', error);
    process.exit(1);
}

// ======================================
// MIDDLEWARE
// ======================================
app.use(cors({
    origin: 'https://larcad.mx',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ======================================
// RUTAS - SOLO UNA DECLARACIÓN
// ======================================
// Importar rutas del chatbot
let dialogflowRoutes;
try {
    dialogflowRoutes = require('./routes/dialogflowRoutes');
    
    // Verificación y logs
    console.log('Tipo de dialogflowRoutes:', typeof dialogflowRoutes);
    
    if (typeof dialogflowRoutes === 'function') {
        app.use('/api', dialogflowRoutes);
        console.log('✅ Rutas Dialogflow registradas correctamente');
    } else {
        console.error('❌ dialogflowRoutes no es una función:', dialogflowRoutes);
        
        // Crear ruta de emergencia
        app.post('/api/chatbot', (req, res) => {
            res.json({ status: 'fallback', message: 'Ruta temporal activada' });
        });
    }
} catch (error) {
    console.error('❌ Error cargando rutas Dialogflow:', error);
    
    // Crear ruta de emergencia
    app.post('/api/chatbot', (req, res) => {
        res.status(500).json({ 
            error: 'Error interno',
            details: error.message
        });
    });
}

// ======================================
// RUTA PARA CORREO ELECTRÓNICO
// ======================================
app.post('/send-email', async (req, res) => {
    // ... (mantén tu código existente para el correo) ...
});

// ======================================
// MANEJADOR DE ERRORES
// ======================================
app.use((err, req, res, next) => {
    console.error('❌ Error global:', err.stack);
    res.status(500).send('Algo salió mal!');
});

// ======================================
// INICIO DEL SERVIDOR
// ======================================
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`🔒 Credenciales Dialogflow: ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`);
});
