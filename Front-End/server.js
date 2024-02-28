const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const http = require('http');

require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Connection URL
const url = process.env.MONGODB_URL;

// Database Name
const dbName = 'Geolocation';

// Create a new MongoClient
const client = new MongoClient(url);

const PORT = process.env.PORT_NUMCONFIG || 3000;
let collection;

// Use connect method to connect to the server
client.connect(function(err) {
  if (err) throw err;
  console.log("Connected successfully to server");

  const db = client.db(dbName);
  collection = db.collection('geolocationData');
});

app.post('/uploadData', (req, res) => {
  const data = req.body;

  // Only accept data from 'pubtrans' clients
  if (!data.clientId.startsWith('pubtrans')) {
    res.status(403).send('Unauthorized client.');
    return;
  }

  // Delete existing data for this client
  collection.deleteMany({ clientId: data.clientId }, function(err, result) {
    if (err) {
      console.error(err);
      res.status(500).send('Error occurred while deleting old data.');
      return;
    }

    // Insert new data
    collection.insertOne(data, function(err, result) {
      if (err) {
        console.error(err);
        res.status(500).send('Error occurred while saving data.');
      } else {
        console.log("Geolocation data inserted");
        res.status(200).send('Data saved successfully.');
      }
    });
  });
});

const server = http.createServer(app);

// Use socket.io for real-time communication between server and 'user' client
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('A user connected');

  // Send the latest geolocation data to 'user' client when 'pubtrans' client updates data
  collection.watch().on('change', data => {
    if (data.operationType === 'insert' && data.fullDocument.clientId.startsWith('pubtrans')) {
      // Emit the data to 'user' client with the clientId as the event name
      socket.emit(data.fullDocument.clientId, data.fullDocument);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(process.env.PORT_NUMCONFIG, () => {
  console.log('Server is running on port' + PORT);
});
