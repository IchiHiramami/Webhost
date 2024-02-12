// Import the mongodb module
const MongoClient = require('mongodb').MongoClient;
const fetch = require('node-fetch');

//env file
require('dotenv').config();

// Connection URL
const url = process.env.MONGODB_URL;

// Database Name
const dbName = 'RT-location';

// Create a new MongoClient
const client = new MongoClient(url);

// Generate a unique client ID
const clientId = 'pubtrans' + Math.random().toString(36).substring(2);

geolocation.on('change', function () {
  const data = {
    clientId: clientId,
    accuracy: accuracy,
    altitude: altitude,
    altitudeAccuracy: altitudeAccuracy,
    heading: heading,
    speed: speed,
    timestamp: new Date()
  };

  // Send the data to the server using Fetch API
  fetch('http://localhost:3000/uploadData', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch((error) => console.error('Error:', error));
});

// Use connect method to connect to the server
client.connect(function(err) {
  if (err) throw err;
  console.log("Connected successfully to server");

  const db = client.db(dbName);
  const collection = db.collection('geolocationData');

  // Function to upload geolocation data
  function uploadData() {
    const data = {
      clientId: clientId,
      accuracy: accuracy,
      altitude: altitude,
      altitudeAccuracy: altitudeAccuracy,
      heading: heading,
      speed: speed,
      timestamp: new Date()
    };

        collection.insertOne(data, function(err, result) {
            if (err) throw err;
            console.log("Geolocation data inserted");
        });
    // Send the data to the server using Fetch API
    fetch('http://localhost:3000/uploadData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch((error) => console.error('Error:', error));
  }

  // Upload geolocation data every 7.5 seconds
  setInterval(uploadData, 7500);
});
