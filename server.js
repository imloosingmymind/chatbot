// const express = require('express');
// const bodyParser = require('body-parser');
// const { SessionsClient } = require('@google-cloud/dialogflow');
// const path = require('path');

// const app = express();
// const PORT = 3000;

// // Set up body-parser middleware
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // Serve static HTML file
// app.use(express.static(path.join(__dirname, 'public')));

// // Dialogflow credentials
// const sessionClient = new SessionsClient({
//     keyFilename: 'C:/Users/HP/Desktop/chatbot-integration/dialogflow-key.json', // Forward slashes
//  });
//  const projectId = 'jennifer-njpb';
 

// // Endpoint to process user input
// app.post('/query', async (req, res) => {
//    const sessionPath = sessionClient.projectAgentSessionPath(projectId, '12345'); // Use a unique session ID

//    const request = {
//       session: sessionPath,
//       queryInput: {
//          text: {
//             text: req.body.query,
//             languageCode: 'en',
//          },
//       },
//    };

//    try {
//       const [response] = await sessionClient.detectIntent(request);
//       const result = response.queryResult;
//       res.send(result.fulfillmentText);
//    } catch (error) {
//       console.error('Dialogflow Error:', error);
//       res.status(500).send('Error connecting to Dialogflow');
//    }
// });

// app.listen(PORT, () => {
//    console.log(`Server running on http://localhost:${PORT}`);
// });

// app.post('/query', async (req, res) => {
//     const sessionPath = sessionClient.projectAgentSessionPath(projectId, '12345');
 
//     const request = {
//        session: sessionPath,
//        queryInput: {
//           text: {
//              text: req.body.query,
//              languageCode: 'en',
//           },
//        },
//     };
 
//     try {
//        const [response] = await sessionClient.detectIntent(request);
//        const result = response.queryResult;
//        res.send(result.fulfillmentText);
//     } catch (error) {
//        console.error('Error connecting to Dialogflow:', error.message, error.stack);
//        res.status(500).send('Error connecting to Dialogflow');
//     }
//  });
 
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { SessionsClient } = require("@google-cloud/dialogflow");
const axios = require('axios');
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public")); // Serve static files

// Dialogflow configuration
const dialogflowClient = new SessionsClient({
  keyFilename: "C:/Users/HP/Desktop/chatbot-integration/dialogflow-key.json",
});
const dialogflowProjectId = "jennifer-njpb";

// Chatbot endpoint
app.post("/chatbot", async (req, res) => {
  const { message, sessionId } = req.body;

  if (!message || !sessionId) {
    return res.status(400).send("Message and sessionId are required!");
  }

  const sessionPath = dialogflowClient.projectAgentSessionPath(dialogflowProjectId, sessionId);

  const request = {
    session: sessionPath,
    queryInput: {
      text: { text: message, languageCode: "en" },
    },
  };

  try {
    const responses = await dialogflowClient.detectIntent(request);
    const result = responses[0].queryResult;
    res.send({ fulfillmentText: result.fulfillmentText });
  } catch (error) {
    console.error("Dialogflow Error:", error);
    res.status(500).send("Error occurred while communicating with Dialogflow");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// const placesResponse = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
//   params: {
//       query: `top places to visit in ${location}`,
//       key: 'AIzaSyCQ34i9J-xKzAm7BLt-oIIYRG7x0atOMfI', // Replace with your actual API key
//   },
// });
