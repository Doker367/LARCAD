// Seguridad básica para Express
const helmet = require('helmet');

module.exports = function secureApp(app) {
  // Usa Helmet para agregar cabeceras de seguridad
  app.use(helmet());

  // Deshabilita el encabezado X-Powered-By
  app.disable('x-powered-by');

  // Opcional: fuerza HTTPS (si tienes proxy/reverse proxy)
  // app.use((req, res, next) => {
  //   if (req.headers['x-forwarded-proto'] !== 'https') {
  //     return res.redirect('https://' + req.headers.host + req.url);
  //   }
  //   next();
  // });
};
