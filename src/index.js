// Punto de entrada principal para la app Node.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('src/public'));

// Importar rutas
// const routes = require('./routes');
// app.use('/', routes);

// Configuración de seguridad
const secureApp = require('../config/secure');
secureApp(app);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
