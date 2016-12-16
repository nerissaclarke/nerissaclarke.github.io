//Add map from leaflet and set the view to show the USA
//var indmap = L.map('mapid').setView([41.2524, -95.9980], 4);
        //var gvmtmap = L.map('mapid2').setView([41.2524, -95.9980], 4);

//This is the link to the tiles that set what the map looks like
//var CartoDBTiles = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',{
 // attribution: 'Map Data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> Contributors, Map Tiles &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
//});

//Add map to page
//indmap.addLayer(CartoDBTiles);

//Need to add another layer for the CSV file: indmap.addLayer(ADD IN SOMETHING); d3 and leaflet talk to each other: https://bost.ocks.org/mike/leaflet/
       
//Adding in Census Data & JSON Data together

function industryColor (d) {
        return d == "ind2" ? "#238b45" :
             d =="ind3" ? "#88419d" :
             d =="ind4" ? "#2b8cbe" :
             d =="ind5" ? "#d7301f" :
             d =="ind6" ? "#02818a" :
             d =="ind7" ? "#ce1256" :
             d =="ind8" ? "#cc4c02" :
             d =="ind9" ? "#fdae61" :
             d =="ind10" ? "#66c2a5" :
             d =="ind11" ? "#9e0142" :
             d =="ind12" ? "#00441b" :
             d =="ind13" ? "#762a83" :
             d =="ind14" ? "#543005" :
             //d =="max" ? allIndustryStyle();
                         "Darkblue"
             }
//function to define a quantized scale to sort data values into buckets of opacity, 
var colorIntensity = d3.scale.quantize().range(["0.1", "0.3",".5",".75",".99"]);   

//var color = d3.scale.quantize()
//                    .range(["rgb(237,248,233)","rgb(186,228,179)","rgb(116,196,118)","rgb(49,163,84)","rgb(0,109,44)"])              

queue()
    .defer(d3.csv, "rawdata.csv")
    .defer(d3.json, "census2015_us_county.json")
    .await(ready);

//Activate the ready function to use both datasets
function ready(error, data, json) {
  if (error) return console.warn(error);
       

    colorIntensity.domain([
        d3.min(data, function(d) { return 0 ; }), 
        d3.max(data, function(d) { return d.ind8; })
    ]);

    //Convert the csv data into numbers, from strings
    data.forEach(function(d) {
        d.GEOid2 =+d.GEOid2
        d.STATEid=+d.STATEid
        d.ind1=+d.ind1
        d.ind2=+d.ind2
        d.ind3=+d.ind3
        d.ind4=+d.ind4
        d.ind5=+d.ind5
        d.ind6=+d.ind6
        d.ind7=+d.ind7
        d.ind8=+d.ind8
        d.ind9=+d.ind9
        d.ind10=+d.ind10
        d.ind11=+d.ind11
        d.ind12=+d.ind12
        d.ind13=+d.ind13
        d.ind14=+d.ind14
        d.max=+d.max
        d.nohealthinspercent=+d.nohealthinspercent
        d.occ1=+d.occ1
        d.occ2=+d.occ2
        d.occ3=+d.occ3
        d.occ4=+d.occ4
        d.occ5=+d.occ5
        d.pop=+d.pop
        d.retireincomebenefit=+d.retireincomebenefit
        d.retireincomepercent=+d.retireincomepercent
        d.snappercent=+d.snappercent
        d.ssbenefit=+d.ssbenefit
        d.ssibenefit=+d.ssibenefit
        d.ssipercent=+d.ssipercent
        d.sspercent=+d.sspercent
        d.unemp=+d.unemp
        d.workertype1=+d.workertype1
        d.workertype2=+d.workertype2
        d.workertype3=+d.workertype3
        d.workertype4=+d.workertype4        
        d.cashassistbenefit=+d.cashassistbenefit
        d.cashassistpercent=+d.cashassistpercent
        d.earningincomepercent=+d.earningincomepercent
        d.familypovertypercent=+d.familypovertypercent
        });

    //Another way to do this is to do a loop and write: "var x = parseFloat(data[i].ind2)" which converts strings into numbers
      console.log(data[10]);
      console.log(json.features[10]);

      //Create elements that help to make the map (within the data function)

      //Create width/height
      var w = 1000;
      var h = 500;
  
      //Connect map and place it on the page. Translate /2 places it in the middle (centers it). Size it to 500
      var projection = d3.geo.albersUsa()
                       .translate([w/2, h/2])
                        //Changing the scale makes it larger or smaller
                       .scale([1000]);
  
      //This is what actually draws the map
      var path = d3.geo.path()
                  .projection(projection);
  
      //Create the container to hold the map
      var svg = d3.select("#mapid2")
              .append("svg")
              .attr("width", w)
              .attr("height", h);
  
      //Location Variable within the csv file (Empty)
      var LookupLocation = {};
      var Ind2lookup = {};
      var Ind3lookup = {};
      var Ind4lookup = {};
      var Ind5lookup = {};

     //Push location data into LookupLocation variable, connects the id number to the readable name, good for labels
      data.forEach(function(d) {
         LookupLocation[d.GEOid] = d.countyname;
         Ind2lookup[d.GEOid] = d.ind2;
         Ind3lookup[d.GEOid]= d.ind3;
         Ind4lookup[d.GEOid]= d.ind4;
        });

      console.log()
//
      for (var i = 0; i < data.length; i++) {
            var dataCountyID = data[i].GEOid; 
            var countyname= data[i].countyname;
            var agriculture= data[i].ind2;
            var construction= data[i].ind3;
            var manufacturing= data[i].ind4;
            var wholesaleTrade= data[i].ind5;
            var retailTrade= data[i].ind6;
            var transportation= data[i].ind7;
            var Information= data[i].ind8;
            var finance = data[i].ind9;
            var professional= data[i].ind10;
            var education = data[i].ind11;
            var arts = data[i].ind12;
            var other = data[i].ind13;
            var publicadmin = data[i].ind14;
            var unemployed= data[i].unemp;

            for (var j = 0; j < json.features.length; j++) {   
                var jsonCountyID = json.features[j].properties.AFFGEOID;
                    if (dataCountyID == jsonCountyID) { 
                        //Copy the data value into the JSON:
                        json.features[j].properties.value= dataCountyID;
                        json.features[j].properties.countyname= data[i].countyname;
                        json.features[j].properties.ind2 = data[i].ind2;
                        json.features[j].properties.ind3 = data[i].ind3;
                        json.features[j].properties.ind4= data[i].ind4;
                        json.features[j].properties.ind5 = data[i].ind5;
                        json.features[j].properties.ind6 = data[i].ind6;
                        json.features[j].properties.ind7 = data[i].ind7;
                        json.features[j].properties.ind8 = data[i].ind8;
                        json.features[j].properties.ind9 = data[i].ind9;
                        json.features[j].properties.ind10 = data[i].ind10;
                        json.features[j].properties.ind11 = data[i].ind11;
                        json.features[j].properties.ind12 = data[i].ind12;
                        json.features[j].properties.ind13 = data[i].ind13;
                        json.features[j].properties.ind14 = data[i].ind14;
                        json.features[j].properties.unemp= data[i].unemp;
                        break;  
                    }
            } 
                        
      };//Data for each
      console.log(json.features[2].properties.value); 
     // console.log(json.features[85].properties.ind2);   
     // console.log(json.features[2].properties.countyname); 
     // console.log(other);  
       //This works!
     //  console.log(LookupLocation[]);


        //Colorscale
        var colorScale = d3.scale.category20();

        //var colorScale = d3.scale.threshold() 
        //    .domain([1.0, 10.0 , 20.0, 30.0, 40.0 50.0])
        //    .range(["#fff", "#bcbddc", "#9e9ac8", "#756bb1", "#54278f", "#2c2d54"]);

//Draw Initial Chart
svg.selectAll(".counties")
     .data(json.features)
     .enter().append("path")
     .attr("class","counties")
     .attr("d", path)
     //.style("fill", colorScale(function(d){ return Ind4lookup[d.GEOid]}))
//    // .style("fill", function(d) { return opacityScale( ADD VARIABLE HERE[i]};
//   // return colorScale(LookupLocation[d.ind2])
     //console.log();

     
  //Use filter to filter data using the "value" from the selected "option" (THIS WORKS!!)
  $("#industryfilter").on("change", function pickIndustry(){
      var x = document.getElementById('industryfilter').value;
      console.log(x);



    //Would prefer to make this dynamic
   //colorIntensity.domain([
   //    d3.min(data, function(d) { return d.x; }), 
   //    d3.max(data, function(d) { return d.x; })
   //]);

      svg.selectAll('.counties')
        .data(json.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('class', 'counties')
        //.style("stroke", "blue")
        //.style("stroke-width", "1px" )    

      if (x == "max"){ drawAllIndustries();
        } else { drawMap(x);
          }

      //Don't think we need this, needed for a slider but not sure about select filter: d3.select("svg").select("#mapid").remove();
      });//end of pick Industry function

function drawMap (selectedIndustry){
    console.log("industry map");
    console.log(selectedIndustry);

    //1) color based on selection
    svg.selectAll(".counties")
       .style("fill", function(){return industryColor(selectedIndustry)});
    //data based on selection

    if (selectedIndustry=="ind2"){
          svg.selectAll(".counties")
              .style("fill-opacity", function(d){ 
              var value = d.properties.ind2
              if (value) {
                  return colorIntensity(value);
                } else {
                  return  colorIntensity(0);
              }
              console.log(value);
              });//End of fill opacity command
        };

    if (selectedIndustry=="ind3"){
          svg.selectAll(".counties")
              .style("fill-opacity", function(d){ 
              var value = d.properties.ind3
              if (value) {
                  return colorIntensity(value);
                } else {
                                    return  colorIntensity(0);
              }
              console.log(value);
              });//End of fill opacity command
        };
 if (selectedIndustry=="ind4"){
          svg.selectAll(".counties")
              .style("fill-opacity", function(d){ 
              var value = d.properties.ind4
              if (value) {
                  return colorIntensity(value);
                } else {
                                return  colorIntensity(0);
              }
              console.log(value);
              });//End of fill opacity command
        };

    if (selectedIndustry=="ind5"){
          svg.selectAll(".counties")
              .style("fill-opacity", function(d){ 
              var value = d.properties.ind5
              if (value) {
                  return colorIntensity(value);
                } else {
                                return  colorIntensity(0);
              }
              console.log(value);
              });//End of fill opacity command
        };
 if (selectedIndustry=="ind6"){
          svg.selectAll(".counties")
              .style("fill-opacity", function(d){ 
              var value = d.properties.ind6
              if (value) {
                  return colorIntensity(value);
                } else {
                                   return  colorIntensity(0);
              }
              console.log(value);
              });//End of fill opacity command
        };

    if (selectedIndustry=="ind7"){
          svg.selectAll(".counties")
              .style("fill-opacity", function(d){ 
              var value = d.properties.ind7
              if (value) {
                  return colorIntensity(value);
                } else {
                                    return  colorIntensity(0);
              }
              console.log(value);
              });//End of fill opacity command
        };
 if (selectedIndustry=="ind8"){
          svg.selectAll(".counties")
              .style("fill-opacity", function(d){ 
              var value = d.properties.ind8
              if (value) {
                  return colorIntensity(value);
                } else {return  colorIntensity(0);
        
              }
                                console.log(value);
              });//End of fill opacity command
        };

    if (selectedIndustry=="ind9"){
          svg.selectAll(".counties")
              .style("fill-opacity", function(d){ 
              var value = d.properties.ind9
              if (value) {
                  return colorIntensity(value);
                } else {
                  return  colorIntensity(0);
              }
              console.log(value);
              });//End of fill opacity command
        };
 if (selectedIndustry=="ind10"){
          svg.selectAll(".counties")
              .style("fill-opacity", function(d){ 
              var value = d.properties.ind10
              if (value) {
                  return colorIntensity(value);
                } else {
                return  colorIntensity(0);
              }
              console.log(value);
              });//End of fill opacity command
        };

    if (selectedIndustry=="ind11"){
          svg.selectAll(".counties")
              .style("fill-opacity", function(d){ 
              var value = d.properties.ind11
              if (value) {
                  return colorIntensity(value);
                } else {
                 return  colorIntensity(0);
              }
              console.log(value);
              });//End of fill opacity command
        };
 if (selectedIndustry=="ind12"){
          svg.selectAll(".counties")
              .style("fill-opacity", function(d){ 
              var value = d.properties.ind12
              if (value) {
                  return colorIntensity(value);
                } else {
                return  colorIntensity(0);
              }
              console.log(value);
              });//End of fill opacity command
        };

    if (selectedIndustry=="ind13"){
          svg.selectAll(".counties")
              .style("fill-opacity", function(d){ 
              var value = d.properties.ind13
              if (value) {
                  return colorIntensity(value);
                } else {
                  return  colorIntensity(0);
              }
              console.log(value);
              });//End of fill opacity command
        };
 if (selectedIndustry=="ind14"){
          svg.selectAll(".counties")
              .style("fill-opacity", function(d){ 
              var value = d.properties.ind14
              if (value) {
                  return colorIntensity(value);
                } else {
               return  colorIntensity(0);
              }
              console.log(value);
              });//End of fill opacity command
        };

    if (selectedIndustry=="unemp"){
          svg.selectAll(".counties")
              .style("fill-opacity", function(d){ 
              var value = d.properties.unemp
              if (value) {
                  return colorIntensity(value);
                } else {
                  return  colorIntensity(0);
              }
              console.log(value);
              });//End of fill opacity command
        };

}; //End of Draw map function

////Draw the All Industry Map!!
 function drawAllIndustries(){
      console.log("all industry")
    };

};//end of data/json "Ready" function        
