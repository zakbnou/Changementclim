function getColorFor(d) {
  return d > 10912 ? '#7a0177' :
    d > 6291 ? '#c51b8a' :
    d > 3009 ? '#f768a1' :
    d > 988 ? '#fbb4b9' :
    d > -1 ? '#feebe2':
    '#8f8f8f';
}

var map = L.map('map').setView([28, 10], 4);

L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
  attribution: 'Bnoulkacem zakaria'
}).addTo(map);
var timeline;
var timelineControl;

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 988, 3009, 6291,10912],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColorFor(grades[i] + 1) + '"></i> ' + grades[i] +'ha'+ (grades[i + 1] ? '&ndash;' + grades[i + 1] + 'ha<br> <br>' : '+');
    }

    return div;
};

legend.addTo(map);

info.update = function (props) {
    this._div.innerHTML = '<h4>Superficie perdue: </h4>' + (props ?
        'Paye: <b>' + props.paye + '</b> <br />Superficie : ' + props.foret_perdue +'ha' : '');
};

info.addTo(map);


function onEachFeature(feature, layer) {
  layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature
  });

  function highlightFeature(e) {
      var layer = e.target;

      layer.setStyle({
          weight: 5,
          dashArray: '.',
          fillOpacity: 0.2
      });

      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
          layer.bringToFront();
      }
      info.update(layer.feature.properties);

  }
}

function resetHighlight(e) {
  
  timeline.resetStyle(e.target);
  info.update();
}
function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

timeline = L.timeline(data, {
  style: function (data) {
    return {
      stroke: 1,
      fillColor: getColorFor(data.properties.foret_perdue),
      fillOpacity: 0.8,
      weight: 2,
      color : 'Black',
      dashArray :'2',
    };
  },
  waitToUpdateMap: true,
  onEachFeature: onEachFeature
  },
);

timelineControl = L.timelineSliderControl({
  formatOutput: function (date) {
    return new Date(date).getFullYear();
  },
  enableKeyboardControls: true,
  position: 'bottomleft'
});
timeline.addTo(map);
timelineControl.addTo(map);
timelineControl.addTimelines(timeline);