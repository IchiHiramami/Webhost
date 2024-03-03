const mongoose = require('mongoose');
const express = require('express');
const Location = require('./model/location.js'); 
const dotenv = require('dotenv');
const cors = require('cors');


dotenv.config();
mongoose.set('strictQuery', false);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const url = process.env.CONNECTION;
const port = 3005;

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
    console.log('phase1 88% complete')
    await newLocation.save();
    console.log({newLocation});
    res.status(201).json({newLocation});
  } catch (e) {
    console.error(e); // Log the error
    res.status(400).json({ error: 'Failed to save location data.' });
    console.log(e.message);
  }
});

app.get('/', (req, res) => {
  //landing page
      res.send('Welcome');
  });
  
  //list out all location data without filters
  app.get('/locations/results', async (req, res) => {
  
      try{
          const result = await Location.find();
          res.send ({"Location": result});
      } catch(e){
          res.status(500).json({error: e.message});
      }
  });
  
  //reading location data with specific id
  app.get('/locations/:id', async (req, res) => {
      console.log('Location Read');
      try {
          const {id: locationId} = req.params;
          console.log(locationId);
          const location = await Location.findById(locationId);
          console.log(location);
          if(!location){
              res.status(404).json({error: 'User not Found'});
          } else {
              res.json({location});
          }
      } catch(e){
          res.status(500).json({error: e.message});
      }
  });

  app.put('/locations/:id', async (req, res) => {
    try{
        const locationId = req.params.id;
        let data = req.body;
        const result = await Location.findOneAndReplace({_id: locationId}, data, {new: true}); //take your data, change it in the database, and return to you the new data
        console.log(req.body);
        res.json({location: result});
    } catch(e) {
        console.log(e.message)
        res.status(500).json({error: e.message});
    }
});

const start = async() => {
  try{
      await mongoose.connect(url);

      app.listen(port, () => {
          console.log('App listening on port' + port);
      });
  } catch(error) {
      console.log(error.message);
  }

};

start();