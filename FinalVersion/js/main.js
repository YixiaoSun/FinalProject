var map = L.map('map', {
  center: [40.000, -75.1090],
  zoom: 11
});

var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);

//instruction
var insCount = 0;
$(".instruction-btn").click(function(e){
  insCount=insCount+1;
  if (insCount%2===1){
    $(".instruction-container").show();
  }
  else{
    $(".instruction-container").hide();
  }
});

//Heat map
var heatDataSet = "https://raw.githubusercontent.com/YixiaoSun/Final/master/data";
var featureGroup;
var heatNumber = 0;

//Set style
var heatStyle = function(feature) {
    switch (feature.properties.LEVEL){
      case 1:
      return {fillColor:'#47A09C',
              weight: 0.2,
              opacity: 1,
              color: 'white',
              dashArray: '3',
              fillOpacity: 0.4};
      case 2:
      return {fillColor:'#A8DF90',
              weight: 0.2,
              opacity: 1,
              color: 'white',
              dashArray: '3',
              fillOpacity: 0.4};
      case 3:
      return {fillColor:'#E6F791',
              weight: 0.2,
              opacity: 1,
              color: 'white',
              dashArray: '3',
              fillOpacity: 0.4};
      case 4:
      return {fillColor:'#FBB45E',
              weight: 0.2,
              opacity: 1,
              color: 'white',
              dashArray: '3',
              fillOpacity: 0.4};
      case 5:
      return {fillColor:'#D5363B',
              weight: 0.2,
              opacity: 1,
              color: 'white',
              dashArray: '3',
              fillOpacity: 0.4};
      }
    };

//Set filter
var heatFilter = function(feature){
  if (feature.properties.LEVEL===" "){
        return false;
      }
      else{
        return true;
      }
};

//Add legend
var getHeatColor = function(d) {
  switch (d) {
            case '1': return '#47A09C';
            case '2': return '#A8DF90';
            case '3': return '#E6F791';
            case '4': return '#FBB45E';
            case '5': return '#D5363B';
          }
};
var heatLegend = L.control({position: 'bottomright'});
heatLegend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'legend'),
  categories = ["Level 1: -7.96 - -3.55","Level 2: -3.53 - -1.32","Level 3: -1.31 - 0",
  "Level 4: 0 - 1.58","Level 5: 1.59- 4.23"],
  colors = ["1","2","3","4","5"];
  labels = ["Temperature Difference from Philadelphia's Mean (°F) <br>"];
  // loop through our density intervals and generate a label with a colored square for each interval
  div.innerHTML = labels.join('<br>');
  for (var i = 0; i < categories.length; i++) {
    div.innerHTML +=
    '<i class="square" style="background:' + getHeatColor(colors[i]) + '"></i> ' +
    (categories[i] ? categories[i] + '<br>' : '+');
  }
  return div;
};

//Highlight when is clicked
function highlightFeature1(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 2,
        color: 'grey',
        fillOpacity: 0.6
    });
}

function resetHighlight1(e) {
    featureGroup.resetStyle(e.target);
}

function highlightHeatFeature(layer) {
    layer.on({
        mouseover: highlightFeature1,
        mouseout: resetHighlight1
    });
}

//Add information
//Round number
precisionRound = function(number) {
  var hunTimes = number*100;
  var newHunTimes = Math.round(hunTimes);
  var newNum = newHunTimes/100;
  return newNum;

};

var infoHeat = function(layer) {
  layer.on('click', function (event) {
    var display1;
    var display2;
    var display3;
    display1= layer.feature.properties.GEOID;
    display2= precisionRound(layer.feature.properties.GAP);
    display3= layer.feature.properties.LEVEL;
    $("#BG-ID").text(display1);
    $("#Temp-Gap").text(display2);
    $("#Temp-Level").text(display3);
  });
};


//Cooling centers
var coolingDataSet = "https://raw.githubusercontent.com/yutingsssun/Final/master/CoolingCenterPhilly.geojson";
var featureGroup2;
var coolingNumber = 0;
var appState = {
  "data": undefined,
  "location": undefined,
  "air": undefined,
  "recommended": undefined
};

// Creat circle markers for feature layer-based geojson data.
var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.9
};

var pointToLayer = function(feature,latlng) {
  return L.circleMarker(latlng, geojsonMarkerOptions);
};
var getColor = function(d) {
  switch (d) {
            case 'PHA Senior Sites': return '#798234';
            case 'Library Branch': return '#f0c6c3';
            case 'Main Library': return '#d0d3a2';
            case 'Outdoor Pool': return '#d46780';
            case 'Indoor Pool': return '#f97b72';
            case 'Sprayground': return '#E68310';
          }
};

function coolingStyle(feature) {
    return {
        fillColor: getColor(feature.properties.LocationType),
        weight: 1.5,
        opacity: 1,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.75
    };
}

//Add legend
var legend1 = L.control({position: 'bottomright'});
legend1.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'legend'),
  categories = ["PHA Senior Sites","Library Branch","Main Library","Outdoor Pool","Indoor Pool","Sprayground"],
  labels = ["Categories of Cooling Centers <br>"];
  div.innerHTML = labels.join('<br>');
  // loop through our density intervals and generate a label with a colored square for each interval
  for (var i = 0; i < categories.length; i++) {
    div.innerHTML +=
    '<i class="circle" style="background:' + getColor(categories[i]) + '"></i> ' +
    (categories[i] ? categories[i] + '<br>' : '+');
  }
  return div;
};

//Set original location icon
var locationIcon = L.icon({
    iconUrl:"js/images/icon-01.png",
    iconSize: [28,36]
});

// Control that shows state info on hover
var info = L.control();

info.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info');
  this.update();
  return this._div;
};

info.update = function (props) {
  this._div.innerHTML =  (props ?
    '<h4>'+props.name+'</h4>' +
    '</b><br />' + '<h5>'+ props.LocationType +'</h5>'+
    '</b><br />'+ '<h6>' + props.Location +
    '</b><br />' + props.PhoneNumber +
    '</b><br />'+ props.SummerHours +'</h6>'
    : 'CLICK A POINT');
  };



//Download data and others
$(document).ready(function(){
  $.ajax(heatDataSet).done(function(data){
    var parsedData = JSON.parse(data);
    $('#legend').hide();
    //Click the heatmap button
      $(".sidebar .heatmap .btn").click(function(e){
        heatNumber = heatNumber+1;
        //Render the heat map
        if (heatNumber%2 === 1){
          //Add color
          featureGroup = L.geoJson(parsedData, {
            style: heatStyle,
            filter: heatFilter
          }).addTo(map);
        //Show legends
        heatLegend.addTo(map);
        //Highlight featuers
        featureGroup.eachLayer(highlightHeatFeature);
        featureGroup.eachLayer(infoHeat);
      }
        else{
          map.removeLayer(featureGroup);
          map.removeControl(heatLegend);
        }
    });
  });

  $.ajax(coolingDataSet).done(function(data){
    //Click the Cooling Centers button
    $(".sidebar .coolingcenter .btn").click(function(e){
      coolingNumber = coolingNumber+1;
      //Render the heat map
      if (coolingNumber%2 === 1){
        var parsedData2 = JSON.parse(data);
        appState.data = parsedData2;
        //Add POINTS
        featureGroup2 = L.geoJson(parsedData2, {
          pointToLayer:pointToLayer,
          style: coolingStyle
        }).addTo(map);
        //Show legends
        // Add Legend to map
        legend1.addTo(map);
        info.addTo(map);
        //Clicking functions to get routes
        var clickCoolingCenter = function(layer){
          layer.on('click', function (feature) {
            featureGroup2.setStyle(coolingStyle);
            info.update();
            destLat=layer.feature.geometry.coordinates[1];
            destLng=layer.feature.geometry.coordinates[0];
            var layer0 = feature.target;
            layer0.setStyle({
              weight: 3,
              color: 'lightgrey',
              dashArray: '',
              fillOpacity: 0.9
            });
            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
              layer0.bringToFront();
            }
            info.update(layer.feature.properties);
          });
        };
        featureGroup2.eachLayer(clickCoolingCenter);
        //Route get
        var state = {
          position: {
            marker: null,
            updated: null
          }
        };
        var goToOrigin = _.once(function(lat, lng) {
          map.flyTo([lat, lng], 14);
        });
        var originLocation = {"lat":0,"log":0};
        var updatePosition = function(lat, lng, updated) {
          if (state.position.marker) {map.removeLayer(state.position.marker);}
          state.position.marker = L.marker([lat, lng], {icon:locationIcon});
          state.position.updated = updated;
          state.position.marker.addTo(map);
        };
        $(document).ready(function() {
          navigator.geolocation.getCurrentPosition(function(position) {
            updatePosition(position.coords.latitude, position.coords.longitude, position.timestamp);
            originLocation.lat = position.coords.latitude;
            originLocation.log = position.coords.longitude;
            $(".btn2").click(function(e){
              var line;
              if(line){
                map.removeLayer(line);
              }
              var routeurl = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + originLocation.log + ',' + originLocation.lat + ';' +destLng + ',' + destLat + '?access_token=pk.eyJ1IjoieWl4aWFvaGFoYSIsImEiOiJjamUwY3ZwaXQxdGM5MnlxcG95YnhnNW85In0.L4QTulp6RGLXgsozD0ABQQ';
              $.ajax({
                method: 'GET',
                url: routeurl
              }).done(function(data){
                var eachRoute = decode(data.routes[0].geometry);
                _.each(eachRoute,function(array){
                  var temp;
                  temp = array[0];
                  array[0] = array[1];
                  array[1] = temp;
                });
                line = turf.lineString(eachRoute);
                var myStyle = {
                   "color": '#3984ac',
                   "weight": 2,
                   "opacity": 0.8
                 };
                 var lineShape = L.geoJson(line, {style: myStyle}).addTo(map);
                 var distance = turf.lineDistance(line,{units:"miles"}).toLocaleString();
                 var newDistance = Math.round(distance*100)/100;
                 var time = data.routes[0].legs[0].duration;
                 var newTime = Math.round(time/60*10)/10;
                 $("#TR-DIS").show();
                 $("#TR-TI").show();
                 $("#TR-DIS").text(newDistance+" miles");
                 $("#TR-TI").text(newTime+" mins");
                 //Remove route
                 $(".btn3").click(function(e){
                   console.log("Clear");
                   map.removeLayer(lineShape);
                   $("#TR-DIS").hide();
                   $("#TR-TI").hide();
                 });
              });
            });
          });
        });
        //Filter function
        $(".sidebar .coolingcenter .btn1").click(function(e){
          map.removeLayer(featureGroup2);
          appState.location = $('#sel').val();
          appState.air = $('#checkbox1')[0].checked;
          appState.recommended = $('#checkbox2')[0].checked;
          var coolingFilter = function(feature) {
            var conditionStatus = true;
            if (appState.location !== 'All'){
              conditionStatus = conditionStatus && feature.properties.LocationType ===appState.location;
            }
            if (appState.air) { conditionStatus = conditionStatus && feature.properties.AirConditioner === "1"; }
            if (appState.recommended) { conditionStatus = conditionStatus && feature.properties.Recommended === "1"; }
            return conditionStatus;
          };

          featureGroup2 = L.geoJson(parsedData2, {
            pointToLayer:pointToLayer,
            style: coolingStyle,
            filter: coolingFilter
          }).addTo(map);

          //Clicking functions to get routes
          var clickCoolingCenter = function(layer){
            layer.on('click', function (feature) {
              featureGroup2.setStyle(coolingStyle);
              info.update();
              destLat=layer.feature.geometry.coordinates[1];
              destLng=layer.feature.geometry.coordinates[0];
              var layer0 = feature.target;
              layer0.setStyle({
                weight: 3,
                color: 'lightgrey',
                dashArray: '',
                fillOpacity: 0.9
              });
              if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                layer0.bringToFront();
              }
              info.update(layer.feature.properties);
            });
          };
          featureGroup2.eachLayer(clickCoolingCenter);

          //Route get
          var state = {
            position: {
              marker: null,
              updated: null
            }
          };
          var goToOrigin = _.once(function(lat, lng) {
            map.flyTo([lat, lng], 14);
          });
          var originLocation = {"lat":0,"log":0};
          var updatePosition = function(lat, lng, updated) {
            if (state.position.marker) {map.removeLayer(state.position.marker);}
            state.position.marker = L.marker([lat, lng], {icon:locationIcon});
            state.position.updated = updated;
            state.position.marker.addTo(map);
          };

          $(document).ready(function() {
            navigator.geolocation.getCurrentPosition(function(position) {
              updatePosition(position.coords.latitude, position.coords.longitude, position.timestamp);
              originLocation.lat = position.coords.latitude;
              originLocation.log = position.coords.longitude;
              $(".btn2").click(function(e){
                var line;
                if(line){
                  map.removeLayer(line);
                }
                var routeurl = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + originLocation.log + ',' + originLocation.lat + ';' +destLng + ',' + destLat + '?access_token=pk.eyJ1IjoieWl4aWFvaGFoYSIsImEiOiJjamUwY3ZwaXQxdGM5MnlxcG95YnhnNW85In0.L4QTulp6RGLXgsozD0ABQQ';
                $.ajax({
                  method: 'GET',
                  url: routeurl
                }).done(function(data){
                  var eachRoute = decode(data.routes[0].geometry);
                  _.each(eachRoute,function(array){
                    var temp;
                    temp = array[0];
                    array[0] = array[1];
                    array[1] = temp;
                  });
                  line = turf.lineString(eachRoute);
                  var myStyle = {
                     "color": '#3984ac',
                     "weight": 2,
                     "opacity": 0.8
                   };
                   var lineShape = L.geoJson(line, {style: myStyle}).addTo(map);
                   var distance = turf.lineDistance(line,{units:"miles"}).toLocaleString();
                   var newDistance = Math.round(distance*100)/100;
                   var time = data.routes[0].legs[0].duration;
                   var newTime = Math.round(time/60*10)/10;
                   $("#TR-DIS").show();
                   $("#TR-TI").show();
                   $("#TR-DIS").text(newDistance+" miles");
                   $("#TR-TI").text(newTime+" mins");
                   //Clear route
                   $(".btn3").click(function(e){
                     map.removeLayer(lineShape);
                     $("#TR-DIS").hide();
                     $("#TR-TI").hide();
                   });
                });
              });
            });
          });
        });
      }
      else{
        map.removeLayer(featureGroup2);
        map.removeControl(legend1);
        map.removeControl(info);
      }
    });
  });
});
