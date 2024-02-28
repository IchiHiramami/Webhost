const mongoose = require('mongoose');
const express = require('express');
const Location = require('./model/location.js'); 
const dotenv = require('dotenv');
const fs = require('fs').promises;

dotenv.config();
mongoose.set('strictQuery', false);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const url = process.env.CONNECTION;
const port = process.env.PORT || 3000;

app.post('/locations', async (req, res) => {
  const locationData = req.body;  
  const initLatitude = locationData.latitude;
  const initLongitude = locationData.longitude;
  console.log("latitude:", initLatitude, "Longitude", initLongitude);
  
  const newLocation = new Location({
    latitude: initLatitude || 0,
    longitude: initLongitude || 0
  });
  try {
    await newLocation.save();
    console.log({newLocation});
    res.status(201).json({newLocation});
  } catch (e) {
    console.error(e); // Log the error
    res.status(400).json({ error: 'Failed to save location data.' });
    console.log(e.message);
  }
});

let locationData = null;

app.post('/locations/test', async(req, res) => {
  locationData = req.body; // Assign the received data to the variable
  console.log(locationData); // Log the data to the console
  res.sendStatus(200); // Send a success status back to the client
});

const start = async() => {
  try{
      await mongoose.connect(url);

      app.listen(port, () => {
          console.log('App listening on port' + port);
          console.log(url);
      });
  } catch(error) {
      console.log(error.message);
  }

};

start();