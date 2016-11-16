

var map = L.map('mapid').setView([40.719190, -73.996589], 13);

var CartoDBTiles = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',{
  attribution: 'Map Data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> Contributors, Map Tiles &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});


map.addLayer(CartoDBTiles);

function fillColor(d) {
    return d > 500000 ? '#006d2c' :
           d > 250000 ? '#31a354' :
           d > 100000 ? '#74c476' :
           d > 50000  ? '#a1d99b' :
           d > 10000  ? '#c7e9c0' :
                        '#edf8e9';
}

function radius(d) {
    return d > 9000 ? 20 :
           d > 7000 ? 12 :
           d > 5000 ? 8  :
           d > 3000 ? 6  :
           d > 1000 ? 4  :
                      2 ;
}
//Can use this with the network graph on the budget circles
var checkCashingStyle = function (feature, latlng){
    var checkCashingMarker = L.circleMarker(latlng, {
        stroke: false,
        fillColor: fillColor(feature.properties.amount),
        fillOpacity: 1,
        radius: radius(feature.properties.customers)
    });
    
    return checkCashingMarker;
    
}
//If you interact with the map, either highlight, click or leave...This code creates styles for each state
var checkCashingInteraction = function(feature,layer){
	var highlight = {
        stroke: true,
        color: '#ffffff', 
        weight: 3,
        opacity: 1,
    };

    var clickHighlight = {
        stroke: true,
        color: '#f0ff00', 
        weight: 3,
        opacity: 1,
    };

    var noHighlight = {
        stroke: false,
    };

//This is the action function. When hover, activate "highlight" state
layer.on('mouseover', function(e) {
        layer.setStyle(highlight);

        if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToFront();
        }
        
    });
//When not hover, activate "noHighlight" state
layer.on('mouseout', function(e) {
        layer.setStyle(noHighlight);                         
    });

layer.on("click",function(e){
    layer.bindPopup('<div class="popupStyle"><h3>' + feature.properties.name + '</h3><p>'+ feature.properties.address + '<br /><strong>Amount:</strong> $' + feature.properties.amount + '<br /><strong>Customers:</strong> ' + feature.properties.customers + '</p></div>').openPopup();
    layer.setStyle(clickHighlight); 
    });


//End of check cashing interaction function
};

var checkCashingCustomStuff = L.geoJson(null, {
	//pointToLayer draws it on the map. onEachFeature is the way to do interactions
    pointToLayer: checkCashingStyle,
    onEachFeature: checkCashingInteraction
});


//Converts this csv into a geoJSON file, then does the checkCashingCustomStuff function that maps the circles/colors/interactions
var checkCashingLayer = omnivore.csv('CheckCashing.csv', null, checkCashingCustomStuff).addTo(map);

//Make & place legend
var legend = L.control({position: 'bottomright'});
//Add legend
legend.onAdd = function (map) {
	//This is a different way to append a new element (d3). In leaflet it looks like DomUtil, with an id of "legend"
	var div = L.DomUtil.create('div', 'legend'),
	//The legends has two parts to it. The amounts and the # of customers.
	amounts = [0, 10000, 50000, 100000, 250000, 500000],
    customers = [0, 1000, 3000, 5000, 7000, 9000];

    div.innerHTML += '<p><strong>Amounts</strong></p>';
    	//loops through all of the amounts.
    	//Loop through the customers array. For each within the array set the border radius based on the larger part of the range (+1 makes sure that it is within the right size bucket in the radius function at the top).
		//Within the div add fill color buttons. Then add the range

    	
    	for (var i = 0; i < amounts.length; i++) {
            div.innerHTML +=
                '<i style="background:' + fillColor(amounts[i] + 1) + '"></i> ' +
                amounts[i] + "-" + (amounts[i + 1]) + '<br />';
        }

     div.innerHTML += '<p><strong>Customers</strong></p>';
        for (var i = 0; i < customers.length; i++) {
            var borderRadius = radius(customers[i] + 1);
            var widthHeight = borderRadius * 2;
            div.innerHTML +=
                '<i class="circle" style="width:' + widthHeight + 'px; height:' + widthHeight + 'px; -webkit-border-radius:' + borderRadius + 'px; -moz-border-radius:' + borderRadius + 'px; border-radius:' + borderRadius + 'px;"></i> ' +
                //Alternative for "-" is to do '? "&ndash"' as a way to do run both but before put ndash
                customers[i] + (customers[i + 1] ? '&ndash;' + customers[i + 1] + '<br />' : '+<br />');
        }
    return div;

//End of legend function
};

legend.addTo(map);

















































    














