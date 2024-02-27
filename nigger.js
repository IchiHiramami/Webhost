import Feature from 'ol/Feature.js';
import Geolocation from 'ol/Geolocation.js';
import Map from 'ol/Map.js';
import Point from 'ol/geom/Point.js';
import View from 'ol/View.js';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';

// Import the uploadData function from pubtrans.js
import uploadData from './pubtrans';

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
  trackingOptions: {
    enableHighAccuracy: true,
  },
  projection: view.getProjection(),
});

function el(id) {
  return document.getElementById(id);
}

let accuracy, altitude, altitudeAccuracy, heading, speed;

geolocation.on('change', function () {
  accuracy = geolocation.getAccuracy();
  altitude = geolocation.getAltitude();
  altitudeAccuracy = geolocation.getAltitudeAccuracy();
  heading = geolocation.getHeading();
  speed = geolocation.getSpeed();

  el('accuracy').innerText = accuracy + ' [m]';
  el('altitude').innerText = altitude + ' [m]';
  el('altitudeAccuracy').innerText = altitudeAccuracy + ' [m]';
  el('heading').innerText = heading + ' [rad]';
  el('speed').innerText = speed + ' [m/s]';
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
  })
);

geolocation.on('change:position', function () {
  const coordinates = geolocation.getPosition();
  positionFeature.setGeometry(coordinates ? new Point(coordinates) : null);
});

new VectorLayer({
  map: map,
  source: new VectorSource({
    features: [accuracyFeature, positionFeature],
  }),
});

// Call the uploadData function every 5 seconds as long as tracking is enabled
setInterval(function() {
  if (geolocation.getTracking()) {
    uploadData(accuracy, altitude, altitudeAccuracy, heading, speed);
  }
}, 5000);
