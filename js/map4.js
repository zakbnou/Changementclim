var center = [2, 30];
var map = new maptalks.Map('map', {
    center: center,
    zoom: 4,
    pitch: 30,
    baseLayer: new maptalks.TileLayer('tile', {
        'urlTemplate': 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    }),
    attribution: 'Bnoulkacem zakaria'
});

new maptalks.control.Attribution({
    position: 'top-left',
    content: '<div class="info">Pourcentages des terres désertifiées modérément à tres sévèrement: <br> <p> click droit pour modifier l&#8217angle de vue </p> </div>'
}).addTo(map);

var symbol = {
    'polygonOpacity': 1,
    'polygonFill': 'rgba(0, 255, 0, 1)'
};

data.features.forEach(function (f) {
    
    f.properties.height = f.properties.percentage*10000;
});

var buildingLayer = new maptalks.ExtrudePolygonLayer('data', data.features, {
        'forceRenderOnMoving': true,
        'ambientLight': [0, 0, 0]
    })
    .setStyle([{
            filter: ['==', 'percentage', 'null'],
            symbol: {
                'polygonFill': '#bbb'
            }
        },
        {
            filter: ['>', 'percentage', 70 ],
            symbol: {
                'polygonFill': '#7a0177'
            }
        },
        {
            filter: ['>', 'percentage', 20],
            symbol: {
                'polygonFill': '#c51b8a'
            }
        },
        {
            filter: ['>', 'percentage', 9],
            symbol: {
                'polygonFill': '#f768a1'
            }
        },
        {
            filter: ['>', 'percentage', 3],
            symbol: {
                'polygonFill': '#fbb4b9'
            }
        },
        {
            filter: ['>', 'percentage', -1],
            symbol: {
                'polygonFill': '#feebe2'
            }
        },
        {
            filter: true,
            symbol: {
                'polygonFill': '#bbb'
            }
        }
    ])
    .addTo(map);

var metric = new maptalks.control.Scale({
    'position': 'top-right',
    'maxWidth': 150,
    'metric': true,
    'imperial': false
});
map.addControl(metric);

class MyControl extends maptalks.control.Control {
    buildOn(map) {

        var div = maptalks.DomUtil.createEl('div', 'my-control'),
            grades = [0, 3, 9, 20, 70],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColorFor(grades[i] + 1) + '"></i> ' + grades[i] + '%' + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '%<br> <br>' : '+');
        }

        return div;
    }
};
const options = {
    'position': 'bottom-right',
};
MyControl.mergeOptions(options);

var legend = new MyControl();
map.addControl(legend);

function getColorFor(d) {
    return d > 70 ? '#7a0177' :
        d > 20 ? '#c51b8a' :
        d > 9 ? '#f768a1' :
        d > 3 ? '#fbb4b9' :
        d > -1 ? '#feebe2' :
        '#8f8f8f';
}
