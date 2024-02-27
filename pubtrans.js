// Import the mongodb module
import { MongoClient } from 'mongodb';
import fetch from 'node-fetch';
import mongoose from 'mongoose';

//env file
require('dotenv').config();

// Connection URL
const url = process.env.CONNECTION;

// Database Name
const dbName = 'Geolocation';

// Create a new MongoClient
const client = new MongoClient(url);

// Generate a unique client ID
const clientId = 'pubtrans' + Math.random().toString(36).substring(2);
 
// Function to upload geolocation data
function uploadData(accuracy, altitude, altitudeAccuracy, heading, speed) {
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
}

// Export the uploadData function
export default uploadData;


// Use connect method to connect to the server
client.connect(function(err) {
  if (err) throw err;
  console.log("Connected successfully to server");

  const db = client.db(dbName);
  const collection = db.collection('PubTransLocation');
});
