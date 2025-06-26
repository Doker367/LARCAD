const express = require('express');
const router = express.Router();
const { detectarIntencion } = require('../controllers/chatController');

router.post('/api/chat', async (req, res) => {
  try {
    const { mensaje } = req.body;
    const respuesta = await detectarIntencion(mensaje);
    res.json({ respuesta });
  } catch (err) {
    console.error('Error en Dialogflow:', err);
    res.status(500).json({ respuesta: 'Error al procesar tu mensaje.' });
  }
});

module.exports = router;
