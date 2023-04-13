import {Feature, Map, Overlay, View} from 'ol/index.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import {Point} from 'ol/geom.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {useGeographic} from 'ol/proj.js';

useGeographic();

const place1 = [-121.876944, 37.661559];
const place2 = [-122.043455, 37.309450];
const place3 = [-117.728959, 33.576557];



const pleasanton = new Point(place1);
const cupertino = new Point(place2);
const aliso = new Point(place3);


const map = new Map({
  target: 'map',
  view: new View({
    center: [-120.455398, 35.348338],
    zoom: 8,
  }),
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
    new VectorLayer({
      source: new VectorSource({
        features: [new Feature(pleasanton)],
      }),
      style: {
        'circle-radius': 12,
        'circle-fill-color': 'red',
      },
    }),
      new VectorLayer({
      source: new VectorSource({
        features: [new Feature(cupertino)],
      }),
      style: {
        'circle-radius': 10,
        'circle-fill-color': 'blue',
      },
    }),
      new VectorLayer({
      source: new VectorSource({
        features: [new Feature(aliso)],
      }),
      style: {
        'circle-radius': 8,
        'circle-fill-color': 'green',
      },
    })
  ],
});

const element = document.getElementById('popup');

const popup = new Overlay({
  element: element,
  stopEvent: false,
});
map.addOverlay(popup);

function formatCoordinate(coordinate) {
  return `
    <table>
      <tbody>
        <tr><th>lon</th><td>${coordinate[0].toFixed(2)}</td></tr>
        <tr><th>lat</th><td>${coordinate[1].toFixed(2)}</td></tr>
      </tbody>
    </table>`;
}

const info = document.getElementById('info');
map.on('moveend', function () {
  const view = map.getView();
  const center = view.getCenter();
  info.innerHTML = formatCoordinate(center);
});

let popover;
map.on('click', function (event) {
  if (popover) {
    popover.dispose();
    popover = undefined;
  }
  const feature = map.getFeaturesAtPixel(event.pixel)[0];
  if (!feature) {
    return;
  }
  const coordinate = feature.getGeometry().getCoordinates();
  popup.setPosition([
    coordinate[0] + Math.round(event.coordinate[0] / 360) * 360,
    coordinate[1],
  ]);

  popover = new bootstrap.Popover(element, {
    container: element.parentElement,
    content: formatCoordinate(coordinate),
    html: true,
    offset: [0, 20],
    placement: 'top',
    sanitize: false,
  });
  popover.show();
});

map.on('pointermove', function (event) {
  const type = map.hasFeatureAtPixel(event.pixel) ? 'pointer' : 'inherit';
  map.getViewport().style.cursor = type;
});
