require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const dialogflow = require('@google-cloud/dialogflow');

const app = express();
const PORT = process.env.PORT || 3000;

// ======================================
// CONFIGURACIÓN CRÍTICA DE DIALOGFLOW
// ======================================
// ... código anterior ...

try {
    // Importar rutas del chatbot
    const dialogflowRoutes = require('./routes/dialogflowRoutes');
    
    // Verifica que sea una función válida
    if (typeof dialogflowRoutes !== 'function') {
        throw new Error('dialogflowRoutes no es una función válida');
    }
    
    app.use('/api', dialogflowRoutes);
} catch (error) {
    console.error('❌ Error cargando rutas Dialogflow:', error);
    process.exit(1);
}

// ... resto del código ...

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

console.log('Rutas Dialogflow:', dialogflowRoutes);
console.log('Tipo:', typeof dialogflowRoutes);
// ======================================
// RUTAS
// ======================================
// Importar rutas del chatbot
const dialogflowRoutes = require('./routes/dialogflowRoutes');
app.use('/api', dialogflowRoutes);

// Ruta para manejar el envío del formulario
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
