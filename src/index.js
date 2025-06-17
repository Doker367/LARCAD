const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // Añade esta línea

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para manejar el envío del formulario
app.post('/send-email', (req, res) => {
    const { nombre, apellidos, telefono, correo, mensaje } = req.body;
    
    // Configurar el transportador de nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'alberto.grajales97@unach.mx',
            pass: 'plgi vmge tunh bzbj'
        }
    });
    
    // Configurar el email
    const mailOptions = {
        from: 'LARCAD',
        to: 'alberto.grajales97@unach.mx',
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
    
    // Enviar el correo
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar el correo:', error);
            return res.status(500).json({ success: false, message: 'Error al enviar el correo.' });
        }
        res.status(200).json({ success: true, message: 'Correo enviado con éxito!' });
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});