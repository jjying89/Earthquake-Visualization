// // Store our API endpoint inside queryUrl
// var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

// // Perform a GET request to the query URL
// d3.json(queryUrl, function(data) {
//   // Once we get a response, send the data.features object to the createFeatures function

//   createFeatures(data.features);
// });

// function createFeatures(earthquakeData) {

//   // Define a function we want to run once for each feature in the features array
//   // Give each feature a popup describing the place and time of the earthquake
//   function onEachFeature(feature, layer) {
//     layer.bindPopup("<h3>" + feature.properties.place +
//       "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
//   }

//   // Create a GeoJSON layer containing the features array on the earthquakeData object
//   // Run the onEachFeature function once for each piece of data in the array
//   var earthquakes = L.geoJSON(earthquakeData, {
//     onEachFeature: onEachFeature
//   });

//   // Sending our earthquakes layer to the createMap function
//   createMap(earthquakes);
// }

// function createMap(earthquakes) {

//   // Define streetmap and darkmap layers
//   var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//     tileSize: 512,
//     maxZoom: 18,
//     zoomOffset: -1,
//     id: "mapbox/light-v10",
//     accessToken: API_KEY
//   });
  
//   // Define a baseMaps object to hold our base layers
//   var baseMaps = {
//     "Light Map": lightmap
//   };
  
//   // Create overlay object to hold our overlay layer
//   var overlayMaps = {
//     Earthquakes: earthquakes
//   };
  
//   // Create our map, giving it the streetmap and earthquakes layers to display on load
//   var myMap = L.map("map", {
//     center: [
//       37.09, -95.71
//     ],
//     zoom: 3,
//     layers: [lightmap, earthquakes]
//   });
  
//   // Create a layer control
//   // Pass in our baseMaps and overlayMaps
//   // Add the layer control to the map
//   L.control.layers(baseMaps, overlayMaps, {
//     collapsed: false
//   }).addTo(myMap);
// }

// Creating map object
var myMap = L.map("map", {
  center: [50.000, -50.000],
  zoom: 1
});

// Adding tile layer to the map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 5,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
}).addTo(myMap);

var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

d3.json(url, function(data) {

  console.log(data.features);

  for (var i = 0; i < data.features.length; i++) {
    
    var location = data.features[i].geometry;
    var earthquakeDepth = location.coordinates[2];
    var magnitude = data.features[i].properties.mag;
    var radiusSize = magnitude*50000;
    var place = data.features[i].properties.place;
    var time = data.features[i].properties.time;
    
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

    if (location) {
      L.circle([location.coordinates[1], location.coordinates[0]], {
        stroke: true,
        fillOpacity: 0.5,
        color: "black",
        weight: 1,
	    fillColor: chooseColor(earthquakeDepth),
        radius: radiusSize
      
      }).bindPopup("<h3>" + place +
      "</h3><hr><p>" + new Date(time) + 
      "</p><p>Magnitude: " + magnitude +
      "</p><p>Depth: " + earthquakeDepth + "</p>"
      
      ).addTo(myMap);
    }
  }
  
  function getColor(d) {
    return d > 90 ? '#FF0000' :
           d > 70  ? '#FFA500' :
           d > 50  ? '#FFD700' :
           d > 30  ? '#FFFF00' :
           d > 10   ? '#ADFF2F' :
           d > -10   ? '#00FF00' :
                      '#00FF0';
  }

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [-10, 10, 30, 50, 70, 90],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
  };

  legend.addTo(myMap);

});







