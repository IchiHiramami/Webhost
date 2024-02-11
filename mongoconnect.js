// Import the mongodb module
const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb+srv://ClientSide:xYgxcyXQr9RUdrsy@rt-location.ahaubf7.mongodb.net/?retryWrites=true&w=majority';

// Database Name
const dbName = 'RT-location';

// Create a new MongoClient
const client = new MongoClient(url);

// Use connect method to connect to the server
client.connect(function(err) {
  if (err) throw err;
  console.log("Connected successfully to server");

  const db = client.db(dbName);
  const collection = db.collection('geolocationData');

  // Function to upload geolocation data
  function uploadData() {
    const data = {
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
  }

  // Upload geolocation data every 7.5 seconds
  setInterval(uploadData, 7500);
});
