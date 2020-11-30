var map = L.map('map').setView([33, -6],6);

L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
    attribution: 'Bnoulkacem zakaria'
}).addTo(map);



function style_incendies(feature) {
    
    
    if (feature.properties['superficie'] >= 0.000000 && feature.properties.superficie <= 1.000000 ) {
        return {   
        color: 'rgba(35,35,35,1.0)',
        fillColor: 'rgba(231,244,66,1.0)',
        radius: Math.abs(Math.log(1+feature.properties.superficie))+3,
        opacity: 1,
        dashArray: '',
        lineCap: 'butt',
        lineJoin: 'miter',
        weight: 1,
        fill: true,
        fillOpacity: 1 ,
        interactive: true,
    }
    }
    if (feature.properties['superficie'] >= 1.000000 && feature.properties.superficie <= 10.000000 ) {
        return {
        color: 'rgba(35,35,35,1.0)',
        fillColor: 'rgba(231,150,74,1.0)',
        radius: Math.log(1+feature.properties.superficie)+3,
        opacity: 1,
        dashArray: '',
        lineCap: 'butt',
        lineJoin: 'miter',
        weight: 1,
        fill: true,
        fillOpacity: 1 ,
        interactive: true,
    }
    }
    if (feature.properties['superficie'] >= 10.000000 && feature.properties.superficie <= 2282.000000 ) {
        return {
        color: 'rgba(35,35,35,1.0)',
        fillColor: 'rgba(227,26,28,1.0)',
        radius: Math.log(1+feature.properties.superficie)+3,
        opacity: 1,
        dashArray: '',
        lineCap: 'butt',
        lineJoin: 'miter',
        weight: 1,
        fill: true,
        fillOpacity: 1 ,
        interactive: true,
    }
    }
    
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
        
        var popupContent = '<table>\
            <tr>\
                <th scope="row">foret</th>\
                <td>' + (feature.properties.foret !== null ? feature.properties.foret : '') + '</td>\
            </tr>\
            <tr>\
                <th scope="row">date</th>\
                <td>' + (feature.properties.date!== null ? feature.properties.date : '') + '</td>\
            </tr>\
            <tr>\
                <th scope="row">superficie</th>\
                <td>' + (feature.properties.superficie !== null ? feature.properties.superficie + ' Ha' : '') + '</td>\
            </tr>\
        </table>';
        layer.bindPopup(popupContent, {maxHeight: 400});

    }
}
function resetHighlight(e) {
    geojson.resetStyle(e.target);
    

}
function zoomToFeature(e) {
    map.flyTo(e.latlng , 15);
}
var geojson = L.geoJson(incendie, {
    interactive: true,
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
        
        return L.circleMarker(latlng, style_incendies(feature));
    },
   
}).addTo(map);


///LA LÉGENDE////
var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');
        div.innerHTML += 
        
        '<img src="../images/legendeincendie.svg" />';


    return div;
};
legend.addTo(map);
L.control.scale().addTo(map);