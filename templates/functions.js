function props(newLat,newLng,newContent)
{
    this.coords = {lat: newLat, lng: newLng},
    this.information = newContent;
    this.icon = {path: 'map-icons-master/map-icons-master/src/icons/map-pin.svg',
        fillColor: '#FFFFFF',
        fillOpacity: 1,
        strokeColor: '',
        strokeWeight: 0
    };
};
//Place object with lat and long
var result;
var markers = [];

function initMap(){
    var options = {
        zoom: 13,
        center: {lat:37.7749, lng: -122.4194},
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
    };
    //creating a new map
    //set up strict bounds for map to SF
    var map = new google.maps.Map(document.getElementById('map'), options);
    //Array

    //takes in props object
    function addMarker(props)
    {
        //delete any existing markers
        //zoom in on marker
        console.log('hi',props.icon);
        var marker = new google.maps.Marker({
        position: props.coords,
        map: map,
        //used to set a custom icon
        icon: props.icon
        });

        //check content
        if(props.information)
        {
            var infoWindow = new google.maps.InfoWindow({
            content: props.information
            });

            marker.addListener('click', function(){
            infoWindow.open(map, marker)});
        }

        markers.push(marker);

    };

    function deleteMarkers(map)
    {
        for(var i = 0; i < markers.length; ++i)
        {
            markers[i].setMap(map);
        }

    };

    function clearMarkers()
    {
        deleteMarkers(null);
    };
    // set SF boundaries;

    var SFboundaries;
    var input = document.getElementById('input');

    var field = new google.maps.places.Autocomplete(input);
    field.bindTo('bounds', map);
    field.setFields(['geometry', 'name']);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

    field.addListener("place_changed", function() {
        result = field.getPlace();
        if (!result.geometry) {
            window.alert("No details available for input: '" + place.name + "'");
            return;
        } else {
            clearMarkers();
            var p = new props(result.geometry.location.lat(), result.geometry.location.lng(), result.name);
            options.center = {lat: result.geometry.location.lat(), lng:result.geometry.location.lng()};

            map.panTo(options.center);
            map.setZoom(20);
            //map = new google.maps.Map(document.getElementById('map'), options);
            console.log(result);
            addMarker(p);
            //set up JSON for flask to handle
            var location = result.geometry.location.toJSON();
            console.log(location);
            //call Flask function - returns JSON
            $.post("/results", location);
            input.value = "";
            var results = $.get("/results");
            console.log(results);
            //get multiple JSON strings
            //create markers for each
        }

        //TODO search for vehicle incidents - backend
        //TODO back end code
    });
}
