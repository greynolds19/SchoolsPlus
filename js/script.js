
//initialize leaflet map, and move zoom control to top right
var map = L.map('map', {zoomControl: false})
  .addControl( L.control.zoom({position: 'topright'}) )
  .setView([38.6, -93.99], 5);



//sadd basemap tiles from mapbox
L.tileLayer('http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png', {
   attribution: 'Map Tiles: Stamen Design &mdash; Map Data: OpenStreetMap &mdash; Source: US Census Bureau',
    maxZoom: 18
}).addTo(map);


//About box click listeners
$('#about').on('click',function(){
  $('#mask').fadeIn(250);
  $('.popup').fadeIn(250);
});

$('.close').on('click',function(){
  $(this).parent().fadeOut(250);
  $('#mask').fadeOut(250);
});

 
//Start_Date color
function yearColor(d) {
    return d == '2010'   ? '#eff3ff' :
           d == '2011+'  ? '#c6dbef' :
           d == '2011'   ? '#9ecae1' :
           d == '2012+'  ? '#6baed6' :
           d == '2012'   ? '#3182bd' :
           d == '2013'   ? '#08519c' :
                           '#FF00FF' ; 

}

//cluster recruitment color
function binaryColor(d) {
    return d == '0' ? "#FFFFFF" :
           d == '1' ? "#000000" :
                      "#FF00FF" ;
}

//cluster recruitment weight
function getWeight(d) {
    return d == '0' ? .5 :
           d == '1' ? 3 :
                      5 ;
}


    //load geojson and style by data
    $.getJSON('data/schoolsfull.geojson',function(data){
        var geojsonLayer = L.geoJson(data.features, {
            pointToLayer: function (feature, latlng) {

                //circle
                var marker = L.circleMarker(latlng, {
                    radius: 9,
                    fillColor: yearColor(feature.properties.Start_Date),
                    color: "#000",
                    weight: getWeight(feature.properties.cluster_recruitment),
                    opacity: 1,
                    fillOpacity: 1
                });
                       
                marker.bindPopup( '<font size = "2">' + "District : " + feature.properties.district + '</font>' + 
                                  '<br>' + 
                                  '<b><br />' + "Start Date : " + feature.properties.Start_Date + '</b>' + 
                                  '<b><br />' + "Lottery : " + feature.properties.cluster_recruitment + '</b>' +
                                  '<br />' + "Public : " + feature.properties.full_implementer);
                marker.on('mouseover', function (e) {
            this.openPopup();
        });
        marker.on('mouseout', function (e) {
            this.closePopup();
        });
                return marker; 
            }   

}).addTo(map);
    });

//year Legend
var yearLegend = L.control({position: 'bottomright'});

yearLegend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info yearLegend'),
        grades = ["2010","2011+","2011","2012+","2012"],
        labels = [];

    // loop through our intervals and generate a label with a colored circle for each interval
    div.innerHTML +='<b>' + 'Start Year' + '</b><br>';
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + yearColor(grades[i]) + '"></i> ' +
            grades[i];
    }
    div.innerHTML += '<br>' + '&nbsp' + '&nbsp' + '&uarr;' +
                     '<br><small>' + 'Lottery school' + '</small>';

    return div;
};


yearLegend.addTo(map);


////CHOROPLETH Part

function choroColor(d) {
    console.log(d);
    return d < '2'  ? '#f7f7f7' :
           d < '4'  ? '#cccccc' :
           d < '6'  ? '#969696' :
                      '#525252' ;
}

function styleChoro(feature) {
    return {
        fillColor: choroColor(feature.properties.DP0200001),
        weight: .5,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.6
    };
}

L.geoJson(tractData, {style: styleChoro}).addTo(map);

//choroLegend
var choroLegend = L.control({position: 'bottomright'});

choroLegend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info choroLegend'),
        grades = [0,2,4,6],
        labels = [];

    // loop through our intervals and generate a label with a colored square for each interval
    div.innerHTML +='<b>' + 'Rental Vacancy Rate' + '</b><br>';
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + choroColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

choroLegend.addTo(map);






