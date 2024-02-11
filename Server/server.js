const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();
app.use(bodyParser.json());

// Connection URL
const url = 'mongodb+srv://ClientSide:xYgxcyXQr9RUdrsy@rt-location.ahaubf7.mongodb.net/?retryWrites=true&w=majority';

// Database Name
const dbName = 'RT-location';

// Create a new MongoClient
const client = new MongoClient(url);

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

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
