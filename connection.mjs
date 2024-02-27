import mongoose from 'mongoose';
import express from 'express';
import Location from './model/location.js'; 
import dotenv from 'dotenv';

dotenv.config();
mongoose.set('strictQuery', false);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const url = process.env.CONNECTION;
const port = 3009;

app.post('/locations', async (req, res) => {
  console.log(req.body);
  const newLocation = new Location(req.body);
  try{
    await newLocation.save();
    res.status(201).json({newLocation});
  } catch (e) {
    res.status(400).json({error: e.message});
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