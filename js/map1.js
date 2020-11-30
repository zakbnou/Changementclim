var map = L.map('map').setView([28, 10], 4);

L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
    attribution: 'Bnoulkacem zakaria'
}).addTo(map);

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function getColor(d) {
    return d > 30 ? '#7a0177' :
        d> 20 ? '#c51b8a':
        d > 10 ? '#f768a1' :
        d > -1 ? '#fbb4b9' :
        '#8f8f8f';
}

function layerstyle(feature) {
    return {
        weight: 2,
        opacity: 2,
        color: 'black',
        dashArray: '2',
        fillOpacity: 1,
        fillColor: getColor(feature.properties.m_h_vul_p)
    };
}



function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();

}

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
            color: '#fffff',
            dashArray: '',
            fillOpacity: 0.7
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
        info.update(layer.feature.properties);

    }
}
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 20, 30],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' + grades[i] +'%'+ (grades[i + 1] ? '&ndash;' + grades[i + 1] + '%<br> <br>' : '+');
    }

    return div;
};

legend.addTo(map);

info.update = function (props) {
    this._div.innerHTML = '<h4>Pourcentage des terres de moyenne à haute vulnérabilité à la sécheresse : </h4>' + (props ?
        'pays: <b>' + props.pays + '</b> <br />Pourcentage : ' + props.m_h_vul_p +'%' : '');
};

info.addTo(map);

var geojson = L.geoJson(DroughtVulnPercentage, {
    style: layerstyle,
    onEachFeature: onEachFeature,
}).addTo(map);

L.control.scale().addTo(map);