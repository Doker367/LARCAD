const dialogflow = require('@google-cloud/dialogflow');

const detectIntent = async (sessionClient, message, sessionId) => {
  try {
    const projectId = await sessionClient.getProjectId();
    const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

    const [response] = await sessionClient.detectIntent({
      session: sessionPath,
      queryInput: {
        text: {
          text: message,
          languageCode: 'es',  // Asegura que usa español
        },
      },
    });

    const result = response.queryResult;
    
    // Manejo mejorado de respuestas
    if (result.intent.displayName === 'Default Fallback Intent') {
      console.warn('⚠️ Dialogflow no reconoció la intención');
      return {
        fulfillmentText: 'Lo siento, no entendí tu pregunta. ¿Podrías reformularla?',
        intent: result.intent.displayName,
        isFallback: true
      };
    }
    
    return {
      fulfillmentText: result.fulfillmentText,
      intent: result.intent.displayName,
      confidence: result.intentDetectionConfidence,
      parameters: result.parameters.fields
    };
    
  } catch (error) {
    console.error('Error en Dialogflow:', error);
    throw new Error('No pude procesar tu solicitud. Por favor intenta nuevamente.');
  }
};

// Exportación única
module.exports = {
  detectIntent
};
