const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
const path = require('path');

const keyPath = path.join(__dirname, '../../config/dialogflow-wey.json'); // 👈 importante

const projectId = 'cohesive-memory-457806-s1'; // Copia esto del .json o desde Google Cloud

async function detectarIntencion(mensajeUsuario) {
  const sessionId = uuid.v4();
  const sessionClient = new dialogflow.SessionsClient({ keyFilename: keyPath });
  const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: mensajeUsuario,
        languageCode: 'es',
      },
    },
  };

  const responses = await sessionClient.detectIntent(request);
  const fulfillmentText = responses[0].queryResult.fulfillmentText;
  console.log('Respuesta de Dialogflow:', fulfillmentText);
  return fulfillmentText;
 } catch (error){
  console.error('❌ ERROR detectando intención:', error);
  throw error; // importante para que el .catch del router lo capture
  }
}

module.exports = { detectarIntencion };
