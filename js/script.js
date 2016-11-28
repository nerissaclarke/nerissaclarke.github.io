//PART I: CREATE MAP

//Set our Map view: use leaflet to focus on NYC with a zoom of 12
var map = L.map('map').setView([40.65,-73.93], 12);

//Set a tile layer using CartoDB tiles, create links for attribution 
var CartoDBTiles = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',{
  attribution: 'Map Data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> Contributors, Map Tiles &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});

//Add these tiles to our map:
map.addLayer(CartoDBTiles);

//Set data layer as empty global variable so we can use it in the layer control below:
var acsGeoJSON;

//Use jQuery, get geoJSON to grab geoJson layer, parse it, then plot it on the map using the plotDataset function:
//Start with the largest idea first
$.getJSON( "data/acs_data_joined.geojson", function( data ) {
    var dataset = data;
	//Draw the dataset on the map:
    plotDataset(dataset);
	//Create the sidebar with links to fire polygons on the map:
    createListForClick(dataset);
});

//Plot the dataset passed to it:
function plotDataset(dataset) {
    acsGeoJSON = L.geoJson(dataset, {
        style: acsStyle,
        onEachFeature: acsOnEachFeature
    }).addTo(map);
    //Create layer controls:
    createLayerControls(); 
}

//set the style of the geojson layer, dynamically based on the data
var acsStyle = function (feature, latlng) {
    var calc = calculatePercentage(feature);
    var style = {
        weight: 1,
        opacity: .25,
        color: 'grey',
        fillOpacity: fillOpacity(calc[2]),
        fillColor: fillColorPercentage(calc[2])
    };
    return style;
}
//Calculates stuff within the code, using the data so that you don't have to
function calculatePercentage(feature) {
    var output = [];
    var numerator = parseFloat(feature.properties.ACS_13_5YR_B07201_HD01_VD14);
    var denominator = parseFloat(feature.properties.ACS_13_5YR_B07201_HD01_VD01);
    var percentage = ((numerator/denominator) * 100).toFixed(0);
    output.push(numerator);
    output.push(denominator);
    output.push(percentage);
    return output;    
}
//Function that fills polygons with color based on the data:
function fillColorPercentage(d) {
    return d > 9 ? '#006d2c' :
           d > 7 ? '#31a354' :
           d > 5 ? '#74c476' :
           d > 3 ? '#a1d99b' :
           d > 1 ? '#c7e9c0' :
                   '#edf8e9';
}

//Function that sets the fillOpacity of layers -- if % is 0 then make polygons transparent:
function fillOpacity(d) {
    return d == 0 ? 0.0 :
                    0.75;
}

//Empty L.popup so we can fire it outside of the map:
var popup = new L.Popup();

//Set up a counter so we can assign an ID to each layer, so that you can start a loop:
var count = 0;

//Loops through and populates the popup dynmaically based on the data:
var acsOnEachFeature = function(feature,layer){
    var calc = calculatePercentage(feature);
    //Let's bind some feature properties to a pop up with an .on("click", ...) command. We do this so we can fire it both on and off the map:
    layer.on("click", function (e) {
        var bounds = layer.getBounds();
        var popupContent = "<strong>Total Population:</strong> " + calc[1] + "<br /><strong>Population Moved to US in Last Year:</strong> " + calc[0] + "<br /><strong>Percentage Moved to US in Last Year:</strong> " + calc[2] + "%";
        popup.setLatLng(bounds.getCenter());
        popup.setContent(popupContent);
        map.openPopup(popup);
    });  
    //We'll now add an ID to each layer so we can fire the popup outside of the map:
    layer._leaflet_id = 'acsLayerID' + count;
    count++;

}

function createLayerControls(){
  	//Add in layer controls:
    var baseMaps = {
        "CartoDB Basemap": CartoDBTiles,
    };
    var overlayMaps = {
        "Percentage Moved to US in Last Year": acsGeoJSON,
    };
    //Add control:
    L.control.layers(baseMaps, overlayMaps).addTo(map);  
}

//Create legend and create a container for the legend and set the location:
var legend = L.control({position: 'bottomright'});
//using a function, create a div element for the legend and return that div:
	legend.onAdd = function (map) {
    //A method in Leaflet for creating new divs and setting classes:
    	var div = L.DomUtil.create('div', 'legend'),
    	    amounts = [0, 1, 3, 5, 7, 9];
    	    div.innerHTML += '<p>Percentage Population<br />That Moved to US in<br />the Last Year</p>';
    	    for (var i = 0; i < amounts.length; i++) {
    	        div.innerHTML +=
    	            '<i style="background:' + fillColorPercentage(amounts[i] + 1) + '"></i> ' +
    	            amounts[i] + (amounts[i + 1] ? '% &ndash;' + amounts[i + 1] + '%<br />' : '% +<br />');
    	    }
    	return div;
};
//Add the legend to the map:
legend.addTo(map);

//PART II: Adding the Sidebar outside of the Map

//Create function to create a list in the right hand column with links that will launch the pop-ups on the map:
function createListForClick(dataset) {
 	//Use d3 to select the div and then iterate over the dataset appending a list element with a link for 
 	//clicking and firing, first we'll create an unordered list ul elelemnt inside the <div id='list'></div>. 
 	//The result will be <div id='list'><ul></ul></div>
    var ULs = d3.select("#list")
              .append("ul");
 	//Now that we have a selection and something appended to the selection, let's create all of the list elements (li) with the dataset we have: 
    ULs.selectAll("li")
        .data(dataset.features)
        .enter()
        .append("li")
        .html(function(d) { 
            return '<a href="#">' + d.properties.ACS_13_5YR_B07201_GEOdisplay_label + '</a>'; 
        })
        .on('click', function(d, i) {
            console.log(d.properties.ACS_13_5YR_B07201_HD02_VD01);
            console.log(i);
            var leafletId = 'acsLayerID' + i;
            map._layers[leafletId].fire('click');
        });
} //end of createListforClick function

//PART IIA: Adding data from an external API source, building data dots by hand (restructuring data to show dots)

//Lets add data from the API now, set a global variable to use in the D3 scale below.Use jQuery geoJSON to grab data from API:
$.getJSON( "https://data.cityofnewyork.us/resource/erm2-nwe9.json?$$app_token=rQIMJbYqnCnhVM9XNPHE9tj0g&borough=BROOKLYN&complaint_type=Noise&status=Open", function( data ) {
    var dataset = data;
    // draw the dataset on the map
    plotAPIData(dataset);
});

//Create a leaflet layer group to add your API dots to so we can add these to the map:
var apiLayerGroup = L.layerGroup();

//Since these data are not geoJson, we have to build our dots from the data by hand:
function plotAPIData(dataset) {
 	//Set up D3 ordinal scle for coloring the dots just once:
    var ordinalScale = setUpD3Scale(dataset);
  	//Loop through each object in the dataset and create a circle marker for each one using a jQuery for each loop:
    $.each(dataset, function( index, value ) {
    	//Check to see if lat or lon is undefined or null for error message
        if ((typeof value.latitude !== "undefined" || typeof value.longitude !== "undefined") || (value.latitude && value.longitude)) {
    	//Create a leaflet lat lon object to use in L.circleMarker:
            var latlng = L.latLng(value.latitude, value.longitude);
            var apiMarker = L.circleMarker(latlng, {
                stroke: false,
                fillColor: ordinalScale(value.descriptor),
                fillOpacity: 1,
                radius: 5
            });
     	//Bind a simple popup so we know what the noise complaint is:(This is sort of similar to a lookup function)
            apiMarker.bindPopup(value.descriptor);
       //Add dots to the layer group:
            apiLayerGroup.addLayer(apiMarker);
        }
    });//This is the end of the plotAPIData function
    apiLayerGroup.addTo(map);
}

function setUpD3Scale(dataset) { 
	//Create unique list of descriptors, first we need to create an array of descriptors:
    var descriptors = [];
  	//Loop through descriptors and add to descriptor array:
    $.each(dataset, function( index, value ) {
        descriptors.push(value.descriptor);
    });
   //Use underscore to create a unique array: Don't fully understand the underscore thing here
   var descriptorsUnique = _.uniq(descriptors);
   //Create a D3 ordinal scale based on that unique array as a domain:
    var ordinalScale = d3.scale.category20()
        .domain(descriptorsUnique);
    return ordinalScale;
}


