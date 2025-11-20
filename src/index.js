require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const dialogflow = require('@google-cloud/dialogflow');

const app = express();
const PORT = process.env.PORT || 3000;

// ======================================
// CONFIGURACIÓN CRÍTICA DE DIALOGFLOW
// ======================================
try {
    // Verifica que el archivo de credenciales exista
    const credentialsPath = path.resolve(__dirname, '../config/dialogflow-credentials.json');
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
        });
} catch (error) {
    console.error('❌ Error inicializando Dialogflow:', error);
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
// RUTAS - CONFIGURACIÓN PRINCIPAL
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
    try {
        const { nombre, apellidos, telefono, correo, mensaje } = req.body;

        // Validación básica
        if (!nombre || !correo || !mensaje) {
            return res.status(400).json({
                success: false,
                message: 'Nombre, correo y mensaje son obligatorios'
            });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            }
        });

        const mailOptions = {
            from: `"LARCAD - Sitio Web" <${process.env.GMAIL_USER}>`,
            to: 'larcad@unach.mx',
            subject: 'Nuevo mensaje de contacto',
            text: `Nombre: ${nombre}\nApellidos: ${apellidos}\nTeléfono: ${telefono}\nCorreo: ${correo}\nMensaje: ${mensaje}`,
            html: `
                <h2>Nuevo mensaje de contacto</h2>
                <p><strong>Nombre:</strong> ${nombre}</p>
                <p><strong>Apellidos:</strong> ${apellidos}</p>
                <p><strong>Teléfono:</strong> ${telefono}</p>
                <p><strong>Correo:</strong> ${correo}</p>
                <p><strong>Mensaje:</strong> ${mensaje}</p>
            `
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({
            success: true,
            message: 'Correo enviado con éxito!'
        });
    } catch (error) {
        console.error('Error completo:', error);
        res.status(500).json({
            success: false,
            message: 'Error al enviar el correo.',
            systemError: error.toString()
        });
    }
});

// ======================================
// FUNCIONES DE DIALOGFLOW
// ======================================
const credentialsPath = path.join(__dirname, '../config/dialogflow-credentials.json');
const sessionClient = new dialogflow.SessionsClient({ keyFilename: credentialsPath });

// Función para enviar un mensaje a Dialogflow
async function sendMessageToDialogflow(sessionId, message) {
    const sessionPath = sessionClient.projectAgentSessionPath('chatbotlarcad-oayu', sessionId);

    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: message,
                languageCode: 'en',
            },
        },
    };

    const responses = await sessionClient.detectIntent(request);
    return responses[0].queryResult;
}

// Uso de ejemplo
(async () => {
    const sessionId = 'example-session-id';
    const userMessage = 'Hello!';
    const response = await sendMessageToDialogflow(sessionId, userMessage);
    console.log('Dialogflow response:', response);
})();

// ======================================
// MANEJADOR DE ERRORES
// ======================================
app.use((err, req, res, next) => {
    console.error('❌ Error global:', err.stack);
    res.status(500).send('Algo salió mal!');
});

// ======================================
// INICIO DEL SERVIDOR CON LOGS DETALLADOS
// ======================================
app.listen(PORT, '0.0.0.0', () => {
    console.log('====================================');
    console.log('🚀 Servidor corriendo en http://localhost:3000');
    console.log('🔒 Credenciales Dialogflow:', process.env.GOOGLE_APPLICATION_CREDENTIALS);
    console.log('🔍 Endpoints disponibles:');
    console.log('   POST /api/chatbot');
    console.log('   POST /send-email');
    console.log('====================================');
});

