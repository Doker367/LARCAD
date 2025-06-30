# LARCAD - Laboratorio Regional de Cómputo de Alto Desempeño

Proyecto web que documenta y difunde las capacidades del centro especializado en procesamiento de datos de alto rendimiento de la Universidad Autónoma de Chiapas.

---

## 📐 Arquitectura del Proyecto

### Frontend

- **Sitio web estático** con HTML.
- **Tailwind CSS** para diseño responsivo.
- **AOS** para animaciones al hacer scroll.
- **Chatbot con Dialogflow** para interacción automatizada con usuarios.

### Backend

- **Node.js + Express** para manejo del servidor.
- **Archivos estáticos** servidos desde `/public`.

---

## ⚙ Instalación

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/usuario/larcad.git
   cd larcad
   ```

2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Crear archivo `.env` con tus credenciales SMTP:

   ```env
   EMAIL_USER=tu_correo@gmail.com
   EMAIL_PASS=tu_contraseña
   ```

4. Iniciar el servidor:

   ```bash
   node src/index.js
   ```

---

## 📦 Dependencias

### Backend

- express
- nodemailer
- body-parser
- cors
- dotenv
- path

### Frontend (CDN)

- tailwindcss
- AOS
- Dialogflow Webhook

---

## 📮 API - Envío de Correo

- **POST** `/send-email`

#### Cuerpo de la petición:

```json
{
  "name": "Juan Pérez",
  "email": "juan.perez@example.com",
  "message": "Hola, me gustaría obtener más información sobre los servicios de cómputo."
}
```

#### Estructura del correo enviado:

```html
<h3>Nuevo mensaje desde el sitio web</h3>
<p><strong>Nombre:</strong> Juan Pérez</p>
<p><strong>Email:</strong> juan.perez@example.com</p>
<p><strong>Mensaje:</strong> Hola, me gustaría obtener más información sobre los servicios de cómputo.</p>
```

---

## 🖥️ Infraestructura y Software del LARCAD

### Hardware

- 360 servidores con procesadores Intel Xeon
- Clusters de almacenamiento
- Red de alto rendimiento

### Software

- **Simulación**: CORSIKA, FLUKA, Geant4
- **Paralelismo**: FFTW, OpenMPI
- **Compiladores**: GCC, Intel Compiler Suite

---

## 🔐 Seguridad

- **Helmet**: Cabeceras HTTP seguras (protección XSS, clickjacking, etc.)
- **Desactivación de `X-Powered-By`** para evitar fingerprinting
- **Redirección a HTTPS** (opcional)

> ⚠️ Seguridad aún no implementada activamente en el entorno de producción.

---

## 📁 Estructura del Proyecto

```
LARCAD/
├── config/
│   └── secure.js
└── src/
    ├── index.js
    └── public/
        ├── index.html
        ├── hardware.html
        ├── software.html
        ├── servicio.html
        ├── nosotros.html
        └── contacto.html
```

---

## 🧩 Servicios del Laboratorio

- **Housing**: Alojamiento de equipos de cómputo
- **Backup**: Respaldo y recuperación de datos

---

## ✅ Conclusión

LARCAD es una plataforma sencilla pero sólida que documenta las capacidades de un centro de cómputo de alto rendimiento. El uso de tecnologías modernas como Tailwind, Node.js y Dialogflow facilita su mantenimiento y evolución. Aunque aún hay áreas de mejora en cuanto a seguridad y documentación formal de dependencias, se establece una base técnica robusta para su escalabilidad futura.

---
