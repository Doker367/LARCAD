const express = require('express');
const router = express.Router();
const dialogflowController = require('../controllers/dialogflowController');

router.post('/chatbot', async (req, res) => {
  try {
    console.log('📬 Solicitud POST recibida en /api/chatbot');
    console.log('Body recibido:', req.body);
    
    const sessionClient = req.app.locals.sessionClient;
    const { message, sessionId = 'default-session' } = req.body;
    
    // Validación básica
    if (!message || typeof message !== 'string') {
      console.warn('❌ Validación fallida: message no es un string');
      return res.status(400).json({
        error: 'El parámetro "message" es requerido y debe ser un string'
      });
    }
    
    console.log(`🔍 Procesando mensaje: "${message}" (sessionId: ${sessionId})`);
    
    // Procesar con Dialogflow
    const respuesta = await dialogflowController.detectIntent(
      sessionClient,
      message,
      sessionId
    );
    
    console.log('✅ Respuesta de Dialogflow:', respuesta);
    res.json(respuesta);
    
  } catch (error) {
    console.error('💥 Error en /chatbot:', error);
    res.status(500).json({
      error: error.message || 'Error al procesar el mensaje',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

console.log('✅ Ruta /api/chatbot configurada correctamente');
module.exports = router;
