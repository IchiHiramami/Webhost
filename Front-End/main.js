import Feature from 'ol/Feature.js';
import Geolocation from 'ol/Geolocation.js';
import Map from 'ol/Map.js';
import Point from 'ol/geom/Point.js';
import View from 'ol/View.js';
import fs from 'fs';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';

let latitude = null;
let longitude = null;

let intervalId = null;


const view = new View({
  center: [0, 0],
  zoom: 2,
});

const map = new Map({
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
  target: 'map',
  view: view,
});

const geolocation = new Geolocation({
  // enableHighAccuracy must be set to true to have the heading value.
  trackingOptions: {
    enableHighAccuracy: true,
  },
  projection: view.getProjection(),
});

function el(id) {
  return document.getElementById(id);
}


el('track').addEventListener('change', function () {
  geolocation.setTracking(this.checked);
  if (this.checked) {
    intervalId = setInterval(updatePosition, 10000); // 10000 milliseconds = 10 seconds
  } else if (intervalId) {
    clearInterval(intervalId);
  }
});

// update the HTML page when the position changes.
geolocation.on('change', function () {
  el('accuracy').innerText = geolocation.getAccuracy() + ' [m]';
  el('altitude').innerText = geolocation.getAltitude() + ' [m]';
  el('altitudeAccuracy').innerText = geolocation.getAltitudeAccuracy() + ' [m]';
  el('heading').innerText = geolocation.getHeading() + ' [rad]';
  el('speed').innerText = geolocation.getSpeed() + ' [m/s]';
});

// handle geolocation error.
geolocation.on('error', function (error) {
  const info = document.getElementById('info');
  info.innerHTML = error.message;
  info.style.display = '';
});

const accuracyFeature = new Feature();
geolocation.on('change:accuracyGeometry', function () {
  accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
});

const positionFeature = new Feature();
positionFeature.setStyle(
  new Style({
    image: new CircleStyle({
      radius: 6,
      fill: new Fill({
        color: '#3399CC',
      }),
      stroke: new Stroke({
        color: '#fff',
        width: 2,
      }),
    }),
  }),
);



function updatePosition() {
  const coordinates = geolocation.getPosition();
  positionFeature.setGeometry(coordinates ? new Point(coordinates) : null);
  if (coordinates) {
    latitude = coordinates[0];
    longitude = coordinates[1];
    const locationData = {
      latitude: latitude,
      longitude: longitude
    };
    // Send the location data to the server
    fetch('http://localhost:3005/locations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(locationData)
    });
  }
}

new VectorLayer({
  map: map,
  source: new VectorSource({
    features: [accuracyFeature, positionFeature],
  }),
});
