// Chatbot flotante reutilizable LARCAD
(function() {
  // Inserta el HTML del chatbot automáticamente
  const chatbotHTML = `
    <div id="chatbot-container" class="fixed bottom-6 right-6 z-50">
      <button id="chatbot-toggle" onclick="toggleChat()" class="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none transition-transform duration-200 hover:scale-110">💬</button>
      <div id="chatbot-box" class="hidden w-80 bg-white text-black rounded-lg shadow-2xl mt-2 p-4 max-h-[400px] flex flex-col">
        <div id="chat-mensajes" class="flex-1 overflow-y-auto mb-4 space-y-2 text-sm"></div>
        <div class="flex gap-2">
          <input type="text" id="chat-entrada" placeholder="Escribe..." class="flex-1 border rounded px-2 py-1 focus:outline-none" />
          <button onclick="enviarAlBot()" class="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">Enviar</button>
        </div>
      </div>
    </div>
  `;
  document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('larcad-chatbot');
    if (container && !document.getElementById('chatbot-container')) {
      container.innerHTML = chatbotHTML;
    }
    initChatbot();
  });

  let chatYaSaludo = false;
  let sessionId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  let mensajes, entrada;

  function initChatbot() {
    mensajes = document.getElementById('chat-mensajes');
    entrada = document.getElementById('chat-entrada');
    if (!mensajes || !entrada) return;
    document.getElementById('chatbot-box').classList.add('hidden');
    document.getElementById('chatbot-box').classList.remove('flex');
    entrada.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') enviarAlBot();
    });
  }

  window.toggleChat = function() {
    const box = document.getElementById('chatbot-box');
    mensajes = document.getElementById('chat-mensajes');
    if (box.classList.contains('hidden')) {
      box.classList.remove('hidden');
      box.classList.add('flex');
      if (!chatYaSaludo) {
        mensajes.innerHTML = `<div class="chat-bubble-bot">¡Hola! Soy el asistente de LARCAD. ¿En qué puedo ayudarte?</div>`;
        sugerirOpciones();
        chatYaSaludo = true;
      }
    } else {
      box.classList.add('hidden');
      box.classList.remove('flex');
    }
    mensajes.scrollTop = mensajes.scrollHeight;
  }

  window.enviarAlBot = async function(mensaje) {
    mensajes = document.getElementById('chat-mensajes');
    entrada = document.getElementById('chat-entrada');
    if (!mensaje) {
      mensaje = entrada.value.trim();
      if (!mensaje) return;
      mensajes.innerHTML += `<div class="chat-bubble-user">${mensaje}</div>`;
      entrada.value = '';
      mensajes.scrollTop = mensajes.scrollHeight;
    }
    try {
      mensajes.innerHTML += `<div class="chat-bubble-bot" id="loading-indicator">Escribiendo...</div>`;
      mensajes.scrollTop = mensajes.scrollHeight;
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: mensaje, sessionId: sessionId })
      });
      const data = await res.json();
      const loadingIndicator = document.getElementById('loading-indicator');
      if (loadingIndicator) loadingIndicator.remove();
      mensajes.innerHTML += `<div class="chat-bubble-bot">${data.fulfillmentText}</div>`;
      mensajes.scrollTop = mensajes.scrollHeight;
      sugerirOpciones(mensaje, data.fulfillmentText);
    } catch (error) {
      mensajes.innerHTML += `<div class="chat-bubble-bot text-red-500"><strong>Error:</strong> No se pudo conectar con el asistente</div>`;
      mensajes.scrollTop = mensajes.scrollHeight;
    }
  }

  window.sugerirOpciones = function(ultimoMensaje = '', respuestaBot = '') {
    mensajes = document.getElementById('chat-mensajes');
    let sugerencias = [];
    const msg = (ultimoMensaje || '').toLowerCase();
    if (msg.includes('servicio')) {
      sugerencias = [
        { t: 'Ver lista de servicios', v: '¿Qué servicios ofrecen?' },
        { t: 'Solicitar cotización', v: '¿Me puedes dar una cotización?' },
        { t: 'Ver requisitos', v: '¿Cuáles son los requisitos para el hosting?' }
      ];
    } else if (msg.includes('costo') || msg.includes('precio') || msg.includes('cotiz')) {
      sugerencias = [
        { t: 'Solicitar cotización', v: '¿Me puedes dar una cotización?' },
        { t: 'Ver lista de precios', v: '¿Tienen una lista de precios?' },
        { t: 'Contactar comercial', v: '¿Cómo contacto a comercial?' }
      ];
    } else if (msg.includes('soporte')) {
      sugerencias = [
        { t: 'Contactar soporte', v: '¿Tienen soporte técnico?' },
        { t: 'Horario de soporte', v: '¿Cuál es el horario de soporte?' },
        { t: 'Reportar incidente', v: '¿Cómo reporto un incidente?' }
      ];
    } else if (msg.includes('certific')) {
      sugerencias = [
        { t: 'Ver certificaciones', v: '¿El centro tiene certificaciones?' },
        { t: 'Normas de calidad', v: '¿Cumplen alguna norma de calidad?' }
      ];
    } else if (msg.includes('infraestructura')) {
      sugerencias = [
        { t: 'Ver infraestructura', v: '¿Qué infraestructura tienen?' },
        { t: 'Alta disponibilidad', v: '¿Tienen alta disponibilidad?' }
      ];
    } else if (msg.includes('drp') || msg.includes('desastre')) {
      sugerencias = [
        { t: '¿Qué es DRP?', v: '¿Qué es el servicio de DRP?' },
        { t: 'Respaldo de emergencia', v: '¿Ofrecen respaldo de emergencia?' }
      ];
    } else {
      sugerencias = [
        { t: '¿Qué servicios ofrecen?', v: '¿Qué servicios ofrecen?' },
        { t: '¿Dónde están ubicados?', v: '¿Dónde están ubicados?' },
        { t: '¿Cómo puedo contactarlos?', v: '¿Cómo puedo contactarlos?' }
      ];
    }
    const unicos = [];
    const valores = new Set();
    sugerencias.forEach(s => {
      if (!valores.has(s.v)) {
        valores.add(s.v);
        unicos.push(s);
      }
    });
    let html = '<div class="flex flex-col gap-2 mt-4">';
    unicos.forEach(s => {
      html += `<button onclick="enviarAlBot('${s.v}')" class="bg-blue-500 text-white px-3 py-1 rounded-lg self-start hover:bg-blue-700 transition">${s.t}</button>`;
    });
    html += '</div>';
    mensajes.innerHTML += html;
    mensajes.scrollTop = mensajes.scrollHeight;
  }
})();
