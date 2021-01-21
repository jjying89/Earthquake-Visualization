// create map object
var myMap = L.map("map", {
  center: [50.000, -50.000],
  zoom: 1
});

// add tile layer to the map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 5,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
}).addTo(myMap);

// data url
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

// retrieve data
d3.json(url, function(data) {

  // console.log(data.features);

  // loop through data
  for (var i = 0; i < data.features.length; i++) {
    
    var location = data.features[i].geometry;
    var earthquakeDepth = location.coordinates[2];
    var magnitude = data.features[i].properties.mag;
    var radiusSize = magnitude*50000;
    var place = data.features[i].properties.place;
    var time = data.features[i].properties.time;
    
    // color for earthake depth
    function chooseColor(x) {
        switch (true) {
        case (x<=10):
          return "#00FF00";
          break;
        case (x>10 && x<=30):
          return "#ADFF2F";
          break;
        case (x>30 && x<=50):
          return "#FFFF00";
          break;
        case (x>50 && x<=70):
          return "#FFD700";
          break;
        case (x>70 && x<=90):
          return "#FFA500";
          break;
        default:
          return "#FF0000";
        }
    };

    // create circles for eath earthquake
    if (location) {
      L.circle([location.coordinates[1], location.coordinates[0]], {
        stroke: true,
        fillOpacity: 0.5,
        color: "black",
        weight: 1,
	    fillColor: chooseColor(earthquakeDepth),
        radius: radiusSize
      
      // add popup with earthquake info
      }).bindPopup("<h3>" + place +
      "</h3><hr><p>" + new Date(time) + 
      "</p><p>Magnitude: " + magnitude +
      "</p><p>Depth: " + earthquakeDepth + "</p>"
      
      ).addTo(myMap);
    }
  }
  
  // color for map legend
  function getColor(d) {
    return d > 90 ? '#FF0000' :
           d > 70  ? '#FFA500' :
           d > 50  ? '#FFD700' :
           d > 30  ? '#FFFF00' :
           d > 10  ? '#ADFF2F' :
           d > -10  ? '#00FF00' :
                      '#00FF0';
  }

  // set up legend
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [-10, 10, 30, 50, 70, 90],
        labels = [];

    // loop through intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
  };

  legend.addTo(myMap);

});







